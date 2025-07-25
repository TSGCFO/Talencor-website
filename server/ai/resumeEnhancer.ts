import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface EnhancementOptions {
  formatting: boolean;
  keywords: boolean;
  achievements: boolean;
  skills: boolean;
  summary: boolean;
}

export async function enhanceResume(
  resumeText: string,
  jobCategory: string,
  options: EnhancementOptions
): Promise<{
  enhancedResume: string;
  suggestions: string[];
  improvements: string[];
}> {
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

${enhancementTasks.join('\n')}

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
      max_tokens: 2000
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

export async function generateIndustryKeywords(industry: string): Promise<string[]> {
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