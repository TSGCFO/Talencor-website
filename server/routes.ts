import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema,
  insertQuestionCategorySchema,
  insertCustomInterviewQuestionSchema,
  insertQuestionTagSchema,
  insertDynamicLinkSchema,
  insertJobPostingSchema
} from "@shared/schema";
import { z } from "zod";
import { generateSitemap, generateRobotsTxt, sitemapEntries } from "./sitemap";
import { captureEvent, captureError, addBreadcrumb, setSentryUser } from "./sentry";
import { getSentryIssues, resolveSentryIssue, bulkResolveSentryIssues } from "./sentry-api";
import { getActualSentryIssues, resolveActualSentryIssue, bulkResolveActualSentryIssues, addCommentToSentryIssue } from "./sentry-integration";
import { getSentryFeedbackSummary } from "./sentry-feedback-summary";
import { enhanceResume, generateIndustryKeywords, type EnhancementOptions } from "./ai/resumeEnhancer";
import { generateInterviewQuestion, evaluateInterviewResponse, generateInterviewTips } from "./ai/interviewSimulator";
import resumeRoutes from "./routes/resume";
import { requireAdmin, loginAdmin, logoutAdmin } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // <SessionMiddlewareSnippet>
  // Set up session storage - like giving everyone a locker to store their stuff
  // Sessions let us remember who's logged in between page visits
  app.use(session({
    secret: process.env.SESSION_SECRET || 'talencor-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
      httpOnly: true, // Prevents JavaScript from reading the cookie
      maxAge: 1000 * 60 * 60 * 24 // 24 hours in milliseconds
    }
  }));
  // </SessionMiddlewareSnippet>

  // <AdminAuthenticationRoutesSnippet>
  // These routes handle admin login and logout
  // Like the entrance and exit doors for the admin area
  
  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if they provided both username and password
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
      }
      
      // Try to log them in
      const result = await loginAdmin(username, password, req);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: "An error occurred during login"
      });
    }
  });
  
  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    try {
      await logoutAdmin(req);
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: "An error occurred during logout"
      });
    }
  });
  
  // Check if admin is logged in
  app.get("/api/admin/auth", (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
      res.json({
        isAuthenticated: true,
        user: {
          id: req.session.user.id,
          username: req.session.user.username
        }
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  // </AdminAuthenticationRoutesSnippet>

  // <ClientPortalRoutesSnippet>
  // These routes handle client access to their job postings
  // Like a special entrance for VIP customers to see their orders
  
  // Client login with access code
  app.post("/api/client/login", async (req, res) => {
    try {
      const { accessCode } = req.body;
      
      // Check if they provided an access code
      if (!accessCode) {
        return res.status(400).json({
          success: false,
          message: "Access code is required"
        });
      }
      
      // Look up the client by access code
      const client = await storage.getClientByAccessCode(accessCode);
      
      if (!client) {
        // <TrackFailedLoginSnippet>
        // Track failed login attempt for security monitoring
        await storage.createClientActivity({
          clientId: 0, // Use 0 for failed attempts
          activityType: 'failed_login',
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          details: JSON.stringify({ accessCode: accessCode.substring(0, 3) + '***' })
        });
        // </TrackFailedLoginSnippet>
        
        return res.status(401).json({
          success: false,
          message: "Invalid access code"
        });
      }
      
      // <UpdateClientLoginInfoSnippet>
      // Update login statistics and timestamp
      await storage.updateClientLoginInfo(client.id);
      
      // Track successful login activity
      await storage.createClientActivity({
        clientId: client.id,
        activityType: 'login',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        details: JSON.stringify({ timestamp: new Date().toISOString() })
      });
      // </UpdateClientLoginInfoSnippet>
      
      // Store client info in session
      req.session.client = {
        id: client.id,
        companyName: client.companyName,
        accessCode: client.accessCode
      };
      
      res.json({
        success: true,
        client: {
          id: client.id,
          companyName: client.companyName
        }
      });
    } catch (error) {
      console.error('Client login error:', error);
      res.status(500).json({
        success: false,
        message: "An error occurred during login"
      });
    }
  });
  
  // Client logout
  app.post("/api/client/logout", (req, res) => {
    req.session.client = undefined;
    res.json({ success: true, message: "Logged out successfully" });
  });
  
  // Check if client is logged in
  app.get("/api/client/auth", (req, res) => {
    if (req.session.client) {
      res.json({
        isAuthenticated: true,
        client: {
          id: req.session.client.id,
          companyName: req.session.client.companyName
        }
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  
  // Get client's job postings
  app.get("/api/client/job-postings", async (req, res) => {
    try {
      // Check if client is logged in
      if (!req.session.client) {
        return res.status(401).json({
          success: false,
          message: "Please log in to view your job postings"
        });
      }
      
      // Get all job postings for this client
      const jobPostings = await storage.getJobPostingsByCompany(req.session.client.companyName);
      
      res.json({
        success: true,
        jobPostings
      });
    } catch (error) {
      console.error('Error fetching client job postings:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch job postings"
      });
    }
  });

  // Update a job posting
  app.patch("/api/client/job-postings/:id", async (req, res) => {
    try {
      // Check if client is logged in
      if (!req.session.client) {
        return res.status(401).json({
          success: false,
          message: "Please log in to update job postings"
        });
      }

      const jobId = parseInt(req.params.id);
      
      // First, verify this job belongs to the client
      const job = await storage.getJobPostingById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job posting not found"
        });
      }

      if (job.companyName !== req.session.client.companyName) {
        return res.status(403).json({
          success: false,
          message: "You can only edit your own job postings"
        });
      }

      // Update the job posting
      const updatedJob = await storage.updateJobPosting(jobId, req.body);
      
      res.json({
        success: true,
        jobPosting: updatedJob
      });
    } catch (error) {
      console.error('Error updating job posting:', error);
      res.status(500).json({
        success: false,
        message: "Failed to update job posting"
      });
    }
  });

  // Delete a job posting
  app.delete("/api/client/job-postings/:id", async (req, res) => {
    try {
      // Check if client is logged in
      if (!req.session.client) {
        return res.status(401).json({
          success: false,
          message: "Please log in to delete job postings"
        });
      }

      const jobId = parseInt(req.params.id);
      
      // First, verify this job belongs to the client
      const job = await storage.getJobPostingById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job posting not found"
        });
      }

      if (job.companyName !== req.session.client.companyName) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own job postings"
        });
      }

      // Delete the job posting
      await storage.deleteJobPosting(jobId);
      
      res.json({
        success: true,
        message: "Job posting deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting job posting:', error);
      res.status(500).json({
        success: false,
        message: "Failed to delete job posting"
      });
    }
  });
  
  // <ClientCodeRequestRoutesSnippet>
  // Routes for self-service client code requests
  // Like an online application form for new VIP membership
  
  // Submit a new client code request
  app.post("/api/client/code-request", async (req, res) => {
    try {
      const { companyName, contactName, email, phone, reason } = req.body;
      
      // Validate required fields
      if (!companyName || !contactName || !email) {
        return res.status(400).json({
          success: false,
          message: "Company name, contact name, and email are required"
        });
      }
      
      // Create the code request
      const request = await storage.createClientCodeRequest({
        companyName,
        contactName,
        email,
        phone: phone || null,
        reason: reason || null,
        status: 'pending'
      });
      
      res.json({
        success: true,
        message: "Your request has been submitted and will be reviewed shortly",
        requestId: request.id
      });
    } catch (error) {
      console.error('Error creating code request:', error);
      res.status(500).json({
        success: false,
        message: "Failed to submit request"
      });
    }
  });
  
  // Check status of a code request
  app.get("/api/client/code-request/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getClientCodeRequestById(id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Request not found"
        });
      }
      
      res.json({
        success: true,
        request: {
          id: request.id,
          status: request.status,
          createdAt: request.createdAt,
          companyName: request.companyName
        }
      });
    } catch (error) {
      console.error('Error fetching code request:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch request"
      });
    }
  });
  // </ClientCodeRequestRoutesSnippet>
  
  // <AdminClientManagementRoutesSnippet>
  // Admin routes for managing clients and code requests
  // Like the back office for managing VIP memberships
  
  // Get all clients (admin only)
  app.get("/api/admin/clients", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });
  
  // Get client details with activities (admin only)
  app.get("/api/admin/clients/:id", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const client = await storage.getClientById(id);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      const activities = await storage.getClientActivities(id);
      
      res.json({
        client,
        activities
      });
    } catch (error) {
      console.error('Error fetching client details:', error);
      res.status(500).json({ error: "Failed to fetch client details" });
    }
  });
  
  // Update client (admin only)
  app.put("/api/admin/clients/:id", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const updated = await storage.updateClient(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });
  
  // Deactivate client (admin only)
  app.delete("/api/admin/clients/:id", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      await storage.deactivateClient(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deactivating client:', error);
      res.status(500).json({ error: "Failed to deactivate client" });
    }
  });
  
  // Get pending code requests (admin only)
  app.get("/api/admin/code-requests", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const { status } = req.query;
      const requests = await storage.getClientCodeRequests(
        status ? { status: status as string } : undefined
      );
      res.json(requests);
    } catch (error) {
      console.error('Error fetching code requests:', error);
      res.status(500).json({ error: "Failed to fetch code requests" });
    }
  });
  
  // Approve code request (admin only)
  app.post("/api/admin/code-requests/:id/approve", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const result = await storage.approveClientCodeRequest(id, req.session.user.id);
      
      res.json({
        success: true,
        client: result.client,
        accessCode: result.client.accessCode
      });
    } catch (error) {
      console.error('Error approving code request:', error);
      res.status(500).json({ error: "Failed to approve request" });
    }
  });
  
  // Reject code request (admin only)
  app.post("/api/admin/code-requests/:id/reject", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ error: "Rejection reason is required" });
      }
      
      const updated = await storage.rejectClientCodeRequest(id, req.session.user.id, reason);
      res.json(updated);
    } catch (error) {
      console.error('Error rejecting code request:', error);
      res.status(500).json({ error: "Failed to reject request" });
    }
  });
  
  // Generate bulk access codes (admin only)
  app.post("/api/admin/clients/bulk-generate", async (req, res) => {
    try {
      if (!req.session.user?.isAdmin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      
      const { clients: clientList } = req.body;
      
      if (!Array.isArray(clientList) || clientList.length === 0) {
        return res.status(400).json({ error: "Client list is required" });
      }
      
      const createdClients = [];
      
      for (const clientData of clientList) {
        const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
        const client = await storage.createClient({
          ...clientData,
          accessCode,
          codeExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        createdClients.push(client);
      }
      
      res.json({
        success: true,
        clients: createdClients
      });
    } catch (error) {
      console.error('Error generating bulk codes:', error);
      res.status(500).json({ error: "Failed to generate codes" });
    }
  });
  // </AdminClientManagementRoutesSnippet>
  // </ClientPortalRoutesSnippet>

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      // Add breadcrumb for incoming contact form submission
      addBreadcrumb('Contact form submission received', 'http', {
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent'),
      });

      const validatedData = insertContactSubmissionSchema.parse(req.body);

      // Set user context for error tracking
      setSentryUser({
        id: validatedData.email,
        email: validatedData.email,
        username: `${validatedData.firstName} ${validatedData.lastName}`,
      });

      const submission = await storage.createContactSubmission(validatedData);

      // Log successful submission
      console.log('Contact form submission saved to database', {
        submissionId: submission.id,
        inquiryType: validatedData.inquiryType,
        userEmail: validatedData.email,
        hasPhone: !!validatedData.phone,
      });

      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Track validation errors
        captureError(error, {
          action: 'contact_form_validation',
          validationErrors: error.errors,
          submittedData: req.body,
        });

        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        // Track unexpected errors
        captureError(error as Error, {
          action: 'contact_form_database_save',
          submittedData: req.body,
        });

        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Get contact submissions (for admin purposes)
  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve contact submissions" 
      });
    }
  });

  // Job Posting API Routes
  
  // Client access code verification endpoint
  app.post("/api/verify-client", async (req, res) => {
    try {
      const { accessCode } = req.body;
      
      if (!accessCode || typeof accessCode !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Access code is required"
        });
      }
      
      const client = await storage.getClientByAccessCode(accessCode.trim());
      
      if (!client) {
        return res.status(401).json({
          success: false,
          message: "Invalid access code"
        });
      }
      
      res.json({
        success: true,
        client: {
          companyName: client.companyName,
          contactName: client.contactName,
          email: client.email,
          phone: client.phone
        }
      });
    } catch (error) {
      captureError(error as Error, {
        action: 'verify_client',
      });
      res.status(500).json({
        success: false,
        message: "Failed to verify access code"
      });
    }
  });
  
  // Create a new job posting
  app.post("/api/job-postings", async (req, res) => {
    try {
      // Check honeypot field for spam prevention
      if (req.body.website) {
        return res.status(400).json({
          success: false,
          message: "Invalid submission detected"
        });
      }
      
      const validatedData = insertJobPostingSchema.parse(req.body);
      let jobPostingData: any = { ...validatedData };
      
      // Check if an access code was provided
      if (req.body.accessCode) {
        const client = await storage.getClientByAccessCode(req.body.accessCode.trim());
        if (client) {
          // Override with client data and mark as existing client
          jobPostingData = {
            ...jobPostingData,
            isExistingClient: true,
            clientId: client.id,
            status: 'contacted' // Fast-track status for verified clients
          };
        }
      }
      
      const posting = await storage.createJobPosting(jobPostingData);
      
      // Log the new posting for internal tracking
      console.log('New job posting created:', {
        id: posting.id,
        company: posting.companyName,
        jobTitle: posting.jobTitle,
        isExistingClient: posting.isExistingClient,
        status: posting.status
      });
      
      // <EmailNotificationTriggerSnippet>
      // After saving the job posting, we need to send emails
      // This is like ringing two bells: one for the customer and one for the team
      
      // <ImportEmailFunctionsSnippet>
      // We bring in our email sending tools only when we need them
      // This is like getting the mailman only when we have mail to send
      const { sendJobPostingConfirmation, sendInternalJobPostingNotification } = await import("./email.js");
      // </ImportEmailFunctionsSnippet>
      
      // <SendCustomerConfirmationSnippet>
      // First, send a "thank you" email to the person who posted the job
      // This lets them know we got their request
      await sendJobPostingConfirmation({
        contactName: posting.contactName,       // Their name for the greeting
        email: posting.email,                   // Where to send the email
        companyName: posting.companyName,       // Their company name
        jobTitle: posting.jobTitle,             // The job they need filled
        isExistingClient: posting.isExistingClient  // Are they already our customer?
      });
      // </SendCustomerConfirmationSnippet>
      
      // <SendTeamNotificationSnippet>
      // Second, alert our recruiting team about the new job
      // This email has ALL the details so the team knows what to do
      await sendInternalJobPostingNotification({
        id: posting.id,                         // The job posting number
        contactName: posting.contactName,       // Who submitted it
        email: posting.email,                   // Their email
        phone: posting.phone,                   // Their phone number
        companyName: posting.companyName,       // The company
        jobTitle: posting.jobTitle,             // What job needs filling
        location: posting.location,             // Where the job is
        employmentType: posting.employmentType, // Full-time, part-time, etc.
        isExistingClient: posting.isExistingClient,  // New or existing customer?
        anticipatedStartDate: posting.anticipatedStartDate,  // When they need someone
        salaryRange: posting.salaryRange,       // How much they'll pay
        jobDescription: posting.jobDescription, // What the job involves
        specialInstructions: posting.specialInstructions  // Any special needs
      });
      // </SendTeamNotificationSnippet>
      // </EmailNotificationTriggerSnippet>
      
      res.json({ success: true, id: posting.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Error creating job posting:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit job posting"
        });
      }
    }
  });
  
  // Get all job postings (with optional status filter)
  app.get("/api/job-postings", async (req, res) => {
    try {
      const { status } = req.query;
      const postings = await storage.getJobPostings(
        status ? { status: status as string } : undefined
      );
      res.json(postings);
    } catch (error) {
      console.error("Error fetching job postings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch job postings"
      });
    }
  });
  
  // Get a single job posting by ID
  app.get("/api/job-postings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const posting = await storage.getJobPostingById(id);
      
      if (!posting) {
        return res.status(404).json({
          success: false,
          message: "Job posting not found"
        });
      }
      
      res.json(posting);
    } catch (error) {
      console.error("Error fetching job posting:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch job posting"
      });
    }
  });
  
  // Update job posting status (Admin only)
  app.patch("/api/job-postings/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['new', 'contacted', 'contract_pending', 'posted', 'closed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status"
        });
      }
      
      const updated = await storage.updateJobPostingStatus(id, status);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Job posting not found"
        });
      }
      
      res.json({ success: true, posting: updated });
    } catch (error) {
      console.error("Error updating job posting status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update job posting status"
      });
    }
  });

  // Question Bank API Routes

  // Categories
  app.get("/api/question-bank/categories", async (req, res) => {
    try {
      const categories = await storage.getQuestionCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/question-bank/categories", async (req, res) => {
    try {
      const validatedData = insertQuestionCategorySchema.parse(req.body);
      const category = await storage.createQuestionCategory(validatedData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/question-bank/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertQuestionCategorySchema.partial().parse(req.body);
      const category = await storage.updateQuestionCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/question-bank/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuestionCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Tags
  app.get("/api/question-bank/tags", async (req, res) => {
    try {
      const tags = await storage.getQuestionTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.post("/api/question-bank/tags", async (req, res) => {
    try {
      const validatedData = insertQuestionTagSchema.parse(req.body);
      const tag = await storage.createQuestionTag(validatedData);
      res.json(tag);
    } catch (error) {
      console.error("Error creating tag:", error);
      res.status(400).json({ error: "Failed to create tag" });
    }
  });

  app.put("/api/question-bank/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertQuestionTagSchema.partial().parse(req.body);
      const tag = await storage.updateQuestionTag(id, validatedData);
      res.json(tag);
    } catch (error) {
      console.error("Error updating tag:", error);
      res.status(400).json({ error: "Failed to update tag" });
    }
  });

  app.delete("/api/question-bank/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuestionTag(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Failed to delete tag" });
    }
  });

  // Questions
  app.get("/api/question-bank/questions", async (req, res) => {
    try {
      const {
        search,
        category,
        difficulty,
        tags,
        favoritesOnly
      } = req.query;

      const filters: any = {};

      if (search && typeof search === 'string') {
        filters.search = search;
      }

      if (category && category !== 'all') {
        filters.categoryId = parseInt(category as string);
      }

      if (difficulty && difficulty !== 'all') {
        filters.difficulty = difficulty;
      }

      if (tags) {
        const tagIds = Array.isArray(tags) 
          ? tags.map(id => parseInt(id as string))
          : [parseInt(tags as string)];
        filters.tagIds = tagIds;
      }

      if (favoritesOnly === 'true') {
        filters.favoritesOnly = true;
        filters.userId = 1; // For now, using a default user ID
      }

      const questions = await storage.getCustomInterviewQuestions(filters);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.post("/api/question-bank/questions", async (req, res) => {
    try {
      const validatedData = insertCustomInterviewQuestionSchema.parse({
        ...req.body,
        createdBy: 'user' // For now, using a default creator
      });
      const question = await storage.createCustomInterviewQuestion(validatedData);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(400).json({ error: "Failed to create question" });
    }
  });

  app.put("/api/question-bank/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCustomInterviewQuestionSchema.partial().parse(req.body);
      const question = await storage.updateCustomInterviewQuestion(id, validatedData);
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(400).json({ error: "Failed to update question" });
    }
  });

  app.delete("/api/question-bank/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomInterviewQuestion(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Failed to delete question" });
    }
  });

  app.post("/api/question-bank/questions/:id/favorite", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const userId = 1; // For now, using a default user ID
      const result = await storage.toggleQuestionFavorite(userId, questionId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ error: "Failed to toggle favorite" });
    }
  });

  // SEO Routes
  app.get("/sitemap.xml", (req, res) => {
    try {
      const sitemap = generateSitemap(sitemapEntries);
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (req, res) => {
    try {
      const robotsTxt = generateRobotsTxt();
      res.set('Content-Type', 'text/plain');
      res.send(robotsTxt);
    } catch (error) {
      res.status(500).send("Error generating robots.txt");
    }
  });

  // Health check endpoint for production monitoring
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0"
    });
  });

  // Sentry user feedback endpoint
  app.get("/api/sentry-feedback", async (req, res) => {
    try {
      const authToken = process.env.SENTRY_AUTH_TOKEN || "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";
      const org = process.env.SENTRY_ORG || "tsg-fulfillment";
      const project = process.env.SENTRY_PROJECT || "talencor-frontend";
      const projectId = "4509575724613632"; // From screenshot

      // Fetch user feedback from Sentry - try multiple endpoints
      console.log(`Fetching feedback from organization: ${org}, project: ${project}`);
      
      // Try multiple endpoints for user feedback
      let allUserFeedback: any[] = [];
      let feedbackStats = {
        open: 0,
        resolved: 0,
        total: 0
      };

      // 1. Try user-reports endpoint  
      try {
        const userReportsUrl = `https://sentry.io/api/0/projects/${org}/${project}/user-reports/?statsPeriod=90d`;
        console.log(`Trying user-reports endpoint: ${userReportsUrl}`);
        
        const feedbackResponse = await fetch(userReportsUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (feedbackResponse.ok) {
          const feedback = await feedbackResponse.json();
          console.log(`User reports response:`, JSON.stringify(feedback).substring(0, 500));
          if (Array.isArray(feedback)) {
            allUserFeedback = [...allUserFeedback, ...feedback];
          }
        } else {
          console.log(`User reports API error: ${feedbackResponse.status} ${feedbackResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching user reports:", error);
      }

      // 2. Try organization-level feedback endpoint
      try {
        const orgFeedbackUrl = `https://sentry.io/api/0/organizations/${org}/user-feedback/?project=${projectId}&statsPeriod=90d`;
        console.log(`Trying org feedback endpoint with project ID: ${orgFeedbackUrl}`);
        
        const orgFeedbackResponse = await fetch(orgFeedbackUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (orgFeedbackResponse.ok) {
          const orgFeedback = await orgFeedbackResponse.json();
          console.log(`Org feedback response:`, JSON.stringify(orgFeedback).substring(0, 500));
          if (Array.isArray(orgFeedback)) {
            allUserFeedback = [...allUserFeedback, ...orgFeedback];
          }
        } else {
          console.log(`Org feedback API error: ${orgFeedbackResponse.status} ${orgFeedbackResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching org feedback:", error);
      }

      // 3. Fetch ALL issues to check for user feedback
      let issues: any[] = [];
      let issuesWithFeedback = 0;
      let resolvedIssues = 0;
      let unresolvedIssues = 0;
      
      try {
        const allIssuesUrl = `https://sentry.io/api/0/projects/${org}/${project}/issues/`;
        console.log(`Fetching all issues from: ${allIssuesUrl}`);
        
        const issuesResponse = await fetch(allIssuesUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (issuesResponse.ok) {
          issues = await issuesResponse.json();
          console.log(`Total issues found: ${Array.isArray(issues) ? issues.length : 0}`);
          
          // Count feedback in issues
          if (Array.isArray(issues)) {
            issues.forEach((issue: any) => {
              if (issue.userReportCount && issue.userReportCount > 0) {
                issuesWithFeedback++;
              }
              if (issue.status === 'resolved') {
                resolvedIssues++;
              } else {
                unresolvedIssues++;
              }
            });
          }
        } else {
          console.log(`Issues API error: ${issuesResponse.status} ${issuesResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }

      // Count open vs resolved feedback
      if (Array.isArray(allUserFeedback)) {
        allUserFeedback.forEach((feedback: any) => {
          feedbackStats.total++;
          if (feedback.status === 'resolved' || feedback.issue?.status === 'resolved') {
            feedbackStats.resolved++;
          } else {
            feedbackStats.open++;
          }
        });
      }

      // Combine and format the data
      const response = {
        userFeedback: allUserFeedback,
        unresolvedIssues: issues.filter((i: any) => i.status !== 'resolved'),
        allIssues: issues,
        summary: {
          totalFeedback: allUserFeedback.length,
          openFeedback: feedbackStats.open,
          resolvedFeedback: feedbackStats.resolved,
          totalIssues: issues.length,
          issuesWithFeedback,
          resolvedIssues,
          unresolvedIssues
        }
      };

      console.log("Final response summary:", {
        totalFeedback: response.summary.totalFeedback,
        openFeedback: response.summary.openFeedback,
        resolvedFeedback: response.summary.resolvedFeedback,
        totalIssues: response.summary.totalIssues
      });
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching Sentry feedback:", error);
      captureError(error as Error, { endpoint: '/api/sentry-feedback' });
      res.status(500).json({ error: "Failed to fetch Sentry feedback" });
    }
  });

  // Sentry Issues Management API endpoints
  app.get("/api/sentry/issues", getSentryIssues);
  app.patch("/api/sentry/issues/:issueId/resolve", resolveSentryIssue);
  app.post("/api/sentry/issues/bulk-resolve", bulkResolveSentryIssues);
  
  // Real Sentry API integration endpoints
  app.get("/api/sentry/actual/issues", getActualSentryIssues);
  app.patch("/api/sentry/actual/issues/:issueId/resolve", resolveActualSentryIssue);
  app.post("/api/sentry/actual/issues/bulk-resolve", bulkResolveActualSentryIssues);
  app.post("/api/sentry/actual/issues/:issueId/comment", addCommentToSentryIssue);
  
  // <BackendSentryEndpointsSnippet>
  // Backend-specific Sentry endpoints (like a separate mailbox for backend errors)
  app.get("/api/sentry/backend/issues", (req, res) => {
    req.query.project = 'backend'; // Force backend project
    getActualSentryIssues(req, res);
  });
  
  app.get("/api/sentry/backend/issues/:issueId", async (req, res) => {
    try {
      const { issueId } = req.params;
      const response = await fetch(
        `https://sentry.io/api/0/projects/tsg-fulfillment/talencor-backend/issues/${issueId}/`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SENTRY_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({ error: `Issue not found: ${response.statusText}` });
      }

      const issue = await response.json();
      res.json({ success: true, issue });
    } catch (error) {
      console.error('Error fetching backend issue:', error);
      res.status(500).json({ error: 'Failed to fetch backend issue' });
    }
  });
  // </BackendSentryEndpointsSnippet>
  
  // Sentry feedback summary endpoint
  app.get("/api/sentry/feedback-summary", getSentryFeedbackSummary);

  // Resume Enhancement API endpoint
  app.post("/api/enhance-resume", async (req, res) => {
    try {
      const schema = z.object({
        resumeText: z.string().min(1, "Resume text is required"),
        jobCategory: z.string(),
        options: z.object({
          formatting: z.boolean(),
          keywords: z.boolean(),
          achievements: z.boolean(),
          skills: z.boolean(),
          summary: z.boolean(),
        })
      });

      const validatedData = schema.parse(req.body);

      // Track resume enhancement request
      addBreadcrumb('Resume enhancement requested', 'http', {
        jobCategory: validatedData.jobCategory,
        options: validatedData.options,
      });

      const result = await enhanceResume(
        validatedData.resumeText,
        validatedData.jobCategory,
        validatedData.options
      );

      // Log successful enhancement
      console.log('Resume enhanced successfully', {
        jobCategory: validatedData.jobCategory,
        optionsEnabled: Object.keys(validatedData.options).filter(k => validatedData.options[k as keyof EnhancementOptions]),
      });

      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: 'resume_enhancement_validation',
          validationErrors: error.errors,
        });
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        captureError(error as Error, {
          action: 'resume_enhancement_ai_processing',
          jobCategory: req.body.jobCategory,
        });
        res.status(500).json({ 
          success: false, 
          message: "Failed to enhance resume. Please try again." 
        });
      }
    }
  });

  // Get industry keywords API endpoint
  app.get("/api/industry-keywords/:industry", async (req, res) => {
    try {
      const { industry } = req.params;
      const keywords = await generateIndustryKeywords(industry);
      res.json({ success: true, keywords });
    } catch (error) {
      captureError(error as Error, {
        action: 'industry_keywords_generation',
        industry: req.params.industry,
      });
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate keywords" 
      });
    }
  });

  // Interview Simulator API endpoints
  app.post("/api/interview/generate-question", async (req, res) => {
    try {
      const schema = z.object({
        jobCategory: z.string(),
        experienceLevel: z.string(),
        questionNumber: z.number().min(1).max(10),
        previousQuestions: z.array(z.string()).optional()
      });

      const validatedData = schema.parse(req.body);

      addBreadcrumb('Interview question generation requested', 'http', {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        questionNumber: validatedData.questionNumber,
      });

      const result = await generateInterviewQuestion(validatedData);

      console.log('Interview question generated successfully', {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        questionNumber: validatedData.questionNumber,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: 'interview_question_validation',
          validationErrors: error.errors,
        });
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        captureError(error as Error, {
          action: 'interview_question_generation',
          jobCategory: req.body.jobCategory,
        });
        res.status(500).json({ 
          success: false, 
          message: "Failed to generate interview question. Please try again." 
        });
      }
    }
  });

  // Evaluate interview response
  app.post("/api/interview/evaluate-response", async (req, res) => {
    try {
      const schema = z.object({
        question: z.string().min(1),
        response: z.string().min(1),
        jobCategory: z.string(),
        experienceLevel: z.string()
      });

      const validatedData = schema.parse(req.body);

      addBreadcrumb('Interview response evaluation requested', 'http', {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        responseLength: validatedData.response.length,
      });

      const feedback = await evaluateInterviewResponse(
        validatedData.question,
        validatedData.response,
        validatedData.jobCategory,
        validatedData.experienceLevel
      );

      console.log('Interview response evaluated successfully', {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        score: feedback.score,
      });

      res.json({ success: true, feedback });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: 'interview_response_validation',
          validationErrors: error.errors,
        });
        res.status(400).json({ 
          success: false, 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        captureError(error as Error, {
          action: 'interview_response_evaluation',
          jobCategory: req.body.jobCategory,
        });
        res.status(500).json({ 
          success: false, 
          message: "Failed to evaluate response. Please try again." 
        });
      }
    }
  });

  // Get interview tips
  app.get("/api/interview/tips/:jobCategory", async (req, res) => {
    try {
      const { jobCategory } = req.params;
      const tips = await generateInterviewTips(jobCategory);
      res.json({ success: true, tips });
    } catch (error) {
      captureError(error as Error, {
        action: 'interview_tips_generation',
        jobCategory: req.params.jobCategory,
      });
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate interview tips" 
      });
    }
  });

  // Dynamic Links endpoints
  // Get a specific dynamic link by key
  app.get("/api/dynamic-links/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const link = await storage.getDynamicLink(key);
      
      if (!link) {
        return res.status(404).json({ 
          success: false, 
          message: "Link not found" 
        });
      }
      
      res.json({ success: true, link });
    } catch (error) {
      captureError(error as Error, {
        action: 'get_dynamic_link',
        key: req.params.key,
      });
      res.status(500).json({ 
        success: false, 
        message: "Failed to get dynamic link" 
      });
    }
  });

  // Create a new dynamic link
  app.post("/api/dynamic-links", async (req, res) => {
    try {
      const validatedData = insertDynamicLinkSchema.parse(req.body);
      const link = await storage.createDynamicLink(validatedData);
      
      console.log('Dynamic link created', {
        key: link.key,
        url: link.url,
      });
      
      res.json({ success: true, link });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid link data", 
          errors: error.errors 
        });
      } else {
        captureError(error as Error, {
          action: 'create_dynamic_link',
          data: req.body,
        });
        res.status(500).json({ 
          success: false, 
          message: "Failed to create dynamic link" 
        });
      }
    }
  });

  // Update a dynamic link
  app.put("/api/dynamic-links/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: "URL is required" 
        });
      }
      
      const link = await storage.updateDynamicLink(key, url);
      
      console.log('Dynamic link updated', {
        key: link.key,
        url: link.url,
      });
      
      res.json({ success: true, link });
    } catch (error) {
      captureError(error as Error, {
        action: 'update_dynamic_link',
        key: req.params.key,
        url: req.body.url,
      });
      res.status(500).json({ 
        success: false, 
        message: "Failed to update dynamic link" 
      });
    }
  });

  // Get all dynamic links
  app.get("/api/dynamic-links", async (req, res) => {
    try {
      const links = await storage.getAllDynamicLinks();
      res.json({ success: true, links });
    } catch (error) {
      captureError(error as Error, {
        action: 'get_all_dynamic_links',
      });
      res.status(500).json({ 
        success: false, 
        message: "Failed to get dynamic links" 
      });
    }
  });

  // Resume enhancement routes
  app.use("/api/resume", resumeRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
