import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InterviewQuestionRequest {
  jobCategory: string;
  experienceLevel: string;
  questionNumber: number;
  previousQuestions?: string[];
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  overallFeedback: string;
}

export async function generateInterviewQuestion(request: InterviewQuestionRequest): Promise<{
  question: string;
  tips: string[];
  expectedElements: string[];
}> {
  try {
    const experienceLevelContext: Record<string, string> = {
      "entry": "entry-level position with 0-2 years of experience",
      "mid": "mid-level position with 3-5 years of experience", 
      "senior": "senior-level position with 6+ years of experience",
      "executive": "executive or leadership position"
    };

    const previousQuestionsContext = request.previousQuestions?.length 
      ? `\n\nPrevious questions asked (avoid repeating similar questions):\n${request.previousQuestions.join('\n')}`
      : '';

    const prompt = `You are an expert interviewer for ${request.jobCategory} roles. Generate a behavioral or technical interview question appropriate for a ${experienceLevelContext[request.experienceLevel] || 'professional'}.

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

    const response = await openai.chat.completions.create({
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

export async function evaluateInterviewResponse(
  question: string,
  response: string,
  jobCategory: string,
  experienceLevel: string
): Promise<InterviewFeedback> {
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

    const evaluationResponse = await openai.chat.completions.create({
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

export async function generateInterviewTips(jobCategory: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
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