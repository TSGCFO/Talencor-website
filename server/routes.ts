import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { generateSitemap, generateRobotsTxt, sitemapEntries } from "./sitemap";
import { captureEvent, captureError, addBreadcrumb, setSentryUser } from "./sentry";

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

  const httpServer = createServer(app);
  return httpServer;
}
