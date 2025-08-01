import express from "express";
import { z } from "zod";
import { db } from "../db";
import { resumeSessions, resumeSections } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { analyzeResume, enhanceContent, generateKeywordSuggestions, type ResumeSection } from "../ai/resume-enhancer";
import { captureError } from "../sentry";

const router = express.Router();

// Create a new resume enhancement session
router.post("/session", async (req, res) => {
  try {
    const { sessionId, targetRole, industry } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: "Session ID is required" 
      });
    }

    // Check if session already exists
    const [existingSession] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

    if (existingSession) {
      return res.json({
        success: true,
        session: existingSession
      });
    }

    // Create new session
    const [newSession] = await db
      .insert(resumeSessions)
      .values({
        sessionId,
        targetRole: targetRole || null,
        industry: industry || null
      })
      .returning();

    res.json({
      success: true,
      session: newSession
    });
  } catch (error) {
    captureError(error as Error, { action: 'create_resume_session' });
    res.status(500).json({
      success: false,
      error: "Failed to create resume session"
    });
  }
});

// Get session details by query parameter (used by TanStack Query)
router.get("/session", async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Session ID is required"
      });
    }

    const [session] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

    if (!session) {
      return res.json({
        success: true,
        session: null
      });
    }

    // Get all sections for this session
    const sections = await db
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.sessionId, sessionId));

    res.json({
      success: true,
      session: {
        ...session,
        sections
      }
    });
  } catch (error) {
    captureError(error as Error, { action: 'get_resume_session' });
    res.status(500).json({
      success: false,
      error: "Failed to retrieve session"
    });
  }
});

// Get session details by path parameter
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const [session] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    // Get all sections for this session
    const sections = await db
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.sessionId, sessionId));

    res.json({
      success: true,
      session: {
        ...session,
        sections
      }
    });
  } catch (error) {
    captureError(error as Error, { action: 'get_resume_session' });
    res.status(500).json({
      success: false,
      error: "Failed to retrieve session"
    });
  }
});

// Add or update a resume section
router.post("/section", async (req, res) => {
  try {
    const sectionSchema = z.object({
      sessionId: z.string(),
      sectionType: z.enum(['summary', 'experience', 'education', 'skills', 'achievements']),
      content: z.string().min(1)
    });

    const { sessionId, sectionType, content } = sectionSchema.parse(req.body);

    // Check if section already exists
    const [existingSection] = await db
      .select()
      .from(resumeSections)
      .where(
        and(
          eq(resumeSections.sessionId, sessionId),
          eq(resumeSections.sectionType, sectionType)
        )
      );

    if (existingSection) {
      // Update existing section
      const [updatedSection] = await db
        .update(resumeSections)
        .set({
          originalContent: content,
          enhancedContent: null, // Reset enhanced content when original changes
          feedback: null,
          score: null,
          improvements: null
        })
        .where(eq(resumeSections.id, existingSection.id))
        .returning();

      return res.json({
        success: true,
        section: updatedSection
      });
    } else {
      // Create new section
      const [newSection] = await db
        .insert(resumeSections)
        .values({
          sessionId,
          sectionType,
          originalContent: content
        })
        .returning();

      return res.json({
        success: true,
        section: newSection
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid section data",
        details: error.errors
      });
    }

    captureError(error as Error, { action: 'add_resume_section' });
    res.status(500).json({
      success: false,
      error: "Failed to save section"
    });
  }
});

// Analyze entire resume
router.post("/analyze/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get session details
    const [session] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    // Get all sections
    const sections = await db
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.sessionId, sessionId));

    if (sections.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No sections found to analyze"
      });
    }

    // Prepare sections for AI analysis
    const resumeSectionsForAI: ResumeSection[] = sections.map(section => ({
      type: section.sectionType as ResumeSection['type'],
      content: section.originalContent
    }));

    // Analyze with AI
    const analysis = await analyzeResume(
      resumeSectionsForAI,
      session.targetRole || undefined,
      session.industry || undefined
    );

    // Update session with overall score
    await db
      .update(resumeSessions)
      .set({ overallScore: analysis.overallScore })
      .where(eq(resumeSessions.sessionId, sessionId));

    // Update individual sections with their scores and feedback
    for (const section of sections) {
      const sectionAnalysis = analysis.sections[section.sectionType as keyof typeof analysis.sections];
      if (sectionAnalysis) {
        await db
          .update(resumeSections)
          .set({
            score: sectionAnalysis.score,
            feedback: sectionAnalysis.feedback
          })
          .where(eq(resumeSections.id, section.id));
      }
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    captureError(error as Error, { action: 'analyze_resume' });
    res.status(500).json({
      success: false,
      error: "Failed to analyze resume: " + (error instanceof Error ? error.message : "Unknown error")
    });
  }
});

// Enhance specific section
router.post("/enhance/:sessionId/:sectionType", async (req, res) => {
  try {
    const { sessionId, sectionType } = req.params;
    
    // Get session details
    const [session] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    // Get specific section
    const [section] = await db
      .select()
      .from(resumeSections)
      .where(
        and(
          eq(resumeSections.sessionId, sessionId),
          eq(resumeSections.sectionType, sectionType)
        )
      );

    if (!section) {
      return res.status(404).json({
        success: false,
        error: "Section not found"
      });
    }

    // Enhance content with AI
    const enhancement = await enhanceContent(
      section.originalContent,
      sectionType as ResumeSection['type'],
      session.targetRole || undefined,
      session.industry || undefined
    );

    // Update section with enhanced content
    const [updatedSection] = await db
      .update(resumeSections)
      .set({
        enhancedContent: enhancement.enhanced,
        improvements: enhancement.improvements
      })
      .where(eq(resumeSections.id, section.id))
      .returning();

    res.json({
      success: true,
      section: updatedSection,
      enhancement
    });
  } catch (error) {
    captureError(error as Error, { action: 'enhance_section' });
    res.status(500).json({
      success: false,
      error: "Failed to enhance section: " + (error instanceof Error ? error.message : "Unknown error")
    });
  }
});

// Get keyword suggestions
router.post("/keywords/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { targetRole, industry } = req.body;
    
    if (!targetRole || !industry) {
      return res.status(400).json({
        success: false,
        error: "Target role and industry are required for keyword suggestions"
      });
    }

    // Get all sections content
    const sections = await db
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.sessionId, sessionId));

    const currentContent = sections
      .map(section => section.originalContent)
      .join('\n\n');

    if (!currentContent.trim()) {
      return res.status(400).json({
        success: false,
        error: "No resume content found for keyword analysis"
      });
    }

    // Generate keyword suggestions
    const keywordSuggestions = await generateKeywordSuggestions(
      targetRole,
      industry,
      currentContent
    );

    res.json({
      success: true,
      keywords: keywordSuggestions
    });
  } catch (error) {
    captureError(error as Error, { action: 'generate_keywords' });
    res.status(500).json({
      success: false,
      error: "Failed to generate keyword suggestions: " + (error instanceof Error ? error.message : "Unknown error")
    });
  }
});

export default router;