import { 
  users, 
  type User, 
  type InsertUser, 
  contactSubmissions, 
  type ContactSubmission, 
  type InsertContactSubmission,
  questionCategories,
  type QuestionCategory,
  type InsertQuestionCategory,
  customInterviewQuestions,
  type CustomInterviewQuestion,
  type InsertCustomInterviewQuestion,
  questionTags,
  type QuestionTag,
  type InsertQuestionTag,
  questionTagRelations,
  type QuestionTagRelation,
  type InsertQuestionTagRelation,
  userQuestionFavorites,
  type UserQuestionFavorite,
  type InsertUserQuestionFavorite,
  dynamicLinks,
  type DynamicLink,
  type InsertDynamicLink,
  clients,
  type Client,
  type InsertClient,
  jobPostings,
  type JobPosting,
  type InsertJobPosting
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, inArray, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Question Bank methods
  getQuestionCategories(): Promise<QuestionCategory[]>;
  createQuestionCategory(category: InsertQuestionCategory): Promise<QuestionCategory>;
  updateQuestionCategory(id: number, category: Partial<InsertQuestionCategory>): Promise<QuestionCategory>;
  deleteQuestionCategory(id: number): Promise<void>;
  
  getQuestionTags(): Promise<QuestionTag[]>;
  createQuestionTag(tag: InsertQuestionTag): Promise<QuestionTag>;
  updateQuestionTag(id: number, tag: Partial<InsertQuestionTag>): Promise<QuestionTag>;
  deleteQuestionTag(id: number): Promise<void>;
  
  getCustomInterviewQuestions(filters?: {
    search?: string;
    categoryId?: number;
    difficulty?: string;
    tagIds?: number[];
    userId?: number;
    favoritesOnly?: boolean;
  }): Promise<CustomInterviewQuestion[]>;
  createCustomInterviewQuestion(question: InsertCustomInterviewQuestion): Promise<CustomInterviewQuestion>;
  updateCustomInterviewQuestion(id: number, question: Partial<InsertCustomInterviewQuestion>): Promise<CustomInterviewQuestion>;
  deleteCustomInterviewQuestion(id: number): Promise<void>;
  
  toggleQuestionFavorite(userId: number, questionId: number): Promise<{ isFavorited: boolean }>;
  getUserQuestionFavorites(userId: number): Promise<number[]>;
  
  // Dynamic Links methods
  getDynamicLink(key: string): Promise<DynamicLink | undefined>;
  createDynamicLink(link: InsertDynamicLink): Promise<DynamicLink>;
  updateDynamicLink(key: string, url: string): Promise<DynamicLink>;
  getAllDynamicLinks(): Promise<DynamicLink[]>;
  
  // Client methods
  getClientByAccessCode(accessCode: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  getClients(): Promise<Client[]>;
  
  // Job Posting methods
  createJobPosting(posting: InsertJobPosting): Promise<JobPosting>;
  getJobPostings(filters?: { status?: string }): Promise<JobPosting[]>;
  getJobPostingById(id: number): Promise<JobPosting | undefined>;
  updateJobPostingStatus(id: number, status: string): Promise<JobPosting>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  // Question Bank methods
  async getQuestionCategories(): Promise<QuestionCategory[]> {
    return await db
      .select({
        id: questionCategories.id,
        name: questionCategories.name,
        description: questionCategories.description,
        createdAt: questionCategories.createdAt,
        _count: {
          questions: sql<number>`count(${customInterviewQuestions.id})::int`
        }
      })
      .from(questionCategories)
      .leftJoin(customInterviewQuestions, eq(questionCategories.id, customInterviewQuestions.categoryId))
      .groupBy(questionCategories.id)
      .orderBy(questionCategories.name);
  }

  async createQuestionCategory(category: InsertQuestionCategory): Promise<QuestionCategory> {
    const [created] = await db
      .insert(questionCategories)
      .values(category)
      .returning();
    return created;
  }

  async updateQuestionCategory(id: number, category: Partial<InsertQuestionCategory>): Promise<QuestionCategory> {
    const [updated] = await db
      .update(questionCategories)
      .set(category)
      .where(eq(questionCategories.id, id))
      .returning();
    return updated;
  }

  async deleteQuestionCategory(id: number): Promise<void> {
    await db.delete(questionCategories).where(eq(questionCategories.id, id));
  }

  async getQuestionTags(): Promise<QuestionTag[]> {
    return await db.select().from(questionTags).orderBy(questionTags.name);
  }

  async createQuestionTag(tag: InsertQuestionTag): Promise<QuestionTag> {
    const [created] = await db
      .insert(questionTags)
      .values(tag)
      .returning();
    return created;
  }

  async updateQuestionTag(id: number, tag: Partial<InsertQuestionTag>): Promise<QuestionTag> {
    const [updated] = await db
      .update(questionTags)
      .set(tag)
      .where(eq(questionTags.id, id))
      .returning();
    return updated;
  }

  async deleteQuestionTag(id: number): Promise<void> {
    await db.delete(questionTags).where(eq(questionTags.id, id));
  }

  async getCustomInterviewQuestions(filters: {
    search?: string;
    categoryId?: number;
    difficulty?: string;
    tagIds?: number[];
    userId?: number;
    favoritesOnly?: boolean;
  } = {}): Promise<CustomInterviewQuestion[]> {
    const { search, categoryId, difficulty, tagIds, userId = 1, favoritesOnly } = filters;

    let query = db
      .select({
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
          createdAt: questionCategories.createdAt,
        },
        isFavorited: sql<boolean>`CASE WHEN ${userQuestionFavorites.id} IS NOT NULL THEN true ELSE false END`
      })
      .from(customInterviewQuestions)
      .leftJoin(questionCategories, eq(customInterviewQuestions.categoryId, questionCategories.id))
      .leftJoin(
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

    // Handle tag filtering separately due to many-to-many relationship
    if (tagIds && tagIds.length > 0) {
      const questionIdsWithTags = await db
        .select({ questionId: questionTagRelations.questionId })
        .from(questionTagRelations)
        .where(inArray(questionTagRelations.tagId, tagIds))
        .groupBy(questionTagRelations.questionId)
        .having(sql`count(*) = ${tagIds.length}`);

      const validQuestionIds = questionIdsWithTags.map(r => r.questionId);
      results = results.filter(q => validQuestionIds.includes(q.id));
    }

    // Fetch tags for each question
    for (const question of results) {
      const tags = await db
        .select({
          id: questionTags.id,
          name: questionTags.name,
          color: questionTags.color,
          createdAt: questionTags.createdAt,
        })
        .from(questionTags)
        .innerJoin(questionTagRelations, eq(questionTags.id, questionTagRelations.tagId))
        .where(eq(questionTagRelations.questionId, question.id));

      (question as any).tags = tags;
    }

    return results as CustomInterviewQuestion[];
  }

  async createCustomInterviewQuestion(question: InsertCustomInterviewQuestion): Promise<CustomInterviewQuestion> {
    const [created] = await db
      .insert(customInterviewQuestions)
      .values({
        ...question,
        createdBy: question.createdBy || 'user'
      })
      .returning();
    return created;
  }

  async updateCustomInterviewQuestion(id: number, question: Partial<InsertCustomInterviewQuestion>): Promise<CustomInterviewQuestion> {
    const [updated] = await db
      .update(customInterviewQuestions)
      .set({
        ...question,
        updatedAt: new Date()
      })
      .where(eq(customInterviewQuestions.id, id))
      .returning();
    return updated;
  }

  async deleteCustomInterviewQuestion(id: number): Promise<void> {
    // Delete associated tag relations first
    await db.delete(questionTagRelations).where(eq(questionTagRelations.questionId, id));
    // Delete associated favorites
    await db.delete(userQuestionFavorites).where(eq(userQuestionFavorites.questionId, id));
    // Delete the question
    await db.delete(customInterviewQuestions).where(eq(customInterviewQuestions.id, id));
  }

  async toggleQuestionFavorite(userId: number, questionId: number): Promise<{ isFavorited: boolean }> {
    const existing = await db
      .select()
      .from(userQuestionFavorites)
      .where(
        and(
          eq(userQuestionFavorites.userId, userId),
          eq(userQuestionFavorites.questionId, questionId)
        )
      );

    if (existing.length > 0) {
      // Remove favorite
      await db
        .delete(userQuestionFavorites)
        .where(
          and(
            eq(userQuestionFavorites.userId, userId),
            eq(userQuestionFavorites.questionId, questionId)
          )
        );
      return { isFavorited: false };
    } else {
      // Add favorite
      await db
        .insert(userQuestionFavorites)
        .values({ userId, questionId });
      return { isFavorited: true };
    }
  }

  async getUserQuestionFavorites(userId: number): Promise<number[]> {
    const favorites = await db
      .select({ questionId: userQuestionFavorites.questionId })
      .from(userQuestionFavorites)
      .where(eq(userQuestionFavorites.userId, userId));
    
    return favorites.map(f => f.questionId).filter((id): id is number => id !== null);
  }

  // Dynamic Links methods
  async getDynamicLink(key: string): Promise<DynamicLink | undefined> {
    const [link] = await db.select().from(dynamicLinks).where(eq(dynamicLinks.key, key));
    return link || undefined;
  }

  async createDynamicLink(link: InsertDynamicLink): Promise<DynamicLink> {
    const [created] = await db
      .insert(dynamicLinks)
      .values(link)
      .returning();
    return created;
  }

  async updateDynamicLink(key: string, url: string): Promise<DynamicLink> {
    const [updated] = await db
      .update(dynamicLinks)
      .set({ 
        url, 
        lastChecked: new Date(),
        updatedAt: new Date()
      })
      .where(eq(dynamicLinks.key, key))
      .returning();
    return updated;
  }

  async getAllDynamicLinks(): Promise<DynamicLink[]> {
    return await db.select().from(dynamicLinks).orderBy(dynamicLinks.key);
  }
  
  // Job Posting methods
  async createJobPosting(posting: InsertJobPosting): Promise<JobPosting> {
    const [created] = await db
      .insert(jobPostings)
      .values(posting)
      .returning();
    return created;
  }
  
  async getJobPostings(filters?: { status?: string }): Promise<JobPosting[]> {
    if (filters?.status) {
      return await db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.status, filters.status))
        .orderBy(desc(jobPostings.createdAt));
    }
    
    return await db
      .select()
      .from(jobPostings)
      .orderBy(desc(jobPostings.createdAt));
  }
  
  async getJobPostingById(id: number): Promise<JobPosting | undefined> {
    const [posting] = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return posting || undefined;
  }
  
  async updateJobPostingStatus(id: number, status: string): Promise<JobPosting> {
    const [updated] = await db
      .update(jobPostings)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(jobPostings.id, id))
      .returning();
    if (!updated) {
      throw new Error('Job posting not found');
    }
    return updated;
  }
  
  // Client methods
  async getClientByAccessCode(accessCode: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(and(
        eq(clients.accessCode, accessCode),
        eq(clients.isActive, true)
      ));
    return client || undefined;
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const [created] = await db
      .insert(clients)
      .values(client)
      .returning();
    return created;
  }
  
  async getClients(): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.isActive, true))
      .orderBy(clients.companyName);
  }
}

export const storage = new DatabaseStorage();
