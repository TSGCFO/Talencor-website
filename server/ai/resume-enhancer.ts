import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ResumeSection {
  type: 'summary' | 'experience' | 'education' | 'skills' | 'achievements';
  content: string;
}

export interface ResumeAnalysis {
  overallScore: number;
  sections: {
    [K in ResumeSection['type']]: {
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
You are an expert resume analyst and career coach. Analyze the following resume sections and provide detailed feedback.

Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}

Resume Sections:
${sections.map(section => `
${section.type.toUpperCase()}:
${section.content}
`).join('\n')}

Provide a comprehensive analysis in JSON format with:
1. Overall score (1-100)
2. Section-by-section analysis with scores and feedback
3. Keyword optimization analysis
4. ATS optimization recommendations
5. Industry-specific suggestions

Focus on:
- Content quality and impact
- ATS compatibility
- Keyword optimization
- Quantifiable achievements
- Professional language
- Industry relevance
- Structure and formatting recommendations
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

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return analysis;
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