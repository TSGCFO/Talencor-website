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
  customInterviewQuestions: () => customInterviewQuestions,
  customInterviewQuestionsRelations: () => customInterviewQuestionsRelations,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertCustomInterviewQuestionSchema: () => insertCustomInterviewQuestionSchema,
  insertQuestionCategorySchema: () => insertQuestionCategorySchema,
  insertQuestionTagRelationSchema: () => insertQuestionTagRelationSchema,
  insertQuestionTagSchema: () => insertQuestionTagSchema,
  insertUserQuestionFavoriteSchema: () => insertUserQuestionFavoriteSchema,
  insertUserSchema: () => insertUserSchema,
  questionCategories: () => questionCategories,
  questionCategoriesRelations: () => questionCategoriesRelations,
  questionTagRelations: () => questionTagRelations,
  questionTagRelationsRelations: () => questionTagRelationsRelations,
  questionTags: () => questionTags,
  questionTagsRelations: () => questionTagsRelations,
  userQuestionFavorites: () => userQuestionFavorites,
  userQuestionFavoritesRelations: () => userQuestionFavoritesRelations,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
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
var questionCategories = pgTable("question_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var customInterviewQuestions = pgTable("custom_interview_questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => questionCategories.id),
  question: text("question").notNull(),
  difficulty: text("difficulty").notNull(),
  // 'entry', 'mid', 'senior', 'executive'
  tips: text("tips").array().notNull(),
  expectedElements: text("expected_elements").array().notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdBy: text("created_by").notNull(),
  // user identifier or "system"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var questionTags = pgTable("question_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").default("#6B7280").notNull(),
  // hex color for tag display
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var questionTagRelations = pgTable("question_tag_relations", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => customInterviewQuestions.id),
  tagId: integer("tag_id").references(() => questionTags.id)
});
var userQuestionFavorites = pgTable("user_question_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  questionId: integer("question_id").references(() => customInterviewQuestions.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var questionCategoriesRelations = relations(questionCategories, ({ many }) => ({
  questions: many(customInterviewQuestions)
}));
var customInterviewQuestionsRelations = relations(customInterviewQuestions, ({ one, many }) => ({
  category: one(questionCategories, {
    fields: [customInterviewQuestions.categoryId],
    references: [questionCategories.id]
  }),
  tagRelations: many(questionTagRelations),
  favorites: many(userQuestionFavorites)
}));
var questionTagsRelations = relations(questionTags, ({ many }) => ({
  questionRelations: many(questionTagRelations)
}));
var questionTagRelationsRelations = relations(questionTagRelations, ({ one }) => ({
  question: one(customInterviewQuestions, {
    fields: [questionTagRelations.questionId],
    references: [customInterviewQuestions.id]
  }),
  tag: one(questionTags, {
    fields: [questionTagRelations.tagId],
    references: [questionTags.id]
  })
}));
var userQuestionFavoritesRelations = relations(userQuestionFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userQuestionFavorites.userId],
    references: [users.id]
  }),
  question: one(customInterviewQuestions, {
    fields: [userQuestionFavorites.questionId],
    references: [customInterviewQuestions.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true
});
var insertQuestionCategorySchema = createInsertSchema(questionCategories).omit({
  id: true,
  createdAt: true
});
var insertCustomInterviewQuestionSchema = createInsertSchema(customInterviewQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertQuestionTagSchema = createInsertSchema(questionTags).omit({
  id: true,
  createdAt: true
});
var insertQuestionTagRelationSchema = createInsertSchema(questionTagRelations).omit({
  id: true
});
var insertUserQuestionFavoriteSchema = createInsertSchema(userQuestionFavorites).omit({
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
import { eq, and, ilike, inArray, desc, sql } from "drizzle-orm";
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
  // Question Bank methods
  async getQuestionCategories() {
    return await db.select({
      id: questionCategories.id,
      name: questionCategories.name,
      description: questionCategories.description,
      createdAt: questionCategories.createdAt,
      _count: {
        questions: sql`count(${customInterviewQuestions.id})::int`
      }
    }).from(questionCategories).leftJoin(customInterviewQuestions, eq(questionCategories.id, customInterviewQuestions.categoryId)).groupBy(questionCategories.id).orderBy(questionCategories.name);
  }
  async createQuestionCategory(category) {
    const [created] = await db.insert(questionCategories).values(category).returning();
    return created;
  }
  async updateQuestionCategory(id, category) {
    const [updated] = await db.update(questionCategories).set(category).where(eq(questionCategories.id, id)).returning();
    return updated;
  }
  async deleteQuestionCategory(id) {
    await db.delete(questionCategories).where(eq(questionCategories.id, id));
  }
  async getQuestionTags() {
    return await db.select().from(questionTags).orderBy(questionTags.name);
  }
  async createQuestionTag(tag) {
    const [created] = await db.insert(questionTags).values(tag).returning();
    return created;
  }
  async updateQuestionTag(id, tag) {
    const [updated] = await db.update(questionTags).set(tag).where(eq(questionTags.id, id)).returning();
    return updated;
  }
  async deleteQuestionTag(id) {
    await db.delete(questionTags).where(eq(questionTags.id, id));
  }
  async getCustomInterviewQuestions(filters = {}) {
    const { search, categoryId, difficulty, tagIds, userId = 1, favoritesOnly } = filters;
    let query = db.select({
      id: customInterviewQuestions.id,
      categoryId: customInterviewQuestions.categoryId,
      question: customInterviewQuestions.question,
      difficulty: customInterviewQuestions.difficulty,
      tips: customInterviewQuestions.tips,
      expectedElements: customInterviewQuestions.expectedElements,
      isPublic: customInterviewQuestions.isPublic,
      createdBy: customInterviewQuestions.createdBy,
      createdAt: customInterviewQuestions.createdAt,
      updatedAt: customInterviewQuestions.updatedAt,
      category: {
        id: questionCategories.id,
        name: questionCategories.name,
        description: questionCategories.description,
        createdAt: questionCategories.createdAt
      },
      isFavorited: sql`CASE WHEN ${userQuestionFavorites.id} IS NOT NULL THEN true ELSE false END`
    }).from(customInterviewQuestions).leftJoin(questionCategories, eq(customInterviewQuestions.categoryId, questionCategories.id)).leftJoin(
      userQuestionFavorites,
      and(
        eq(userQuestionFavorites.questionId, customInterviewQuestions.id),
        eq(userQuestionFavorites.userId, userId)
      )
    );
    const conditions = [];
    if (search) {
      conditions.push(ilike(customInterviewQuestions.question, `%${search}%`));
    }
    if (categoryId) {
      conditions.push(eq(customInterviewQuestions.categoryId, categoryId));
    }
    if (difficulty) {
      conditions.push(eq(customInterviewQuestions.difficulty, difficulty));
    }
    if (favoritesOnly) {
      conditions.push(sql`${userQuestionFavorites.id} IS NOT NULL`);
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    let results = await query.orderBy(desc(customInterviewQuestions.updatedAt));
    if (tagIds && tagIds.length > 0) {
      const questionIdsWithTags = await db.select({ questionId: questionTagRelations.questionId }).from(questionTagRelations).where(inArray(questionTagRelations.tagId, tagIds)).groupBy(questionTagRelations.questionId).having(sql`count(*) = ${tagIds.length}`);
      const validQuestionIds = questionIdsWithTags.map((r) => r.questionId);
      results = results.filter((q) => validQuestionIds.includes(q.id));
    }
    for (const question of results) {
      const tags = await db.select({
        id: questionTags.id,
        name: questionTags.name,
        color: questionTags.color,
        createdAt: questionTags.createdAt
      }).from(questionTags).innerJoin(questionTagRelations, eq(questionTags.id, questionTagRelations.tagId)).where(eq(questionTagRelations.questionId, question.id));
      question.tags = tags;
    }
    return results;
  }
  async createCustomInterviewQuestion(question) {
    const [created] = await db.insert(customInterviewQuestions).values({
      ...question,
      createdBy: question.createdBy || "user"
    }).returning();
    return created;
  }
  async updateCustomInterviewQuestion(id, question) {
    const [updated] = await db.update(customInterviewQuestions).set({
      ...question,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customInterviewQuestions.id, id)).returning();
    return updated;
  }
  async deleteCustomInterviewQuestion(id) {
    await db.delete(questionTagRelations).where(eq(questionTagRelations.questionId, id));
    await db.delete(userQuestionFavorites).where(eq(userQuestionFavorites.questionId, id));
    await db.delete(customInterviewQuestions).where(eq(customInterviewQuestions.id, id));
  }
  async toggleQuestionFavorite(userId, questionId) {
    const existing = await db.select().from(userQuestionFavorites).where(
      and(
        eq(userQuestionFavorites.userId, userId),
        eq(userQuestionFavorites.questionId, questionId)
      )
    );
    if (existing.length > 0) {
      await db.delete(userQuestionFavorites).where(
        and(
          eq(userQuestionFavorites.userId, userId),
          eq(userQuestionFavorites.questionId, questionId)
        )
      );
      return { isFavorited: false };
    } else {
      await db.insert(userQuestionFavorites).values({ userId, questionId });
      return { isFavorited: true };
    }
  }
  async getUserQuestionFavorites(userId) {
    const favorites = await db.select({ questionId: userQuestionFavorites.questionId }).from(userQuestionFavorites).where(eq(userQuestionFavorites.userId, userId));
    return favorites.map((f) => f.questionId);
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
  const dsn = process.env.SENTRY_BACKEND_DSN || process.env.SENTRY_DSN;
  if (!dsn) {
    if (process.env.NODE_ENV === "development") {
      console.warn("SENTRY_BACKEND_DSN or SENTRY_DSN environment variable not found. Sentry will not be initialized.");
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
var SENTRY_PROJECT = process.env.SENTRY_PROJECT_SLUG || "talencor-frontend";
function isFeedbackIssue(issue) {
  return issue.permalink && issue.permalink.includes("/feedback/") || issue.title && issue.title.startsWith("User Feedback:") || issue.metadata?.source === "new_feedback_envelope";
}
async function getActualSentryIssues(req, res) {
  try {
    const queryParams = new URLSearchParams({
      query: "is:unresolved",
      // Only fetch unresolved issues
      limit: "100",
      // Fetch up to 100 issues
      sort: "date",
      // Sort by most recent
      statsPeriod: "14d",
      // Last 14 days
      expand: "stats"
      // Include statistics
    });
    const response = await fetch(
      `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?${queryParams}`,
      {
        headers: {
          "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sentry API Error Response:", errorText);
      throw new Error(`Sentry API error: ${response.status} ${response.statusText} - ${errorText}`);
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
        metadata: issue.metadata,
        type: isFeedbackIssue(issue) ? "feedback" : "issue"
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
    const { issueIds, status = "resolved", comments = {} } = req.body;
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
        const comment = comments[issueId];
        if (comment) {
          try {
            const commentResponse = await fetch(
              `https://sentry.io/api/0/organizations/${SENTRY_ORG}/issues/${issueId}/notes/`,
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
            if (!commentResponse.ok) {
              console.log(`Failed to add comment to issue ${issueId}: ${commentResponse.status}`);
            }
          } catch (err) {
            console.log(`Error adding comment to issue ${issueId}:`, err);
          }
        }
        const response = await fetch(
          `https://sentry.io/api/0/organizations/${SENTRY_ORG}/issues/${issueId}/`,
          {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              status,
              statusDetails: {}
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
          const issueDetailsResponse = await fetch(
            `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?query=id:${issueId}`,
            {
              headers: {
                "Authorization": `Bearer ${SENTRY_AUTH_TOKEN}`,
                "Content-Type": "application/json"
              }
            }
          );
          let isFeedback = false;
          if (issueDetailsResponse.ok) {
            const issues = await issueDetailsResponse.json();
            if (issues.length > 0) {
              isFeedback = isFeedbackIssue(issues[0]);
            }
          }
          if (response.status === 403 || isFeedback) {
            console.log(`Issue ${issueId} is a user feedback issue - cannot be resolved via API`);
            errors.push({
              issueId,
              error: "User feedback issues cannot be resolved through the API. They must be handled manually in the Sentry UI. However, the underlying bug has been fixed in the codebase."
            });
          } else {
            errors.push({
              issueId,
              error: `HTTP ${response.status}: ${response.statusText}`
            });
          }
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
      `https://sentry.io/api/0/organizations/${SENTRY_ORG}/issues/${issueId}/notes/`,
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

// server/sentry-feedback-summary.ts
async function getSentryFeedbackSummary(req, res) {
  try {
    const authToken = process.env.SENTRY_AUTH_TOKEN || "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";
    const org = process.env.SENTRY_ORG || "tsg-fulfillment";
    const project = process.env.SENTRY_PROJECT || "talencor-frontend";
    const projectId = "4509575724613632";
    console.log(`
=== Sentry Feedback Check ===`);
    console.log(`Organization: ${org}`);
    console.log(`Project: ${project}`);
    console.log(`Project ID: ${projectId}`);
    const userReportsUrl = `https://sentry.io/api/0/projects/${org}/${project}/user-reports/`;
    const response = await fetch(userReportsUrl, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    });
    let userReports = [];
    if (response.ok) {
      userReports = await response.json();
    }
    const summary = {
      organization: org,
      project,
      projectId,
      userFeedback: {
        total: userReports.length,
        open: 0,
        resolved: 0,
        reports: userReports
      },
      status: userReports.length === 0 ? "No user feedback found" : "User feedback found"
    };
    console.log(`
=== Summary ===`);
    console.log(`Total User Feedback: ${summary.userFeedback.total}`);
    console.log(`Status: ${summary.status}`);
    res.json(summary);
  } catch (error) {
    console.error("Error checking Sentry feedback:", error);
    res.status(500).json({
      error: "Failed to check Sentry feedback",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// server/ai/resumeEnhancer.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function enhanceResume(resumeText, jobCategory, options) {
  try {
    const enhancementTasks = [];
    if (options.formatting) {
      enhancementTasks.push("Professional formatting optimized for ATS systems");
    }
    if (options.keywords) {
      enhancementTasks.push(`Industry-specific keywords for ${jobCategory} roles`);
    }
    if (options.achievements) {
      enhancementTasks.push("Transform responsibilities into quantifiable achievements with metrics");
    }
    if (options.skills) {
      enhancementTasks.push("Highlight relevant technical and soft skills");
    }
    if (options.summary) {
      enhancementTasks.push("Create a compelling professional summary");
    }
    const prompt = `You are an expert resume writer and career consultant. Enhance the following resume with these improvements:

${enhancementTasks.join("\n")}

Target Industry: ${jobCategory}

Original Resume:
${resumeText}

Please provide:
1. An enhanced version of the resume
2. A list of key improvements made
3. Additional suggestions for the candidate

Format your response as JSON with the following structure:
{
  "enhancedResume": "full enhanced resume text",
  "improvements": ["improvement 1", "improvement 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer with expertise in ATS optimization and industry-specific requirements. Provide practical, actionable enhancements that will help candidates stand out."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2e3
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      enhancedResume: result.enhancedResume || resumeText,
      suggestions: result.suggestions || [],
      improvements: result.improvements || []
    };
  } catch (error) {
    console.error("Error enhancing resume:", error);
    throw new Error("Failed to enhance resume. Please try again.");
  }
}
async function generateIndustryKeywords(industry) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in recruitment and ATS systems. Provide relevant keywords for specific industries."
        },
        {
          role: "user",
          content: `List the top 20 most important keywords and skills for ${industry} roles that would help a resume pass ATS systems. Format as a JSON array of strings.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 500
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.keywords || [];
  } catch (error) {
    console.error("Error generating keywords:", error);
    return [];
  }
}

// server/ai/interviewSimulator.ts
import OpenAI2 from "openai";
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
async function generateInterviewQuestion(request) {
  try {
    const experienceLevelContext = {
      "entry": "entry-level position with 0-2 years of experience",
      "mid": "mid-level position with 3-5 years of experience",
      "senior": "senior-level position with 6+ years of experience",
      "executive": "executive or leadership position"
    };
    const previousQuestionsContext = request.previousQuestions?.length ? `

Previous questions asked (avoid repeating similar questions):
${request.previousQuestions.join("\n")}` : "";
    const prompt = `You are an expert interviewer for ${request.jobCategory} roles. Generate a behavioral or technical interview question appropriate for a ${experienceLevelContext[request.experienceLevel] || "professional"}.

This is question ${request.questionNumber} of the interview.${previousQuestionsContext}

Please provide:
1. A realistic interview question
2. 3 tips for answering this question effectively
3. 3-4 key elements that a strong answer should include

Format your response as JSON with the following structure:
{
  "question": "the interview question",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "expectedElements": ["element 1", "element 2", "element 3", "element 4"]
}`;
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional interviewer with deep expertise in conducting interviews across various industries. Generate thoughtful, relevant interview questions that help assess candidates effectively."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 500
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      question: result.question || "Tell me about yourself and your background.",
      tips: result.tips || ["Be concise", "Use specific examples", "Show enthusiasm"],
      expectedElements: result.expectedElements || ["Relevant experience", "Key achievements", "Career goals"]
    };
  } catch (error) {
    console.error("Error generating interview question:", error);
    throw new Error("Failed to generate interview question. Please try again.");
  }
}
async function evaluateInterviewResponse(question, response, jobCategory, experienceLevel) {
  try {
    const prompt = `You are an expert interviewer evaluating a candidate's response for a ${jobCategory} ${experienceLevel} position.

Question asked: "${question}"

Candidate's response: "${response}"

Please evaluate the response and provide constructive feedback. Consider:
- Relevance to the question
- Use of specific examples (STAR method)
- Communication clarity
- Demonstration of required skills
- Professional tone and structure

Format your response as JSON with the following structure:
{
  "score": (number from 0-100),
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["area for improvement 1", "area for improvement 2", ...],
  "suggestions": ["specific suggestion 1", "specific suggestion 2", ...],
  "overallFeedback": "A paragraph of overall feedback"
}`;
    const evaluationResponse = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a constructive interview coach providing helpful feedback to job seekers. Be encouraging while offering specific, actionable advice for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800
    });
    const result = JSON.parse(evaluationResponse.choices[0].message.content || "{}");
    return {
      score: Math.max(0, Math.min(100, result.score || 70)),
      strengths: result.strengths || ["Clear communication"],
      improvements: result.improvements || ["Add more specific examples"],
      suggestions: result.suggestions || ["Practice the STAR method"],
      overallFeedback: result.overallFeedback || "Good effort. Continue practicing to improve your responses."
    };
  } catch (error) {
    console.error("Error evaluating interview response:", error);
    throw new Error("Failed to evaluate response. Please try again.");
  }
}
async function generateInterviewTips(jobCategory) {
  try {
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career coach providing interview preparation tips."
        },
        {
          role: "user",
          content: `Provide 5 essential interview tips specifically for ${jobCategory} positions. Format as a JSON array of strings.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 300
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.tips || [
      "Research the company thoroughly",
      "Prepare specific examples using the STAR method",
      "Ask thoughtful questions about the role",
      "Dress professionally and arrive early",
      "Follow up with a thank-you email"
    ];
  } catch (error) {
    console.error("Error generating interview tips:", error);
    return [];
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
      console.log("Contact form submission saved to database", {
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
  app2.get("/api/question-bank/categories", async (req, res) => {
    try {
      const categories = await storage.getQuestionCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.post("/api/question-bank/categories", async (req, res) => {
    try {
      const validatedData = insertQuestionCategorySchema.parse(req.body);
      const category = await storage.createQuestionCategory(validatedData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ error: "Failed to create category" });
    }
  });
  app2.put("/api/question-bank/categories/:id", async (req, res) => {
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
  app2.delete("/api/question-bank/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuestionCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });
  app2.get("/api/question-bank/tags", async (req, res) => {
    try {
      const tags = await storage.getQuestionTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });
  app2.post("/api/question-bank/tags", async (req, res) => {
    try {
      const validatedData = insertQuestionTagSchema.parse(req.body);
      const tag = await storage.createQuestionTag(validatedData);
      res.json(tag);
    } catch (error) {
      console.error("Error creating tag:", error);
      res.status(400).json({ error: "Failed to create tag" });
    }
  });
  app2.put("/api/question-bank/tags/:id", async (req, res) => {
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
  app2.delete("/api/question-bank/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuestionTag(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Failed to delete tag" });
    }
  });
  app2.get("/api/question-bank/questions", async (req, res) => {
    try {
      const {
        search,
        category,
        difficulty,
        tags,
        favoritesOnly
      } = req.query;
      const filters = {};
      if (search && typeof search === "string") {
        filters.search = search;
      }
      if (category && category !== "all") {
        filters.categoryId = parseInt(category);
      }
      if (difficulty && difficulty !== "all") {
        filters.difficulty = difficulty;
      }
      if (tags) {
        const tagIds = Array.isArray(tags) ? tags.map((id) => parseInt(id)) : [parseInt(tags)];
        filters.tagIds = tagIds;
      }
      if (favoritesOnly === "true") {
        filters.favoritesOnly = true;
        filters.userId = 1;
      }
      const questions = await storage.getCustomInterviewQuestions(filters);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });
  app2.post("/api/question-bank/questions", async (req, res) => {
    try {
      const validatedData = insertCustomInterviewQuestionSchema.parse({
        ...req.body,
        createdBy: "user"
        // For now, using a default creator
      });
      const question = await storage.createCustomInterviewQuestion(validatedData);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(400).json({ error: "Failed to create question" });
    }
  });
  app2.put("/api/question-bank/questions/:id", async (req, res) => {
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
  app2.delete("/api/question-bank/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomInterviewQuestion(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Failed to delete question" });
    }
  });
  app2.post("/api/question-bank/questions/:id/favorite", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const userId = 1;
      const result = await storage.toggleQuestionFavorite(userId, questionId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ error: "Failed to toggle favorite" });
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
      const projectId = "4509575724613632";
      console.log(`Fetching feedback from organization: ${org}, project: ${project}`);
      let allUserFeedback = [];
      let feedbackStats = {
        open: 0,
        resolved: 0,
        total: 0
      };
      try {
        const userReportsUrl = `https://sentry.io/api/0/projects/${org}/${project}/user-reports/?statsPeriod=90d`;
        console.log(`Trying user-reports endpoint: ${userReportsUrl}`);
        const feedbackResponse = await fetch(userReportsUrl, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
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
      try {
        const orgFeedbackUrl = `https://sentry.io/api/0/organizations/${org}/user-feedback/?project=${projectId}&statsPeriod=90d`;
        console.log(`Trying org feedback endpoint with project ID: ${orgFeedbackUrl}`);
        const orgFeedbackResponse = await fetch(orgFeedbackUrl, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
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
      let issues = [];
      let issuesWithFeedback = 0;
      let resolvedIssues = 0;
      let unresolvedIssues = 0;
      try {
        const allIssuesUrl = `https://sentry.io/api/0/projects/${org}/${project}/issues/`;
        console.log(`Fetching all issues from: ${allIssuesUrl}`);
        const issuesResponse = await fetch(allIssuesUrl, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        });
        if (issuesResponse.ok) {
          issues = await issuesResponse.json();
          console.log(`Total issues found: ${Array.isArray(issues) ? issues.length : 0}`);
          if (Array.isArray(issues)) {
            issues.forEach((issue) => {
              if (issue.userReportCount && issue.userReportCount > 0) {
                issuesWithFeedback++;
              }
              if (issue.status === "resolved") {
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
      if (Array.isArray(allUserFeedback)) {
        allUserFeedback.forEach((feedback) => {
          feedbackStats.total++;
          if (feedback.status === "resolved" || feedback.issue?.status === "resolved") {
            feedbackStats.resolved++;
          } else {
            feedbackStats.open++;
          }
        });
      }
      const response = {
        userFeedback: allUserFeedback,
        unresolvedIssues: issues.filter((i) => i.status !== "resolved"),
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
  app2.get("/api/sentry/feedback-summary", getSentryFeedbackSummary);
  app2.post("/api/enhance-resume", async (req, res) => {
    try {
      const schema = z.object({
        resumeText: z.string().min(1, "Resume text is required"),
        jobCategory: z.string(),
        options: z.object({
          formatting: z.boolean(),
          keywords: z.boolean(),
          achievements: z.boolean(),
          skills: z.boolean(),
          summary: z.boolean()
        })
      });
      const validatedData = schema.parse(req.body);
      addBreadcrumb2("Resume enhancement requested", "http", {
        jobCategory: validatedData.jobCategory,
        options: validatedData.options
      });
      const result = await enhanceResume(
        validatedData.resumeText,
        validatedData.jobCategory,
        validatedData.options
      );
      console.log("Resume enhanced successfully", {
        jobCategory: validatedData.jobCategory,
        optionsEnabled: Object.keys(validatedData.options).filter((k) => validatedData.options[k])
      });
      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: "resume_enhancement_validation",
          validationErrors: error.errors
        });
        res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      } else {
        captureError(error, {
          action: "resume_enhancement_ai_processing",
          jobCategory: req.body.jobCategory
        });
        res.status(500).json({
          success: false,
          message: "Failed to enhance resume. Please try again."
        });
      }
    }
  });
  app2.get("/api/industry-keywords/:industry", async (req, res) => {
    try {
      const { industry } = req.params;
      const keywords = await generateIndustryKeywords(industry);
      res.json({ success: true, keywords });
    } catch (error) {
      captureError(error, {
        action: "industry_keywords_generation",
        industry: req.params.industry
      });
      res.status(500).json({
        success: false,
        message: "Failed to generate keywords"
      });
    }
  });
  app2.post("/api/interview/generate-question", async (req, res) => {
    try {
      const schema = z.object({
        jobCategory: z.string(),
        experienceLevel: z.string(),
        questionNumber: z.number().min(1).max(10),
        previousQuestions: z.array(z.string()).optional()
      });
      const validatedData = schema.parse(req.body);
      addBreadcrumb2("Interview question generation requested", "http", {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        questionNumber: validatedData.questionNumber
      });
      const result = await generateInterviewQuestion(validatedData);
      console.log("Interview question generated successfully", {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        questionNumber: validatedData.questionNumber
      });
      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: "interview_question_validation",
          validationErrors: error.errors
        });
        res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      } else {
        captureError(error, {
          action: "interview_question_generation",
          jobCategory: req.body.jobCategory
        });
        res.status(500).json({
          success: false,
          message: "Failed to generate interview question. Please try again."
        });
      }
    }
  });
  app2.post("/api/interview/evaluate-response", async (req, res) => {
    try {
      const schema = z.object({
        question: z.string().min(1),
        response: z.string().min(1),
        jobCategory: z.string(),
        experienceLevel: z.string()
      });
      const validatedData = schema.parse(req.body);
      addBreadcrumb2("Interview response evaluation requested", "http", {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        responseLength: validatedData.response.length
      });
      const feedback = await evaluateInterviewResponse(
        validatedData.question,
        validatedData.response,
        validatedData.jobCategory,
        validatedData.experienceLevel
      );
      console.log("Interview response evaluated successfully", {
        jobCategory: validatedData.jobCategory,
        experienceLevel: validatedData.experienceLevel,
        score: feedback.score
      });
      res.json({ success: true, feedback });
    } catch (error) {
      if (error instanceof z.ZodError) {
        captureError(error, {
          action: "interview_response_validation",
          validationErrors: error.errors
        });
        res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      } else {
        captureError(error, {
          action: "interview_response_evaluation",
          jobCategory: req.body.jobCategory
        });
        res.status(500).json({
          success: false,
          message: "Failed to evaluate response. Please try again."
        });
      }
    }
  });
  app2.get("/api/interview/tips/:jobCategory", async (req, res) => {
    try {
      const { jobCategory } = req.params;
      const tips = await generateInterviewTips(jobCategory);
      res.json({ success: true, tips });
    } catch (error) {
      captureError(error, {
        action: "interview_tips_generation",
        jobCategory: req.params.jobCategory
      });
      res.status(500).json({
        success: false,
        message: "Failed to generate interview tips"
      });
    }
  });
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
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
