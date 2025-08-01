import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ResumeSection {
  type: 'summary' | 'experience' | 'education' | 'skills' | 'achievements';
  content: string;
}

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

export interface EnhancedContent {
  original: string;
  enhanced: string;
  improvements: string[];
  reasoning: string;
}

export async function analyzeResume(sections: ResumeSection[], targetRole?: string, industry?: string): Promise<ResumeAnalysis> {
  try {
    const prompt = `
Analyze the following resume sections with precision and provide actionable feedback that will significantly improve the candidate's chances of landing interviews.

Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}

Resume Sections:
${sections.map(section => `
${section.type.toUpperCase()}:
${section.content}
`).join('\n')}

ANALYSIS REQUIREMENTS:

1. SCORING CRITERIA (1-100 scale):
   - 90-100: Exceptional - Ready for executive/senior roles
   - 80-89: Excellent - Strong competitive advantage
   - 70-79: Good - Solid foundation with minor improvements needed
   - 60-69: Fair - Several areas need enhancement
   - Below 60: Needs significant work

2. EVALUATION FACTORS:
   - Impact & Results: Quantifiable achievements, metrics, ROI
   - Relevance: Alignment with target role and industry
   - Keywords: Industry-specific terms, skills, technologies
   - Clarity: Concise, powerful language without jargon
   - Structure: Logical flow, easy scanning, proper formatting
   - Uniqueness: Differentiation from other candidates

3. SECTION-SPECIFIC ANALYSIS:
   - Summary: Hook, value proposition, unique selling points
   - Experience: STAR format, quantified results, progression
   - Education: Relevance, honors, coursework alignment
   - Skills: Technical/soft balance, proficiency levels, categorization
   - Achievements: Significance, recency, relevance

Provide a comprehensive analysis in JSON format with this EXACT structure:
{
  "overallScore": number (1-100),
  "sections": {
    "summary": { "score": number (1-100), "feedback": "specific actionable feedback", "suggestions": ["concrete improvement steps"] },
    "experience": { "score": number (1-100), "feedback": "specific actionable feedback", "suggestions": ["concrete improvement steps"] },
    "education": { "score": number (1-100), "feedback": "specific actionable feedback", "suggestions": ["concrete improvement steps"] },
    "skills": { "score": number (1-100), "feedback": "specific actionable feedback", "suggestions": ["concrete improvement steps"] },
    "achievements": { "score": number (1-100), "feedback": "specific actionable feedback", "suggestions": ["concrete improvement steps"] }
  },
  "keywordOptimization": {
    "missing": ["critical keywords not found"],
    "present": ["strong keywords already included"],
    "suggestions": "specific advice on keyword integration"
  },
  "atsOptimization": {
    "score": number (1-100),
    "issues": ["specific ATS compatibility problems"],
    "recommendations": ["actionable ATS optimization steps"]
  },
  "industrySpecific": {
    "relevance": number (1-100),
    "suggestions": ["industry-specific improvements"]
  }
}

IMPORTANT RULES:
- Only include sections that were provided in the input
- Provide specific, actionable feedback - avoid generic advice
- Focus on improvements that will have immediate impact
- Consider both ATS scanning and human review
- Tailor all suggestions to the specific target role and industry
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyst with 15+ years of experience in recruitment and career coaching. Provide detailed, actionable feedback that helps job seekers improve their resumes for better ATS compatibility and hiring manager appeal."
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
    if (!content) {
      throw new Error('No content received from AI analysis');
    }

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI analysis');
    }

    // Ensure minimum required structure with fallbacks
    const structuredAnalysis: ResumeAnalysis = {
      overallScore: typeof analysis.overallScore === 'number' ? analysis.overallScore : 50,
      sections: {},
      keywordOptimization: {
        missing: Array.isArray(analysis.keywordOptimization?.missing) ? analysis.keywordOptimization.missing : [],
        present: Array.isArray(analysis.keywordOptimization?.present) ? analysis.keywordOptimization.present : [],
        suggestions: typeof analysis.keywordOptimization?.suggestions === 'string' ? analysis.keywordOptimization.suggestions : 'No keyword suggestions available'
      },
      atsOptimization: {
        score: typeof analysis.atsOptimization?.score === 'number' ? analysis.atsOptimization.score : 50,
        issues: Array.isArray(analysis.atsOptimization?.issues) ? analysis.atsOptimization.issues : [],
        recommendations: Array.isArray(analysis.atsOptimization?.recommendations) ? analysis.atsOptimization.recommendations : []
      },
      industrySpecific: {
        relevance: typeof analysis.industrySpecific?.relevance === 'number' ? analysis.industrySpecific.relevance : 50,
        suggestions: Array.isArray(analysis.industrySpecific?.suggestions) ? analysis.industrySpecific.suggestions : []
      }
    };

    // Only include sections that were provided in input
    for (const section of sections) {
      const sectionData = analysis.sections?.[section.type];
      if (sectionData && typeof sectionData === 'object') {
        structuredAnalysis.sections[section.type] = {
          score: typeof sectionData.score === 'number' ? sectionData.score : 50,
          feedback: typeof sectionData.feedback === 'string' ? sectionData.feedback : 'No feedback available',
          suggestions: Array.isArray(sectionData.suggestions) ? sectionData.suggestions : []
        };
      } else {
        // Fallback for missing section analysis
        structuredAnalysis.sections[section.type] = {
          score: 50,
          feedback: `Analysis for ${section.type} section is being processed`,
          suggestions: []
        };
      }
    }

    return structuredAnalysis;
  } catch (error) {
    throw new Error(`Resume analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function enhanceContent(content: string, sectionType: ResumeSection['type'], targetRole?: string, industry?: string): Promise<EnhancedContent> {
  try {
    const prompt = `
As an expert resume writer, enhance the following ${sectionType} section for better impact and ATS optimization.

Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}
Section Type: ${sectionType}

Original Content:
${content}

Requirements:
- Improve impact and readability
- Add relevant keywords for ATS optimization
- Use action verbs and quantifiable achievements
- Maintain authenticity and accuracy
- Optimize for ${targetRole ? `${targetRole} role` : 'general professional impact'}
- Follow industry best practices for ${industry || 'professional'} field

Provide response in JSON format with:
- enhanced: The improved content
- improvements: Array of specific improvements made
- reasoning: Explanation of why changes were made
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer with deep knowledge of ATS systems, hiring practices, and industry-specific requirements. Enhance content while maintaining authenticity and professional standards."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      original: content,
      enhanced: result.enhanced || content,
      improvements: result.improvements || [],
      reasoning: result.reasoning || ''
    };
  } catch (error) {
    throw new Error(`Content enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateKeywordSuggestions(targetRole: string, industry: string, currentContent: string): Promise<{
  keywords: string[];
  explanation: string;
}> {
  try {
    const prompt = `
Analyze the following resume content and suggest relevant keywords for a ${targetRole} position in the ${industry} industry.

Current Resume Content:
${currentContent}

Target Role: ${targetRole}
Industry: ${industry}

Provide keyword suggestions that are:
- Relevant to the target role and industry
- ATS-friendly
- Not already prominently featured in the current content
- Industry-standard terminology
- Skills, tools, technologies, and competencies

Return JSON with:
- keywords: Array of suggested keywords
- explanation: Brief explanation of why these keywords are important
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert in ATS optimization and recruitment technology. Provide keyword suggestions that will improve resume visibility and relevance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      keywords: result.keywords || [],
      explanation: result.explanation || ''
    };
  } catch (error) {
    throw new Error(`Keyword suggestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}