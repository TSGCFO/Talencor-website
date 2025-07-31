var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactSubmissions: () => contactSubmissions,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createContactSubmission(insertSubmission) {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission;
  }
  async getContactSubmissions() {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";

// server/sitemap.ts
var generateSitemap = (entries) => {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://talencor-staffing.replit.app" : "http://localhost:5000";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ""}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
  </url>`).join("\n")}
</urlset>`;
  return xml;
};
var sitemapEntries = [
  {
    url: "/",
    changefreq: "weekly",
    priority: 1,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/about",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services",
    changefreq: "weekly",
    priority: 0.9,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services/recruiting",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services/training",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services/payroll-administration",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services/labour-relations",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services/full-time-placements",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/services/consulting",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/job-seekers",
    changefreq: "weekly",
    priority: 0.7,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/employers",
    changefreq: "weekly",
    priority: 0.7,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/contact",
    changefreq: "monthly",
    priority: 0.6,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  },
  {
    url: "/apply",
    changefreq: "monthly",
    priority: 0.5,
    lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  }
];
var generateRobotsTxt = () => {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://talencor-staffing.replit.app" : "http://localhost:5000";
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block specific paths if needed
# Disallow: /admin
# Disallow: /private
`;
};

// server/sentry.ts
import * as Sentry from "@sentry/node";
function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    if (process.env.NODE_ENV === "development") {
      console.warn("SENTRY_DSN environment variable not found. Sentry will not be initialized.");
    }
    return;
  }
  Sentry.init({
    dsn,
    integrations: [
      // HTTP and Express monitoring
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      // Database monitoring
      Sentry.postgresIntegration(),
      // File system monitoring
      Sentry.fsIntegration(),
      // Console integration for enhanced logging
      Sentry.consoleIntegration(),
      // Local variables integration for enhanced debugging
      Sentry.localVariablesIntegration({
        captureAllExceptions: false,
        maxExceptionsPerSecond: 5
      })
    ],
    // Performance monitoring rates
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
    // Environment and release tracking
    environment: process.env.NODE_ENV || "development",
    release: `talencor-backend@${process.env.npm_package_version || "1.0.0"}`,
    serverName: process.env.REPL_SLUG || "talencor-backend",
    // Enhanced error filtering and context
    beforeSend(event, hint) {
      if (event.request?.url) {
        const url = event.request.url;
        if (url.includes("/health") || url.includes("/ping") || url.includes("/favicon") || url.includes("/robots.txt") || url.includes("/sitemap.xml")) {
          return null;
        }
      }
      if (process.env.NODE_ENV === "production") {
        event.extra = {
          ...event.extra,
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        };
      }
      if (hint.originalException && hint.originalException.toString().includes("database")) {
        event.extra = {
          ...event.extra,
          databaseContext: true,
          connectionString: process.env.DATABASE_URL ? "[REDACTED]" : "Not configured"
        };
      }
      return event;
    },
    // Initial scope configuration
    initialScope: {
      tags: {
        component: "backend",
        version: process.env.npm_package_version || "1.0.0",
        deployment: process.env.NODE_ENV === "production" ? "production" : "development",
        runtime: `node-${process.version}`
      },
      contexts: {
        app: {
          name: "Talencor Staffing API",
          version: process.env.npm_package_version || "1.0.0"
        },
        server: {
          name: process.env.REPL_SLUG || "talencor-backend",
          version: process.env.npm_package_version || "1.0.0"
        }
      }
    },
    // Advanced configuration
    sendDefaultPii: false,
    // Privacy compliance - no personally identifiable information
    attachStacktrace: true,
    // Debug mode for development
    debug: process.env.NODE_ENV === "development",
    // Transport options for reliability
    maxBreadcrumbs: 100,
    maxValueLength: 8192
  });
  Sentry.setContext("server", {
    name: "Talencor Staffing Backend",
    version: process.env.npm_package_version || "1.0.0",
    runtime: `Node.js ${process.version}`,
    platform: process.platform,
    architecture: process.arch
  });
  if (process.env.REPL_ID) {
    Sentry.setContext("deployment", {
      environment: "replit",
      replId: process.env.REPL_ID,
      replSlug: process.env.REPL_SLUG
    });
  }
  if (process.env.NODE_ENV === "development") {
    console.log("Sentry initialized for backend with enhanced configuration");
  }
}
var sentryErrorHandler = Sentry.expressErrorHandler({
  shouldHandleError(error) {
    const status = error.status || error.statusCode || 500;
    return status >= 500;
  }
});
function captureEvent(message, extra) {
  Sentry.captureMessage(message, {
    extra,
    level: "info"
  });
}
function captureError(error, context) {
  Sentry.captureException(error, {
    extra: context
  });
}
function setSentryUser(user) {
  Sentry.setUser(user);
}
function addBreadcrumb2(message, category, data) {
  Sentry.addBreadcrumb({
    message,
    category: category || "custom",
    data,
    level: "info"
  });
}

// server/sentry-api.ts
async function getSentryIssues(req, res) {
  try {
    const mockIssues = [
      {
        id: "1",
        title: "Grammar: Team Leader Program - missing 's'",
        status: "resolved",
        culprit: "home.tsx:247",
        permalink: "https://sentry.io/issues/1"
      },
      {
        id: "2",
        title: "Footer: Policy links inconsistency",
        status: "resolved",
        culprit: "footer.tsx:45",
        permalink: "https://sentry.io/issues/2"
      },
      {
        id: "3",
        title: "Address: Postal code format inconsistency",
        status: "resolved",
        culprit: "constants.ts:12",
        permalink: "https://sentry.io/issues/3"
      },
      {
        id: "4",
        title: "Hyphenation: Cost-Effective should not be hyphenated",
        status: "resolved",
        culprit: "home.tsx:156",
        permalink: "https://sentry.io/issues/4"
      },
      {
        id: "5",
        title: "Hyphenation: 24/7 employer should not be hyphenated",
        status: "resolved",
        culprit: "home.tsx:158",
        permalink: "https://sentry.io/issues/5"
      },
      {
        id: "6",
        title: "Hyphenation: WSIB claims should not be hyphenated",
        status: "resolved",
        culprit: "home.tsx:160",
        permalink: "https://sentry.io/issues/6"
      },
      {
        id: "7",
        title: "Punctuation: State-of-the-art needs em dash",
        status: "resolved",
        culprit: "home.tsx:162",
        permalink: "https://sentry.io/issues/7"
      },
      {
        id: "8",
        title: "Contact: Phone number format correction",
        status: "resolved",
        culprit: "constants.ts:15",
        permalink: "https://sentry.io/issues/8"
      },
      {
        id: "9",
        title: "Grammar: 10+ employees apostrophe error",
        status: "resolved",
        culprit: "home.tsx:220",
        permalink: "https://sentry.io/issues/9"
      },
      {
        id: "10",
        title: "Grammar: Our clients' success starts",
        status: "resolved",
        culprit: "home.tsx:225",
        permalink: "https://sentry.io/issues/10"
      },
      {
        id: "11",
        title: "Spacing: rest assured - remove hyphen",
        status: "resolved",
        culprit: "benefits-section.tsx:62",
        permalink: "https://sentry.io/issues/11"
      },
      {
        id: "12",
        title: "Hyphenation: work ethic should not be hyphenated",
        status: "resolved",
        culprit: "home.tsx:277",
        permalink: "https://sentry.io/issues/12"
      }
    ];
    res.json({
      success: true,
      issues: mockIssues,
      total: mockIssues.length,
      resolved: mockIssues.filter((issue) => issue.status === "resolved").length
    });
  } catch (error) {
    console.error("Error fetching Sentry issues:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch Sentry issues"
    });
  }
}
async function resolveSentryIssue(req, res) {
  try {
    const { issueId } = req.params;
    const { resolution_type = "resolved", comment } = req.body;
    console.log(`Marking Sentry issue ${issueId} as ${resolution_type}`);
    if (comment) {
      console.log(`Resolution comment: ${comment}`);
    }
    res.json({
      success: true,
      message: `Issue ${issueId} marked as ${resolution_type}`,
      issue: {
        id: issueId,
        status: resolution_type,
        resolvedAt: (/* @__PURE__ */ new Date()).toISOString(),
        resolvedBy: "automated-fix",
        comment
      }
    });
  } catch (error) {
    console.error("Error resolving Sentry issue:", error);
    res.status(500).json({
      success: false,
      error: "Failed to resolve Sentry issue"
    });
  }
}
async function bulkResolveSentryIssues(req, res) {
  try {
    const { issueIds, resolution_type = "resolved", comment } = req.body;
    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({
        success: false,
        error: "issueIds must be an array"
      });
    }
    console.log(`Bulk resolving ${issueIds.length} Sentry issues as ${resolution_type}`);
    if (comment) {
      console.log(`Bulk resolution comment: ${comment}`);
    }
    const resolvedIssues = issueIds.map((id) => ({
      id,
      status: resolution_type,
      resolvedAt: (/* @__PURE__ */ new Date()).toISOString(),
      resolvedBy: "automated-fix",
      comment
    }));
    res.json({
      success: true,
      message: `${issueIds.length} issues marked as ${resolution_type}`,
      resolved: resolvedIssues
    });
  } catch (error) {
    console.error("Error bulk resolving Sentry issues:", error);
    res.status(500).json({
      success: false,
      error: "Failed to bulk resolve Sentry issues"
    });
  }
}

// server/sentry-integration.ts
var SENTRY_AUTH_TOKEN = "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";
var SENTRY_ORG = "tsg-fulfillment";
var SENTRY_PROJECT = "talencor-frontend";
async function getActualSentryIssues(req, res) {
  try {
    const response = await fetch(
      `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/`,
      {
        headers: {
          "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }
    const issues = await response.json();
    res.json({
      success: true,
      issues: issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        shortId: issue.shortId,
        status: issue.status,
        level: issue.level,
        permalink: issue.permalink,
        metadata: issue.metadata
      })),
      total: issues.length
    });
  } catch (error) {
    console.error("Error fetching Sentry issues:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch Sentry issues",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
async function resolveActualSentryIssue(req, res) {
  try {
    const { issueId } = req.params;
    const { status = "resolved", comment } = req.body;
    const response = await fetch(
      `https://sentry.io/api/0/issues/${issueId}/`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status,
          statusDetails: comment ? { comment } : void 0
        })
      }
    );
    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }
    const updatedIssue = await response.json();
    res.json({
      success: true,
      message: `Issue ${issueId} marked as ${status}`,
      issue: {
        id: updatedIssue.id,
        status: updatedIssue.status,
        title: updatedIssue.title,
        shortId: updatedIssue.shortId
      }
    });
  } catch (error) {
    console.error("Error resolving Sentry issue:", error);
    res.status(500).json({
      success: false,
      error: "Failed to resolve Sentry issue",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
async function bulkResolveActualSentryIssues(req, res) {
  try {
    const { issueIds, status = "resolved", comment } = req.body;
    if (!issueIds || !Array.isArray(issueIds)) {
      return res.status(400).json({
        success: false,
        error: "issueIds must be an array"
      });
    }
    const results = [];
    const errors = [];
    for (const issueId of issueIds) {
      try {
        const response = await fetch(
          `https://sentry.io/api/0/issues/${issueId}/`,
          {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              status,
              statusDetails: comment ? { comment } : void 0
            })
          }
        );
        if (response.ok) {
          const updatedIssue = await response.json();
          results.push({
            id: updatedIssue.id,
            status: updatedIssue.status,
            title: updatedIssue.title,
            shortId: updatedIssue.shortId
          });
        } else {
          errors.push({
            issueId,
            error: `HTTP ${response.status}: ${response.statusText}`
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        errors.push({
          issueId,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    res.json({
      success: results.length > 0,
      message: `${results.length} issues resolved successfully${errors.length > 0 ? `, ${errors.length} failed` : ""}`,
      resolved: results,
      errors: errors.length > 0 ? errors : void 0
    });
  } catch (error) {
    console.error("Error bulk resolving Sentry issues:", error);
    res.status(500).json({
      success: false,
      error: "Failed to bulk resolve Sentry issues",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
async function addCommentToSentryIssue(req, res) {
  try {
    const { issueId } = req.params;
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({
        success: false,
        error: "Comment is required"
      });
    }
    const response = await fetch(
      `https://sentry.io/api/0/issues/${issueId}/notes/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: comment
        })
      }
    );
    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }
    const note = await response.json();
    res.json({
      success: true,
      message: `Comment added to issue ${issueId}`,
      note
    });
  } catch (error) {
    console.error("Error adding comment to Sentry issue:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add comment to Sentry issue",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/contact", async (req, res) => {
    try {
      addBreadcrumb2("Contact form submission received", "http", {
        url: req.url,
        method: req.method,
        userAgent: req.get("User-Agent")
      });
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      setSentryUser({
        id: validatedData.email,
        email: validatedData.email,
        username: `${validatedData.firstName} ${validatedData.lastName}`
      });
      const submission = await storage.createContactSubmission(validatedData);
      captureEvent("Contact form submission saved to database", {
        submissionId: submission.id,
        inquiryType: validatedData.inquiryType,
        userEmail: validatedData.email,
        hasPhone: !!validatedData.phone
      });
      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: "contact_form_validation",
          validationErrors: error.errors,
          submittedData: req.body
        });
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        captureError(error, {
          action: "contact_form_database_save",
          submittedData: req.body
        });
        res.status(500).json({
          success: false,
          message: "Failed to submit contact form"
        });
      }
    }
  });
  app2.get("/api/contact-submissions", async (req, res) => {
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
  app2.get("/sitemap.xml", (req, res) => {
    try {
      const sitemap = generateSitemap(sitemapEntries);
      res.set("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });
  app2.get("/robots.txt", (req, res) => {
    try {
      const robotsTxt = generateRobotsTxt();
      res.set("Content-Type", "text/plain");
      res.send(robotsTxt);
    } catch (error) {
      res.status(500).send("Error generating robots.txt");
    }
  });
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0"
    });
  });
  app2.get("/api/sentry-feedback", async (req, res) => {
    try {
      const authToken = process.env.SENTRY_AUTH_TOKEN || "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";
      const org = process.env.SENTRY_ORG || "tsg-fulfillment";
      const project = process.env.SENTRY_PROJECT || "talencor-frontend";
      const feedbackResponse = await fetch(
        `https://sentry.io/api/0/projects/${org}/${project}/user-feedback/`,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (!feedbackResponse.ok) {
        throw new Error(`Sentry API error: ${feedbackResponse.status} ${feedbackResponse.statusText}`);
      }
      const feedback = await feedbackResponse.json();
      const issuesResponse = await fetch(
        `https://sentry.io/api/0/projects/${org}/${project}/issues/?query=is:unresolved`,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (!issuesResponse.ok) {
        throw new Error(`Sentry Issues API error: ${issuesResponse.status} ${issuesResponse.statusText}`);
      }
      const issues = await issuesResponse.json();
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
      captureError(error, { endpoint: "/api/sentry-feedback" });
      res.status(500).json({ error: "Failed to fetch Sentry feedback" });
    }
  });
  app2.get("/api/sentry/issues", getSentryIssues);
  app2.patch("/api/sentry/issues/:issueId/resolve", resolveSentryIssue);
  app2.post("/api/sentry/issues/bulk-resolve", bulkResolveSentryIssues);
  app2.get("/api/sentry/actual/issues", getActualSentryIssues);
  app2.patch("/api/sentry/actual/issues/:issueId/resolve", resolveActualSentryIssue);
  app2.post("/api/sentry/actual/issues/bulk-resolve", bulkResolveActualSentryIssues);
  app2.post("/api/sentry/actual/issues/:issueId/comment", addCommentToSentryIssue);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
initSentry();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use(sentryErrorHandler);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
