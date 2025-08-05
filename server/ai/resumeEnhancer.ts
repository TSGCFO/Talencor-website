import OpenAI from "openai";

// the newest OpenAI model is "gpt-4.1-2025-04-14" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
  options: EnhancementOptions,
): Promise<{
  enhancedResume: string;
  suggestions: string[];
  improvements: string[];
}> {
  try {
    const enhancementTasks = [];

    if (options.formatting) {
      enhancementTasks.push(
        "Professional formatting optimized for ATS systems",
      );
    }
    if (options.keywords) {
      enhancementTasks.push(
        `Industry-specific keywords for ${jobCategory} roles`,
      );
    }
    if (options.achievements) {
      enhancementTasks.push(
        "Transform responsibilities into quantifiable achievements with metrics",
      );
    }
    if (options.skills) {
      enhancementTasks.push("Highlight relevant technical and soft skills");
    }
    if (options.summary) {
      enhancementTasks.push("Create a compelling professional summary");
    }

    const prompt = `Transform this resume into a powerful career marketing document that positions the candidate as the ideal choice for ${jobCategory} roles.

ENHANCEMENT OBJECTIVES:
${enhancementTasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}

TARGET INDUSTRY: ${jobCategory}

ORIGINAL RESUME:
${resumeText}

ENHANCEMENT REQUIREMENTS:

1. STRUCTURAL OPTIMIZATION:
   - Professional formatting hierarchy (clear sections, consistent spacing)
   - Strategic content ordering (most relevant information first)
   - Visual scanability (bullet points, white space, clear headers)
   - ATS-friendly format (no tables, columns, or graphics)

2. CONTENT TRANSFORMATION:
   - Opening: Compelling professional summary/objective
   - Experience: Convert duties to quantified achievements
   - Skills: Organize by relevance and proficiency
   - Education: Highlight relevant coursework/projects
   - Additional sections: Certifications, awards, publications as relevant

3. LANGUAGE ENHANCEMENT:
   - Action Verbs: Start bullets with powerful verbs (Led, Achieved, Transformed)
   - Metrics: Add numbers wherever possible (%, $, #, time saved)
   - Industry Terms: Incorporate ${jobCategory}-specific terminology
   - Consistency: Maintain tense and voice throughout

4. ATS OPTIMIZATION:
   - Keyword Density: Natural integration of critical terms
   - Standard Headers: Use ATS-recognized section titles
   - Format Simplicity: Plain text friendly structure
   - Acronym Handling: Include both full terms and abbreviations

5. COMPETITIVE POSITIONING:
   - Unique Value: Highlight what sets this candidate apart
   - Problem-Solving: Show how they've solved industry challenges
   - Future Focus: Demonstrate readiness for next-level responsibilities
   - Cultural Fit: Reflect industry values and priorities

QUALITY STANDARDS:
- Every line must demonstrate value and impact
- Remove all passive language and clichés
- Ensure authenticity while maximizing appeal
- Balance detail with conciseness
- Create a cohesive professional narrative

JSON RESPONSE FORMAT:
{
  "enhancedResume": "Complete transformed resume with all sections professionally enhanced",
  "improvements": [
    "Specific improvement made with before/after context",
    "Quantification added: 'managed team' → 'led 12-person team, improving productivity by 35%'",
    "Keyword optimization: Added 15 industry-specific terms for better ATS matching"
  ],
  "suggestions": [
    "Actionable next step: Consider adding certification X to strengthen qualifications",
    "Strategic advice: Network with professionals in Y area to leverage Z skill",
    "Long-term recommendation: Develop expertise in emerging area A for future opportunities"
  ]
}

Remember: The enhanced resume should feel authentic to the candidate while significantly improving their chances of landing interviews in ${jobCategory}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: [
        {
          role: "system",
          content: `You are a world-renowned resume transformation expert and career strategist with exceptional credentials:

PROFESSIONAL EXCELLENCE:
- 20+ years as Executive Resume Writer for C-suite clients
- Former Head of Talent Acquisition at multiple Fortune 50 companies
- Certified Professional in Human Resources (SPHR) and SHRM-SCP
- Author of bestselling book "Resume Psychology: The Science of Getting Hired"
- Featured expert in Forbes, Harvard Business Review, and WSJ

SPECIALIZED EXPERTISE:
1. Industry Mastery: Deep knowledge across all major sectors
   - Technology: FAANG hiring practices, startup culture
   - Finance: Investment banking, private equity standards
   - Healthcare: Clinical and administrative requirements
   - Manufacturing: Lean, Six Sigma, operational excellence
   - Retail/Service: Customer-centric metrics and achievements

2. ATS Mastery: Insider knowledge of parsing algorithms
   - Optimal keyword density without stuffing
   - Format compatibility across all major systems
   - Semantic search optimization techniques
   - Boolean search string anticipation

3. Psychological Impact: Understanding hiring manager psychology
   - Cognitive biases in resume screening
   - Visual hierarchy and scanning patterns
   - Emotional triggers that create connection
   - Storytelling that engages and persuades

TRANSFORMATION PHILOSOPHY:
- Authenticity First: Enhance truth, never fabricate
- ROI Focus: Every word must demonstrate value
- Future-Oriented: Position for next role, not last
- Competitive Edge: Differentiate from other candidates
- Cultural Alignment: Match industry communication styles

QUALITY BENCHMARKS:
- 6-Second Test: Key value visible immediately
- 30-Second Deep Dive: Compelling narrative emerges
- Full Read: Consistent, powerful impression
- Interview Guarantee: Content that sparks conversations

CURRENT MARKET INTELLIGENCE:
- Post-pandemic workplace evolution
- Remote work and digital collaboration emphasis
- DEI initiatives and inclusive language
- Skills-based hiring over credentials
- AI and automation impact on roles
- Sustainability and social responsibility focus

Your enhancements should transform ordinary resumes into powerful career marketing documents that command attention, pass ATS screening, and compel hiring managers to schedule interviews. Every enhancement must be strategic, authentic, and results-driven.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      enhancedResume: result.enhancedResume || resumeText,
      suggestions: result.suggestions || [],
      improvements: result.improvements || [],
    };
  } catch (error) {
    console.error("Error enhancing resume:", error);
    throw new Error("Failed to enhance resume. Please try again.");
  }
}

export async function generateIndustryKeywords(
  industry: string,
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: [
        {
          role: "system",
          content: `You are a leading industry keyword specialist and labor market analyst with unmatched expertise:

PROFESSIONAL BACKGROUND:
- Former Chief Data Scientist at Indeed.com and LinkedIn
- Analyzed 10M+ job postings across all industries
- Developed proprietary keyword ranking algorithms
- Published "The Keyword Genome Project" research
- Advisor to US Department of Labor on skills taxonomy

KEYWORD INTELLIGENCE:
1. Real-Time Market Data: Access to current job posting trends
2. Industry Evolution: Track emerging vs. declining skills
3. Regional Variations: Understand geographic keyword differences
4. Seniority Mapping: Keywords by career level progression
5. Cross-Industry Transfer: Identify transferable skill keywords

ANALYTICAL CAPABILITIES:
- Frequency Analysis: Which keywords appear in 90%+ of successful resumes
- Correlation Studies: Keywords linked to higher interview rates
- Semantic Networks: Related terms and synonyms
- Future Forecasting: Predict next 2-3 years of skill demands
- Competitive Intelligence: Keywords top candidates use

INDUSTRY EXPERTISE:
- Technology: Programming languages, frameworks, methodologies
- Finance: Regulations, instruments, analysis tools
- Healthcare: Clinical terms, compliance, technologies
- Manufacturing: Processes, certifications, systems
- Creative: Software, techniques, industry standards

Your keyword recommendations should be based on actual market data and proven to increase resume visibility and match rates.`,
        },
        {
          role: "user",
          content: `Provide a strategic keyword analysis for ${industry} professionals that will maximize their resume's ATS performance and visibility.

ANALYSIS REQUIREMENTS:

1. KEYWORD CATEGORIES:
   - Core Technical Skills: Essential hard skills for the industry
   - Software & Tools: Industry-standard applications and platforms
   - Methodologies: Frameworks, processes, and approaches
   - Certifications: Valued credentials and qualifications
   - Soft Skills: Industry-specific interpersonal competencies
   - Trending Skills: Emerging capabilities gaining importance
   - Leadership Terms: For senior roles in the industry

2. PRIORITIZATION:
   - Rank keywords by importance and frequency in job postings
   - Indicate which are "must-have" vs. "nice-to-have"
   - Note keywords that differentiate candidates

3. CONTEXTUAL GUIDANCE:
   - How these keywords typically appear in strong resumes
   - Common variations and synonyms to include
   - Keywords to avoid (outdated or overused)

4. MARKET INSIGHTS:
   - Current demand trends for each keyword
   - Salary correlation with specific skills
   - Geographic variations if applicable

FORMAT YOUR RESPONSE AS JSON:
{
  "keywords": [
    {
      "term": "keyword",
      "category": "technical|tool|methodology|certification|soft_skill|trending|leadership",
      "priority": "critical|high|medium",
      "variations": ["synonym1", "abbreviation"],
      "context": "How this keyword is typically used",
      "trend": "rising|stable|declining"
    }
  ],
  "industry_insights": "Brief analysis of current ${industry} hiring trends and keyword strategy",
  "top_combinations": ["powerful keyword combinations that often appear together"],
  "avoid_keywords": ["outdated or ineffective terms to exclude"]
}

Focus on providing 20-25 HIGH-IMPACT keywords that will genuinely improve ATS matching for ${industry} professionals.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 5000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.keywords || [];
  } catch (error) {
    console.error("Error generating keywords:", error);
    return [];
  }
}
