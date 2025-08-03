import type { Express } from "express";
import { createServer, type Server } from "http";
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

export async function registerRoutes(app: Express): Promise<Server> {
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
  
  // Create a new job posting
  app.post("/api/job-postings", async (req, res) => {
    try {
      const validatedData = insertJobPostingSchema.parse(req.body);
      const posting = await storage.createJobPosting(validatedData);
      
      // TODO: Send notification email to recruiting team
      console.log('New job posting created:', {
        id: posting.id,
        company: posting.companyName,
        jobTitle: posting.jobTitle,
        isExistingClient: posting.isExistingClient
      });
      
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
  
  // Update job posting status
  app.patch("/api/job-postings/:id/status", async (req, res) => {
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
