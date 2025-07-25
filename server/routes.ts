import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { generateSitemap, generateRobotsTxt, sitemapEntries } from "./sitemap";
import { captureEvent, captureError, addBreadcrumb, setSentryUser } from "./sentry";
import { getSentryIssues, resolveSentryIssue, bulkResolveSentryIssues } from "./sentry-api";
import { getActualSentryIssues, resolveActualSentryIssue, bulkResolveActualSentryIssues, addCommentToSentryIssue } from "./sentry-integration";
import { enhanceResume, generateIndustryKeywords, type EnhancementOptions } from "./ai/resumeEnhancer";
import { generateInterviewQuestion, evaluateInterviewResponse, generateInterviewTips } from "./ai/interviewSimulator";

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

      // Track successful submission
      captureEvent('Contact form submission saved to database', {
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

      // Fetch user feedback from Sentry
      const feedbackResponse = await fetch(
        `https://sentry.io/api/0/projects/${org}/${project}/user-feedback/`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!feedbackResponse.ok) {
        throw new Error(`Sentry API error: ${feedbackResponse.status} ${feedbackResponse.statusText}`);
      }

      const feedback = await feedbackResponse.json();

      // Also fetch issues that might be reported
      const issuesResponse = await fetch(
        `https://sentry.io/api/0/projects/${org}/${project}/issues/?query=is:unresolved`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!issuesResponse.ok) {
        throw new Error(`Sentry Issues API error: ${issuesResponse.status} ${issuesResponse.statusText}`);
      }

      const issues = await issuesResponse.json();

      // Combine and format the data
      const response = {
        userFeedback: feedback,
        unresolvedIssues: issues,
        summary: {
          totalFeedback: Array.isArray(feedback) ? feedback.length : 0,
          totalIssues: Array.isArray(issues) ? issues.length : 0
        }
      };

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

      // Track successful enhancement
      captureEvent('Resume enhanced successfully', {
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

      captureEvent('Interview question generated successfully', {
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

      captureEvent('Interview response evaluated successfully', {
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

  const httpServer = createServer(app);
  return httpServer;
}
