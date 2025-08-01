# Resume Wizard Documentation

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Getting Started](#getting-started)
4. [Step-by-Step User Guide](#step-by-step-user-guide)
5. [Understanding the Analysis](#understanding-the-analysis)
6. [AI Enhancement Features](#ai-enhancement-features)
7. [Technical Architecture](#technical-architecture)
8. [Common Use Cases](#common-use-cases)
9. [Tips for Best Results](#tips-for-best-results)
10. [Troubleshooting](#troubleshooting)

## Overview

The Resume Wizard is an AI-powered tool designed to help job seekers create, analyze, and optimize their resumes for better job prospects. It uses OpenAI's advanced GPT-4o model to provide intelligent feedback, ATS (Applicant Tracking System) optimization, and industry-specific recommendations.

### What Makes It Special
- **Real-time AI Analysis**: Get instant feedback on your resume content
- **ATS Optimization**: Ensure your resume passes automated screening systems
- **Section-by-Section Enhancement**: Improve each part of your resume individually
- **Industry-Specific Suggestions**: Tailored advice based on your target role and industry
- **Keyword Optimization**: Discover missing keywords that could improve your chances

## Key Features

### 1. Intelligent Resume Analysis
- **Overall Score (1-100)**: A comprehensive score reflecting your resume's effectiveness
- **Section Scores**: Individual ratings for each resume section
- **Detailed Feedback**: Specific suggestions for improvement
- **ATS Compatibility Check**: Ensures your resume works with automated systems

### 2. AI-Powered Enhancement
- **Content Improvement**: Rewrites sections for better impact
- **Action Verb Optimization**: Uses powerful language to describe achievements
- **Quantifiable Results**: Helps add metrics and measurable outcomes
- **Professional Tone**: Ensures consistent, professional language throughout

### 3. Keyword Optimization
- **Missing Keywords Detection**: Identifies important terms you should include
- **Industry-Specific Terms**: Suggests relevant jargon and technical terms
- **Skills Gap Analysis**: Shows what skills employers are looking for
- **Competitive Advantage**: Helps your resume stand out in searches

### 4. Real-Time Progress Tracking
- **Visual Progress Indicators**: See which sections are complete
- **Section Status**: Track what needs work at a glance
- **Score Evolution**: Monitor improvements as you update content

## Getting Started

### Prerequisites
1. Navigate to the Resume Wizard at `/resume-wizard`
2. Have your resume content ready (or start from scratch)
3. Know your target job role and industry

### Initial Setup
1. **Enter Target Role**: Specify the job title you're applying for
2. **Select Industry**: Choose your target industry from the dropdown
3. **Begin Adding Content**: Start with any section you prefer

#### Initial Setup UI Implementation
```typescript
// Target role and industry input section
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Briefcase className="text-orange-500" />
        Target Role
      </CardTitle>
      <CardDescription>
        What position are you applying for?
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Input
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
        placeholder="e.g., Senior Software Engineer"
        className="w-full"
      />
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building className="text-orange-500" />
        Industry
      </CardTitle>
      <CardDescription>
        Which industry are you targeting?
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Select value={industry} onValueChange={setIndustry}>
        <SelectTrigger>
          <SelectValue placeholder="Select an industry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="technology">Technology</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="healthcare">Healthcare</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="manufacturing">Manufacturing</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="construction">Construction</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </CardContent>
  </Card>
</div>
```

#### Type Definitions and Interfaces
```typescript
// Type definitions for Resume Wizard
interface ResumeAnalysis {
  overallScore: number;
  sections: {
    [key: string]: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
  };
  keywordOptimization: {
    missing: string[];
    present: string[];
    suggestions: string;
  };
  atsOptimization: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  industrySpecific: {
    relevance: number;
    suggestions: string[];
  };
}

interface KeywordSuggestions {
  keywords: string[];
  explanation: string;
  missing: string[];
  present: string[];
}

interface ResumeSession {
  id: number;
  sessionId: string;
  targetRole: string | null;
  industry: string | null;
  overallScore: number | null;
  sections?: ResumeSection[];
  createdAt: Date;
  updatedAt: Date;
}

interface ResumeSection {
  id: number;
  sessionId: string;
  sectionType: 'summary' | 'experience' | 'education' | 'skills' | 'achievements';
  originalContent: string;
  enhancedContent: string | null;
  score: number | null;
  feedback: string | null;
  improvements: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Constants for UI text
const sectionTitles = {
  summary: 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  achievements: 'Achievements'
};

const sectionDescriptions = {
  summary: 'A compelling overview of your professional profile',
  experience: 'Your work history and professional accomplishments',
  education: 'Academic background and relevant certifications',
  skills: 'Technical and soft skills relevant to your target role',
  achievements: 'Notable accomplishments, awards, and recognition'
};
```

## Step-by-Step User Guide

### Step 1: Set Your Target
```
Target Role: [e.g., "Senior Software Engineer"]
Industry: [e.g., "Technology"]
```
These fields help the AI provide tailored suggestions specific to your career goals.

### Step 2: Add Resume Content

The wizard supports five main sections:

#### Section Input UI Implementation
```typescript
// Section content input component
<Tabs value={activeSection} onValueChange={setActiveSection}>
  <TabsList className="grid w-full grid-cols-5">
    {Object.entries(sectionTitles).map(([key, title]) => (
      <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
        {title}
      </TabsTrigger>
    ))}
  </TabsList>
  
  {Object.keys(sectionTitles).map((section) => (
    <TabsContent key={section} value={section}>
      <Card>
        <CardHeader>
          <CardTitle>{sectionTitles[section as keyof typeof sectionTitles]}</CardTitle>
          <CardDescription>
            {sectionDescriptions[section as keyof typeof sectionDescriptions]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sectionContent[section] || ''}
            onChange={(e) => setSectionContent(prev => ({
              ...prev,
              [section]: e.target.value
            }))}
            placeholder={sectionPlaceholders[section as keyof typeof sectionPlaceholders]}
            className="min-h-[200px]"
          />
          <Button 
            onClick={handleSaveSection} 
            className="mt-4 w-full"
            disabled={addSectionMutation.isPending}
          >
            {addSectionMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Section
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  ))}
</Tabs>
```

#### Save Section Implementation
```typescript
// Frontend: Save section mutation
const addSectionMutation = useMutation({
  mutationFn: async ({ sectionType, content }: { sectionType: string; content: string }) => {
    const response = await apiRequest('POST', '/api/resume/section', { 
      sessionId, 
      sectionType, 
      content 
    });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
    toast({
      title: "Section Saved",
      description: "Your resume section has been saved successfully."
    });
  }
});

// Backend: Save section route
router.post("/section", async (req, res) => {
  try {
    const sectionSchema = z.object({
      sessionId: z.string(),
      sectionType: z.enum(['summary', 'experience', 'education', 'skills', 'achievements']),
      content: z.string().min(1)
    });

    const { sessionId, sectionType, content } = sectionSchema.parse(req.body);

    // Check if section exists
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
      // Update existing
      const [updatedSection] = await db
        .update(resumeSections)
        .set({
          originalContent: content,
          enhancedContent: null,
          feedback: null,
          score: null,
          improvements: null
        })
        .where(eq(resumeSections.id, existingSection.id))
        .returning();

      return res.json({ success: true, section: updatedSection });
    } else {
      // Create new
      const [newSection] = await db
        .insert(resumeSections)
        .values({
          sessionId,
          sectionType,
          originalContent: content
        })
        .returning();

      return res.json({ success: true, section: newSection });
    }
  } catch (error) {
    captureError(error as Error, { action: 'add_resume_section' });
    res.status(500).json({ success: false, error: "Failed to save section" });
  }
});
```

#### Professional Summary
- **What to Include**: 2-3 sentences highlighting your value proposition
- **Example**: "Results-driven software engineer with 5+ years of experience..."
- **Tips**: Focus on your unique strengths and career objectives

#### Experience
- **Format**: Company name, role, dates, and bullet points of achievements
- **Example**:
  ```
  Senior Developer | Tech Corp | 2020-2023
  • Led team of 5 developers to deliver $2M project
  • Improved system performance by 40%
  ```

#### Education
- **Include**: Degree, institution, graduation year, relevant coursework
- **Example**: "B.S. Computer Science | State University | 2018"

#### Skills
- **Categories**: Technical skills, soft skills, tools, languages
- **Format**: Comma-separated list or grouped by category

#### Achievements
- **Include**: Awards, certifications, notable projects
- **Focus**: Quantifiable results and recognition

### Step 3: Save Each Section
After entering content for a section:
1. Click "Save Section"
2. Wait for the success notification
3. The progress indicator will update automatically

### Step 4: Analyze Your Resume
Once you've added at least one section:
1. Click "Analyze Resume"
2. Wait 5-10 seconds for AI processing
3. Review your comprehensive analysis

### Step 5: Review Analysis Results

The analysis provides:
- **Overall Score**: Your resume's effectiveness rating
- **Section Scores**: Individual ratings for each section
- **ATS Score**: Compatibility with automated systems
- **Keyword Analysis**: Missing and present keywords
- **Industry Relevance**: How well your resume matches industry standards

#### Analysis Results Display Implementation
```typescript
// Overall Score Display
{analysis && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="text-orange-500" />
        Overall Score
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center">
        <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
          {analysis.overallScore}/100
        </div>
        <Badge variant={getScoreBadgeVariant(analysis.overallScore)} className="mt-2">
          {analysis.overallScore >= 80 ? 'Excellent' : 
           analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
        </Badge>
      </div>
    </CardContent>
  </Card>
)}

// Section Scores Display
{analysis && (
  <Card>
    <CardHeader>
      <CardTitle>Section Scores</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {Object.entries(analysis.sections).map(([sectionType, sectionAnalysis]) => (
        <div key={sectionType} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {sectionTitles[sectionType as keyof typeof sectionTitles]}
            </span>
            <Badge variant={getScoreBadgeVariant(sectionAnalysis.score)}>
              {sectionAnalysis.score}/100
            </Badge>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {sectionAnalysis.feedback}
          </div>
          {sectionAnalysis.suggestions.length > 0 && (
            <div className="ml-4">
              {sectionAnalysis.suggestions.map((suggestion, idx) => (
                <div key={idx} className="text-xs text-gray-500 flex items-start gap-1">
                  <span>•</span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
)}

// ATS Optimization Display
{analysis && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="text-orange-500" />
        ATS Optimization
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">ATS Score</span>
        <Badge variant={getScoreBadgeVariant(analysis.atsOptimization.score)}>
          {analysis.atsOptimization.score}/100
        </Badge>
      </div>
      {analysis.atsOptimization.issues.length > 0 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="text-sm space-y-1">
              <p className="font-medium">Key Issues:</p>
              <ul className="space-y-1">
                {analysis.atsOptimization.issues.slice(0, 3).map((issue, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-orange-500">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  </Card>
)}
```

#### Progress Tracking Implementation
```typescript
// Progress tracking component
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <CheckCircle className="text-orange-500" />
      Progress
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      {Object.entries(sectionTitles).map(([key, title]) => {
        const section = sessionData?.session?.sections?.find(
          s => s.sectionType === key
        );
        const hasContent = section && section.originalContent;
        const hasScore = section && typeof section.score === 'number';
        
        return (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm">{title}</span>
            <div className="flex items-center gap-2">
              {hasContent && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Added
                </Badge>
              )}
              {hasScore && (
                <Badge variant="secondary" className="text-xs">
                  Score: {section.score}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
    <div className="mt-4 pt-4 border-t">
      <div className="flex justify-between text-sm">
        <span>Completion</span>
        <span className="font-medium">
          {Math.round(
            ((sessionData?.session?.sections?.length || 0) / 5) * 100
          )}%
        </span>
      </div>
      <Progress 
        value={(sessionData?.session?.sections?.length || 0) * 20} 
        className="mt-2"
      />
    </div>
  </CardContent>
</Card>
```

### Step 6: Enhance Sections (Optional)
For each section:
1. Click "Enhance with AI"
2. Review the suggested improvements
3. Accept or modify the enhanced content
4. Save the updated section

#### Enhancement Implementation
```typescript
// Frontend: Enhance section mutation
const enhanceSectionMutation = useMutation({
  mutationFn: async (sectionType: string) => {
    const response = await apiRequest('POST', `/api/resume/enhance/${sessionId}/${sectionType}`);
    return response.json();
  },
  onSuccess: (data, sectionType) => {
    queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
    toast({
      title: "Enhancement Complete",
      description: `Your ${sectionTitles[sectionType as keyof typeof sectionTitles]} section has been enhanced.`
    });
  }
});

// Backend: Enhance section route
router.post("/enhance/:sessionId/:sectionType", async (req, res) => {
  try {
    const { sessionId, sectionType } = req.params;
    
    // Get session and section data
    const [session] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

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
      return res.status(404).json({ success: false, error: "Section not found" });
    }

    // Enhance with AI
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
    res.status(500).json({ success: false, error: "Failed to enhance section" });
  }
});
```

### Step 7: Generate Keywords
1. Click "Generate Keywords"
2. Review suggested keywords for your role/industry
3. Incorporate relevant terms into your resume
4. Re-analyze to see score improvements

#### Keyword Generation Implementation
```typescript
// Frontend: Keywords mutation
const keywordsMutation = useMutation({
  mutationFn: async () => {
    const response = await apiRequest('POST', `/api/resume/keywords/${sessionId}`, { 
      targetRole, 
      industry 
    });
    return response.json();
  },
  onSuccess: (data: any) => {
    setKeywords(data.keywords);
    toast({
      title: "Keywords Generated",
      description: "AI-powered keyword suggestions are ready to improve your ATS compatibility."
    });
  }
});

// Backend: Keyword generation route
router.post("/keywords/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { targetRole, industry } = req.body;
    
    if (!targetRole || !industry) {
      return res.status(400).json({
        success: false,
        error: "Target role and industry are required"
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
    res.status(500).json({ success: false, error: "Failed to generate keywords" });
  }
});

// AI keyword generation function
export async function generateKeywordSuggestions(
  targetRole: string,
  industry: string,
  currentContent: string
): Promise<KeywordSuggestions> {
  const prompt = `
Analyze keywords for a ${targetRole} position in ${industry}.

Current Resume Content:
${currentContent}

Provide keyword suggestions in JSON format:
{
  "keywords": ["keyword1", "keyword2", ...],
  "explanation": "Brief explanation of why these keywords matter",
  "missing": ["important keywords not found in resume"],
  "present": ["good keywords already in resume"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an ATS optimization expert."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content);
}
```

## Understanding the Analysis

### Score Interpretation
- **90-100**: Excellent - Ready for submission
- **80-89**: Very Good - Minor improvements recommended
- **70-79**: Good - Some optimization needed
- **60-69**: Fair - Significant improvements recommended
- **Below 60**: Needs Work - Major revisions required

### Section Feedback
Each section receives:
- **Numeric Score**: Performance rating
- **Qualitative Feedback**: Specific strengths and weaknesses
- **Actionable Suggestions**: Concrete steps for improvement

### ATS Optimization Metrics
- **Formatting Issues**: Problems that might cause parsing errors
- **Keyword Density**: Whether you have enough relevant terms
- **Structure Compliance**: If sections follow standard naming

## AI Enhancement Features

### How Enhancement Works
1. **Content Analysis**: AI evaluates current content
2. **Improvement Generation**: Creates enhanced version
3. **Reasoning Provided**: Explains why changes were made
4. **Original Preserved**: Your original content remains available

#### AI Analysis Implementation (`server/ai/resume-enhancer.ts`)
```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ResumeAnalysis {
  overallScore: number;
  sections: {
    [K in ResumeSection['type']]?: {
      score: number;
      feedback: string;
      suggestions: string[];
    }
  };
  keywordOptimization: {
    missing: string[];
    present: string[];
    suggestions: string;
  };
  atsOptimization: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  industrySpecific: {
    relevance: number;
    suggestions: string[];
  };
}

export async function analyzeResume(
  sections: ResumeSection[], 
  targetRole?: string, 
  industry?: string
): Promise<ResumeAnalysis> {
  try {
    const prompt = `
You are an expert resume analyst and career coach. Analyze the following resume sections.

Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}

Resume Sections:
${sections.map(section => `
${section.type.toUpperCase()}:
${section.content}
`).join('\n')}

Provide a comprehensive analysis in JSON format with this EXACT structure:
{
  "overallScore": number (1-100),
  "sections": {
    "summary": { "score": number, "feedback": "string", "suggestions": ["string"] },
    // Include only sections that were provided
  },
  "keywordOptimization": {
    "missing": ["string"],
    "present": ["string"],
    "suggestions": "string"
  },
  "atsOptimization": {
    "score": number (1-100),
    "issues": ["string"],
    "recommendations": ["string"]
  },
  "industrySpecific": {
    "relevance": number (1-100),
    "suggestions": ["string"]
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Latest OpenAI model
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyst with 15+ years of experience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const analysis = JSON.parse(content);
    
    // Validate and structure response with fallbacks
    return structureAnalysisResponse(analysis, sections);
  } catch (error) {
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
}
```

#### Content Enhancement Function
```typescript
export async function enhanceContent(
  content: string, 
  sectionType: ResumeSection['type'], 
  targetRole?: string, 
  industry?: string
): Promise<EnhancedContent> {
  try {
    const prompt = `
Enhance the following ${sectionType} section for better impact and ATS optimization.

Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}

Original Content:
${content}

Requirements:
- Improve impact and readability
- Add relevant keywords for ATS optimization
- Use action verbs and quantifiable achievements
- Maintain authenticity and accuracy

Provide response in JSON format with:
- enhanced: The improved content
- improvements: Array of specific improvements made
- reasoning: Explanation of why changes were made`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer specializing in ATS optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const enhancement = JSON.parse(response.choices[0].message.content);
    return {
      original: content,
      enhanced: enhancement.enhanced,
      improvements: enhancement.improvements,
      reasoning: enhancement.reasoning
    };
  } catch (error) {
    throw new Error(`Content enhancement failed: ${error.message}`);
  }
}
```

### Enhancement Focus Areas
- **Impact**: Stronger action verbs and achievements
- **Clarity**: Clearer, more concise language
- **Relevance**: Better alignment with target role
- **Keywords**: Integration of important terms

## Technical Architecture

### Frontend Components
- **React-based UI**: Modern, responsive interface
- **Real-time Updates**: Instant feedback on changes
- **Session Management**: Preserves work between visits

#### Main Component Structure (`client/src/pages/resume-wizard.tsx`)
```typescript
// State management for resume data
const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
const [targetRole, setTargetRole] = useState('');
const [industry, setIndustry] = useState('');
const [activeSection, setActiveSection] = useState<string>('summary');
const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

// Session creation mutation
const createSessionMutation = useMutation({
  mutationFn: async () => {
    const response = await apiRequest('POST', '/api/resume/session', { 
      sessionId, 
      targetRole, 
      industry 
    });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
  }
});

// Analyze resume mutation
const analyzeResumeMutation = useMutation({
  mutationFn: async () => {
    const response = await apiRequest('POST', `/api/resume/analyze/${sessionId}`);
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }
    return result;
  },
  onSuccess: (data: any) => {
    if (data.analysis) {
      setAnalysis(data.analysis);
      queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${data.analysis.overallScore}/100.`
      });
    }
  }
});
```

### Backend Processing
- **Express.js API**: Handles all resume operations
- **PostgreSQL Storage**: Secure database for resume data
- **OpenAI Integration**: GPT-4o model for analysis

#### API Routes (`server/routes/resume.ts`)
```typescript
// Create or update resume session
router.post("/session", async (req, res) => {
  try {
    const { sessionId, targetRole, industry } = req.body;
    
    // Check if session exists
    const [existingSession] = await db
      .select()
      .from(resumeSessions)
      .where(eq(resumeSessions.sessionId, sessionId));

    if (existingSession) {
      return res.json({ success: true, session: existingSession });
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

    res.json({ success: true, session: newSession });
  } catch (error) {
    captureError(error as Error, { action: 'create_resume_session' });
    res.status(500).json({ success: false, error: "Failed to create session" });
  }
});

// Analyze entire resume
router.post("/analyze/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get all sections
    const sections = await db
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.sessionId, sessionId));

    // Prepare for AI analysis
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

    // Update session and sections with scores
    if (typeof analysis.overallScore === 'number' && analysis.overallScore >= 0) {
      await db
        .update(resumeSessions)
        .set({ overallScore: analysis.overallScore })
        .where(eq(resumeSessions.sessionId, sessionId));
    }

    res.json({ success: true, analysis });
  } catch (error) {
    captureError(error as Error, { action: 'analyze_resume' });
    res.status(500).json({
      success: false,
      error: "Failed to analyze resume: " + (error instanceof Error ? error.message : "Unknown error")
    });
  }
});
```

#### Database Schema (`shared/schema.ts`)
```typescript
// Resume sessions table
export const resumeSessions = pgTable('resume_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  targetRole: text('target_role'),
  industry: text('industry'),
  overallScore: integer('overall_score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Resume sections table
export const resumeSections = pgTable('resume_sections', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  sectionType: text('section_type').notNull(),
  originalContent: text('original_content').notNull(),
  enhancedContent: text('enhanced_content'),
  score: integer('score'),
  feedback: text('feedback'),
  improvements: text('improvements'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Type exports
export type ResumeSession = typeof resumeSessions.$inferSelect;
export type InsertResumeSession = typeof resumeSessions.$inferInsert;
export type ResumeSection = typeof resumeSections.$inferSelect;
export type InsertResumeSection = typeof resumeSections.$inferInsert;
```

### Data Flow
1. User enters content → Saved to database
2. Analysis requested → Content sent to AI
3. AI processes → Returns structured feedback
4. Results displayed → User reviews insights
5. Enhancements applied → Improved content saved

## Common Use Cases

### Career Changer
- Focus on transferable skills
- Highlight relevant achievements
- Use industry-specific keywords
- Emphasize adaptability

### Recent Graduate
- Emphasize education and projects
- Include internships and volunteer work
- Highlight technical skills
- Show learning potential

### Senior Professional
- Focus on leadership and impact
- Quantify achievements with metrics
- Highlight strategic contributions
- Show industry expertise

## Tips for Best Results

### Content Quality
1. **Be Specific**: Use numbers, percentages, and metrics
2. **Action Verbs**: Start bullets with strong verbs
3. **Relevance**: Tailor content to target role
4. **Conciseness**: Keep descriptions brief but impactful

### Optimization Strategy
1. **Iterate**: Make improvements based on feedback
2. **Keywords**: Naturally incorporate suggested terms
3. **Balance**: Mix technical and soft skills
4. **Consistency**: Maintain uniform formatting

### Common Mistakes to Avoid
- Generic descriptions without impact
- Missing quantifiable achievements
- Irrelevant information for target role
- Poor keyword optimization
- Inconsistent formatting

## Troubleshooting

### Issue: Low Overall Score
**Solution**: Focus on lowest-scoring sections first, add more specific achievements

### Issue: Poor ATS Score
**Solution**: Simplify formatting, add missing keywords, use standard section headers

### Issue: Analysis Takes Too Long
**Solution**: Ensure stable internet connection, try analyzing fewer sections at once

### Issue: Enhancement Not Working
**Solution**: Ensure section has content saved first, check for specific error messages

### Issue: Keywords Don't Match Role
**Solution**: Verify target role and industry are correctly set, be more specific

## Best Practices Summary

1. **Start with Clear Goals**: Know your target role and industry
2. **Add Complete Content**: Fill all relevant sections
3. **Analyze Regularly**: Check scores after each major update
4. **Use AI Wisely**: Enhancement is a tool, not a replacement
5. **Iterate**: Multiple rounds of improvement yield best results
6. **Stay Authentic**: Ensure enhanced content remains truthful
7. **Test ATS**: Verify format works with online ATS checkers

## File Organization

The Resume Wizard feature is implemented across several key files in the project:

### Frontend Files
- **`client/src/pages/resume-wizard.tsx`**: Main React component containing all UI and state management
- **`client/src/components/ui/*`**: Shared UI components from shadcn/ui library

### Backend Files
- **`server/routes/resume.ts`**: Express API routes for all resume operations
- **`server/ai/resume-enhancer.ts`**: AI integration functions for analysis and enhancement
- **`server/db.ts`**: Database connection and configuration

### Shared Files
- **`shared/schema.ts`**: Database schema definitions and TypeScript types

### Configuration
- **Environment Variables**: `OPENAI_API_KEY` for AI functionality
- **Database**: PostgreSQL tables `resume_sessions` and `resume_sections`

## Security and Privacy

- All resume data is stored securely in PostgreSQL
- Sessions are unique and private to each user
- AI processing happens server-side for security
- No data is shared with third parties
- Users maintain full control over their content

## Future Enhancements

Planned features include:
- PDF export functionality
- Multiple resume versions
- Cover letter generation
- LinkedIn profile optimization
- Industry-specific templates
- Real-time collaboration

---

For technical support or feature requests, please use the "Report a Bug" button in the application footer.