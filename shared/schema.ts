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



// Relations
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
