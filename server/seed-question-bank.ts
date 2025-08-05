import { db } from "./db";
import {
  questionCategories,
  customInterviewQuestions,
  questionTags,
} from "@shared/schema";

async function seedQuestionBank() {
  console.log("🌱 Seeding question bank with sample data...");

  try {
    // Create sample categories
    const categories = [
      {
        name: "General",
        description: "Common interview questions applicable to most positions",
      },
      {
        name: "Behavioral",
        description: "Questions about past experiences and behavior patterns",
      },
      {
        name: "Technical",
        description:
          "Role-specific technical questions and problem-solving scenarios",
      },
      {
        name: "Leadership",
        description:
          "Questions focused on management and leadership capabilities",
      },
      {
        name: "Customer Service",
        description: "Questions specific to customer-facing roles",
      },
    ];

    const insertedCategories = await db
      .insert(questionCategories)
      .values(categories)
      .returning()
      .onConflictDoNothing();

    console.log(`✅ Created ${insertedCategories.length} categories`);

    // Create sample tags
    const tags = [
      { name: "Communication", color: "#3B82F6" },
      { name: "Problem Solving", color: "#10B981" },
      { name: "Leadership", color: "#8B5CF6" },
      { name: "Teamwork", color: "#F59E0B" },
      { name: "Adaptability", color: "#EF4444" },
      { name: "Time Management", color: "#6366F1" },
      { name: "Conflict Resolution", color: "#EC4899" },
      { name: "Decision Making", color: "#14B8A6" },
    ];

    const insertedTags = await db
      .insert(questionTags)
      .values(tags)
      .returning()
      .onConflictDoNothing();

    console.log(`✅ Created ${insertedTags.length} tags`);

    // Create sample questions
    const sampleQuestions = [
      {
        categoryId:
          insertedCategories.find((c) => c.name === "General")?.id || 1,
        question:
          "Tell me about yourself and why you're interested in this position.",
        difficulty: "entry" as const,
        tips: [
          "Keep your answer focused on professional experiences",
          "Connect your background to the specific role",
          "Practice a 2-3 minute elevator pitch",
        ],
        expectedElements: [
          "Professional background summary",
          "Relevant skills and experiences",
          "Interest in the role and company",
          "Career goals alignment",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "Behavioral")?.id || 2,
        question:
          "Describe a time when you had to work with a difficult team member. How did you handle the situation?",
        difficulty: "mid" as const,
        tips: [
          "Use the STAR method (Situation, Task, Action, Result)",
          "Focus on your actions and communication skills",
          "Show emotional intelligence and professionalism",
        ],
        expectedElements: [
          "Clear situation description",
          "Your specific role and responsibilities",
          "Actions taken to address the difficulty",
          "Positive outcome or lessons learned",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "Leadership")?.id || 4,
        question: "How do you handle underperforming team members?",
        difficulty: "senior" as const,
        tips: [
          "Emphasize coaching and development approach",
          "Mention documentation and formal processes",
          "Show balance between support and accountability",
        ],
        expectedElements: [
          "Initial assessment and understanding",
          "Clear communication of expectations",
          "Support and development plan",
          "Progress monitoring and follow-up",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "Technical")?.id || 3,
        question:
          "Walk me through how you would approach solving a complex problem you've never encountered before.",
        difficulty: "senior" as const,
        tips: [
          "Demonstrate systematic problem-solving approach",
          "Show research and learning capabilities",
          "Mention collaboration and seeking help when needed",
        ],
        expectedElements: [
          "Problem analysis and breakdown",
          "Research and information gathering",
          "Hypothesis formation and testing",
          "Implementation and validation",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "Customer Service")?.id ||
          5,
        question:
          "How would you handle an angry customer who feels their issue hasn't been resolved?",
        difficulty: "mid" as const,
        tips: [
          "Emphasize active listening and empathy",
          "Show de-escalation techniques",
          "Focus on solution-oriented approach",
        ],
        expectedElements: [
          "Active listening and acknowledgment",
          "Empathy and understanding",
          "Clear action plan for resolution",
          "Follow-up and relationship repair",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "General")?.id || 1,
        question:
          "What are your greatest strengths and how do they apply to this role?",
        difficulty: "entry" as const,
        tips: [
          "Choose strengths relevant to the job requirements",
          "Provide specific examples to support your claims",
          "Show how these strengths benefit the employer",
        ],
        expectedElements: [
          "2-3 relevant strengths",
          "Specific examples or evidence",
          "Connection to job requirements",
          "Value proposition for the employer",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "Behavioral")?.id || 2,
        question:
          "Tell me about a time when you had to learn something completely new quickly. How did you approach it?",
        difficulty: "mid" as const,
        tips: [
          "Show your learning methodology and adaptability",
          "Demonstrate resourcefulness and initiative",
          "Highlight successful application of new knowledge",
        ],
        expectedElements: [
          "Context of the learning need",
          "Specific learning strategies used",
          "Resources and support sought",
          "Successful application and results",
        ],
        isPublic: true,
        createdBy: "system",
      },
      {
        categoryId:
          insertedCategories.find((c) => c.name === "Leadership")?.id || 4,
        question:
          "Describe your leadership style and give an example of how you've motivated a team during a challenging project.",
        difficulty: "executive" as const,
        tips: [
          "Articulate your leadership philosophy clearly",
          "Provide concrete examples of motivational techniques",
          "Show results and team feedback",
        ],
        expectedElements: [
          "Clear leadership style description",
          "Specific challenging situation",
          "Motivational strategies employed",
          "Team response and project outcomes",
        ],
        isPublic: true,
        createdBy: "system",
      },
    ];

    const insertedQuestions = await db
      .insert(customInterviewQuestions)
      .values(sampleQuestions)
      .returning()
      .onConflictDoNothing();

    console.log(`✅ Created ${insertedQuestions.length} sample questions`);

    console.log("🎉 Question bank seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding question bank:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuestionBank()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seedQuestionBank };
