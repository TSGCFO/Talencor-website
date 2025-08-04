import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Interview Question Bank Tables
export const questionCategories = pgTable("question_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customInterviewQuestions = pgTable("custom_interview_questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => questionCategories.id),
  question: text("question").notNull(),
  difficulty: text("difficulty").notNull(), // 'entry', 'mid', 'senior', 'executive'
  tips: text("tips").array().notNull(),
  expectedElements: text("expected_elements").array().notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdBy: text("created_by").notNull(), // user identifier or "system"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questionTags = pgTable("question_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").default("#6B7280").notNull(), // hex color for tag display
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionTagRelations = pgTable("question_tag_relations", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => customInterviewQuestions.id),
  tagId: integer("tag_id").references(() => questionTags.id),
});

export const userQuestionFavorites = pgTable("user_question_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  questionId: integer("question_id").references(() => customInterviewQuestions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Dynamic Links table for managing external links that change periodically
export const dynamicLinks = pgTable("dynamic_links", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // unique identifier like 'whmis_training'
  url: text("url").notNull(),
  description: text("description"),
  lastChecked: timestamp("last_checked").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Management table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull().unique(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  accessCode: text("access_code").notNull().unique(), // Simple 6-digit code for authentication
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Job Posting tables
export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  // Contact Information (Required)
  contactName: text("contact_name").notNull(),
  companyName: text("company_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  
  // Job Details (Required)
  jobTitle: text("job_title").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(), // 'permanent', 'temporary', 'contract-to-hire'
  isExistingClient: boolean("is_existing_client").default(false).notNull(),
  
  // Job Details (Optional)
  anticipatedStartDate: date("anticipated_start_date"),
  salaryRange: text("salary_range"),
  jobDescription: text("job_description"),
  specialRequirements: text("special_requirements"),
  
  // Status Management
  status: text("status").default("new").notNull(), // 'new', 'contacted', 'contract_pending', 'posted', 'closed'
  
  // Client Reference (Optional - if authenticated)
  clientId: integer("client_id").references(() => clients.id),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume Enhancement tables
export const resumeSessions = pgTable("resume_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  targetRole: text("target_role"),
  industry: text("industry"),
  overallScore: integer("overall_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resumeSections = pgTable("resume_sections", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => resumeSessions.sessionId).notNull(),
  sectionType: text("section_type").notNull(), // 'summary', 'experience', 'education', 'skills', 'achievements'
  originalContent: text("original_content").notNull(),
  enhancedContent: text("enhanced_content"),
  feedback: text("feedback"),
  score: integer("score"),
  improvements: text("improvements").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Relations
export const resumeSessionsRelations = relations(resumeSessions, ({ many }) => ({
  sections: many(resumeSections),
}));

export const resumeSectionsRelations = relations(resumeSections, ({ one }) => ({
  session: one(resumeSessions, {
    fields: [resumeSections.sessionId],
    references: [resumeSessions.sessionId],
  }),
}));

export const questionCategoriesRelations = relations(questionCategories, ({ many }) => ({
  questions: many(customInterviewQuestions),
}));

export const customInterviewQuestionsRelations = relations(customInterviewQuestions, ({ one, many }) => ({
  category: one(questionCategories, {
    fields: [customInterviewQuestions.categoryId],
    references: [questionCategories.id],
  }),
  tagRelations: many(questionTagRelations),
  favorites: many(userQuestionFavorites),
}));

export const questionTagsRelations = relations(questionTags, ({ many }) => ({
  questionRelations: many(questionTagRelations),
}));

export const questionTagRelationsRelations = relations(questionTagRelations, ({ one }) => ({
  question: one(customInterviewQuestions, {
    fields: [questionTagRelations.questionId],
    references: [customInterviewQuestions.id],
  }),
  tag: one(questionTags, {
    fields: [questionTagRelations.tagId],
    references: [questionTags.id],
  }),
}));

export const userQuestionFavoritesRelations = relations(userQuestionFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userQuestionFavorites.userId],
    references: [users.id],
  }),
  question: one(customInterviewQuestions, {
    fields: [userQuestionFavorites.questionId],
    references: [customInterviewQuestions.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionCategorySchema = createInsertSchema(questionCategories).omit({
  id: true,
  createdAt: true,
});

export const insertCustomInterviewQuestionSchema = createInsertSchema(customInterviewQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionTagSchema = createInsertSchema(questionTags).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionTagRelationSchema = createInsertSchema(questionTagRelations).omit({
  id: true,
});

export const insertUserQuestionFavoriteSchema = createInsertSchema(userQuestionFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertDynamicLinkSchema = createInsertSchema(dynamicLinks).omit({
  id: true,
  lastChecked: true,
  updatedAt: true,
  createdAt: true,
});

export const insertResumeSessionSchema = createInsertSchema(resumeSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResumeSectionSchema = createInsertSchema(resumeSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  clientId: true,
}).extend({
  email: z.string().email("Invalid email format"),
  employmentType: z.enum(["permanent", "temporary", "contract-to-hire"], {
    errorMap: () => ({ message: "Employment type must be permanent, temporary, or contract-to-hire" })
  }),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertQuestionCategory = z.infer<typeof insertQuestionCategorySchema>;
export type QuestionCategory = typeof questionCategories.$inferSelect;
export type InsertCustomInterviewQuestion = z.infer<typeof insertCustomInterviewQuestionSchema>;
export type CustomInterviewQuestion = typeof customInterviewQuestions.$inferSelect;
export type InsertQuestionTag = z.infer<typeof insertQuestionTagSchema>;
export type QuestionTag = typeof questionTags.$inferSelect;
export type InsertQuestionTagRelation = z.infer<typeof insertQuestionTagRelationSchema>;
export type QuestionTagRelation = typeof questionTagRelations.$inferSelect;
export type InsertUserQuestionFavorite = z.infer<typeof insertUserQuestionFavoriteSchema>;
export type UserQuestionFavorite = typeof userQuestionFavorites.$inferSelect;
export type InsertDynamicLink = z.infer<typeof insertDynamicLinkSchema>;
export type DynamicLink = typeof dynamicLinks.$inferSelect;
export type InsertResumeSession = z.infer<typeof insertResumeSessionSchema>;
export type ResumeSession = typeof resumeSessions.$inferSelect;
export type InsertResumeSection = z.infer<typeof insertResumeSectionSchema>;
export type ResumeSection = typeof resumeSections.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;
