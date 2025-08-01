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
          content: `You are a world-class resume analyst and career strategist with comprehensive expertise:

CREDENTIALS & EXPERIENCE:
- 15+ years as a senior recruiter at Fortune 500 companies
- Certified Professional Resume Writer (CPRW) and Career Coach
- Deep knowledge of ATS systems (Taleo, Workday, iCIMS, Greenhouse)
- Hired 1000+ candidates across all industries and seniority levels
- Published author on career development and job search strategies

YOUR ANALYTICAL APPROACH:
1. First Impressions: Evaluate like a hiring manager with 6 seconds to scan
2. ATS Optimization: Ensure compatibility with modern parsing algorithms
3. Keyword Strategy: Balance keyword density without keyword stuffing
4. Achievement Focus: Transform duties into quantifiable accomplishments
5. Industry Standards: Apply sector-specific best practices and terminology
6. Competitive Edge: Identify unique value propositions that differentiate

EVALUATION PHILOSOPHY:
- Be constructively critical but encouraging
- Provide specific examples, not generic advice
- Consider both entry-level and senior perspectives
- Account for career changes and non-linear paths
- Respect diverse backgrounds and experiences
- Focus on actionable improvements with immediate impact

CURRENT MARKET INSIGHTS:
- Remote work considerations and digital skills emphasis
- AI and automation's impact on job roles
- Diversity, equity, and inclusion priorities
- Skills-based hiring trends
- Post-pandemic workplace evolution

Your analysis should empower candidates to present their authentic professional story while maximizing their chances of landing interviews.`
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
Transform this ${sectionType} section into a compelling narrative that positions the candidate as the ideal choice for their target role.

CONTEXT:
Target Role: ${targetRole || 'Not specified'}
Industry: ${industry || 'Not specified'}
Section Type: ${sectionType}

ORIGINAL CONTENT:
${content}

ENHANCEMENT GUIDELINES BY SECTION:

${sectionType === 'summary' ? `
PROFESSIONAL SUMMARY REQUIREMENTS:
1. Opening Hook: Start with a powerful descriptor (e.g., "Results-driven," "Award-winning")
2. Core Value: 2-3 key strengths that align with target role
3. Quantified Achievement: One standout metric or accomplishment
4. Industry Keywords: Naturally integrate 3-5 critical terms
5. Future Focus: What unique value they'll bring to the next role
6. Length: 3-4 impactful lines maximum

Example Structure:
[Descriptor] [Role] with [X years] expertise in [key areas]. [Major achievement with metric]. [Core competencies]. [Value proposition for target role].
` : ''}

${sectionType === 'experience' ? `
EXPERIENCE ENHANCEMENT REQUIREMENTS:
1. Job Title Optimization: Align with industry-standard titles
2. Company Context: Brief descriptor if not well-known (size, industry)
3. Achievement Bullets:
   - Start with strong action verbs (Led, Spearheaded, Transformed)
   - Include metrics (%, $, #) in at least 50% of bullets
   - Show progression and increased responsibility
   - Focus on outcomes, not duties
   - Use CAR format: Challenge-Action-Result
4. Keywords: Naturally embed role-specific technologies, methodologies
5. Length: 3-5 bullets for recent roles, 2-3 for older positions

Transformation Examples:
WEAK: "Responsible for managing team"
STRONG: "Led cross-functional team of 12, driving 34% productivity increase through agile methodology implementation"
` : ''}

${sectionType === 'education' ? `
EDUCATION ENHANCEMENT REQUIREMENTS:
1. Degree Relevance: Highlight coursework/projects relevant to target role
2. Academic Achievements: GPA (if 3.5+), honors, scholarships
3. Leadership & Activities: Relevant clubs, positions held
4. Certifications: Professional certifications prominently displayed
5. Executive Education: Highlight continuing education for senior roles
6. Format: Most recent first, include graduation year if within 10 years

Enhancement Focus:
- Emphasize ROI of education through practical applications
- Connect academic projects to professional capabilities
- Include relevant online certifications (Coursera, LinkedIn Learning)
` : ''}

${sectionType === 'skills' ? `
SKILLS SECTION REQUIREMENTS:
1. Categorization:
   - Technical/Hard Skills (tools, technologies, methodologies)
   - Soft/Leadership Skills (if senior role)
   - Industry-Specific Skills
   - Languages (with proficiency levels)
2. Prioritization: Most relevant to target role first
3. Proficiency Indicators: Where appropriate (Expert, Advanced, Intermediate)
4. ATS Optimization: Include variations (e.g., "JavaScript/JS")
5. Emerging Skills: Include in-demand skills for future-proofing
6. Avoid: Outdated technologies, basic skills everyone has

Structure Example:
Technical: Python (Expert), Machine Learning (Advanced), SQL, AWS
Leadership: Strategic Planning, Cross-functional Team Leadership
Industry: HIPAA Compliance, Healthcare Analytics
` : ''}

${sectionType === 'achievements' ? `
ACHIEVEMENTS ENHANCEMENT REQUIREMENTS:
1. Recognition Level: Company, industry, or international
2. Quantified Impact: Specific metrics and outcomes
3. Relevance: Direct connection to target role capabilities
4. Recency: Prioritize recent achievements (last 5 years)
5. Variety: Mix of individual and team achievements
6. Context: Brief explanation of significance

Format Examples:
- "Innovation Award 2023: Developed AI solution reducing processing time by 78%"
- "Top Performer: Ranked #1 in sales region for 3 consecutive years"
- "Published Author: 'Machine Learning in Finance' - IEEE Journal 2023"
` : ''}

UNIVERSAL ENHANCEMENT PRINCIPLES:
1. Clarity: Remove jargon, use clear, concise language
2. Impact: Every line should demonstrate value
3. Keywords: Naturally integrate without stuffing
4. Authenticity: Enhance truth, don't fabricate
5. Consistency: Maintain voice and tense throughout
6. Scanning: Use bullet points and white space effectively

JSON RESPONSE FORMAT:
{
  "enhanced": "The powerfully rewritten content maintaining all factual information",
  "improvements": [
    "Specific improvement #1 with before/after comparison",
    "Specific improvement #2 with rationale",
    "Specific improvement #3 with impact explanation"
  ],
  "reasoning": "Comprehensive explanation of the enhancement strategy and how it aligns with the target role and current market demands"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an elite resume transformation specialist with unparalleled expertise:

PROFESSIONAL BACKGROUND:
- Former Senior Recruiter at Google, Amazon, and Microsoft
- Certified Master Resume Writer (CMRW) with 500+ success stories
- ATS Technology Consultant who helped design parsing algorithms
- Career pivot specialist who's guided 200+ career changers
- Industry keynote speaker on "Future of Hiring" trends

ENHANCEMENT METHODOLOGY:
1. Psychological Impact: Craft content that triggers positive cognitive biases
2. Keyword Optimization: Strategic placement without sacrificing readability
3. Storytelling: Transform experiences into compelling career narratives
4. Quantification: Convert every possible achievement into measurable impact
5. Future-Proofing: Include emerging skills and industry directions

WRITING PRINCIPLES:
- Active Voice: Dynamic, engaging, results-oriented language
- Power Words: Leverage emotional triggers (pioneered, transformed, catalyzed)
- Specificity: Replace vague claims with concrete examples
- Brevity: Maximum impact with minimum words
- Authenticity: Enhance truth, never fabricate

INDUSTRY INTELLIGENCE:
- Know what hiring managers in each industry value most
- Understand salary benchmarks and negotiation leverage points
- Recognize industry-specific pain points your candidate can solve
- Apply sector-appropriate terminology and acronyms

QUALITY STANDARDS:
- Every enhancement must pass the "6-second scan test"
- Each line must answer "So what?" with clear value
- Content must work for both human readers and ATS parsers
- Maintain consistent voice that reflects candidate's level

Your enhancements should make candidates feel confident and empowered while giving them a genuine competitive advantage in their job search.`
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
Conduct a comprehensive keyword gap analysis to maximize this resume's visibility for ${targetRole} positions in the ${industry} industry.

CURRENT RESUME CONTENT:
${currentContent}

TARGET POSITION:
Role: ${targetRole}
Industry: ${industry}

KEYWORD ANALYSIS REQUIREMENTS:

1. MISSING HIGH-IMPACT KEYWORDS:
   - Core competencies required for ${targetRole}
   - Industry-standard technologies and tools
   - Methodologies and frameworks
   - Compliance and regulatory terms
   - Soft skills valued in ${industry}

2. KEYWORD CATEGORIES TO ANALYZE:
   - Technical Skills: Programming languages, software, platforms
   - Industry Terms: Sector-specific jargon and acronyms
   - Action Keywords: Results-oriented verbs for achievements
   - Certifications: Relevant professional credentials
   - Trending Skills: Emerging technologies and practices
   - Leadership Terms: For senior roles (strategy, vision, transformation)

3. ATS OPTIMIZATION STRATEGIES:
   - Include both spelled-out and abbreviated forms
   - Cover synonyms and variations
   - Match exact job posting terminology
   - Balance keyword density (not too sparse, not stuffing)

4. COMPETITIVE ANALYSIS:
   - Keywords that top ${targetRole} professionals use
   - Terms that appear in 80%+ of similar job postings
   - Differentiating keywords that set candidates apart

5. CONTEXTUAL PLACEMENT:
   - Where each keyword would be most effective
   - Natural integration without forcing

PROVIDE ANALYSIS IN THIS JSON FORMAT:
{
  "keywords": [
    {
      "term": "keyword",
      "category": "technical|industry|soft_skill|certification|trending",
      "priority": "critical|high|medium",
      "placement": "where to add this keyword"
    }
  ],
  "missing": [
    "Critical keywords not found in current resume"
  ],
  "present": [
    "Strong keywords already well-represented"
  ],
  "explanation": "Strategic explanation of why these specific keywords matter for ${targetRole} in ${industry}, including current market trends and ATS considerations"
}

IMPORTANT: Suggest only keywords that are genuinely relevant and would be authentic for the candidate to claim. Quality over quantity.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a cutting-edge ATS optimization specialist and keyword strategist with unique expertise:

PROFESSIONAL CREDENTIALS:
- Former LinkedIn Recruiter Insights product manager
- Designed keyword algorithms for top ATS platforms
- Analyzed 50,000+ resumes for keyword effectiveness
- Published research on "Semantic Search in Modern Recruiting"
- Consultant to Fortune 100 HR departments on talent acquisition

KEYWORD EXPERTISE:
1. ATS Algorithm Knowledge: Understand exact parsing logic of major systems
2. Semantic Analysis: Know which synonyms and variations ATS recognize
3. Industry Intelligence: Track trending keywords by role and sector
4. Competitive Insight: Access to keyword success rates by position
5. Future Trends: Predict emerging skills before they become mainstream

ANALYTICAL FRAMEWORK:
- Keyword Density: Optimal frequency without triggering spam filters
- Contextual Relevance: Keywords must align with experience level
- Strategic Placement: Where keywords have maximum impact
- Natural Integration: Maintain readability while optimizing
- Cross-Platform: Keywords that work across different ATS

MARKET INTELLIGENCE:
- Know which keywords correlate with higher interview rates
- Understand regional and industry-specific variations
- Track real-time changes in job market demands
- Recognize keywords that age well vs. become obsolete

Your keyword recommendations should give candidates a measurable advantage in getting past ATS filters while maintaining authenticity and readability.`
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