import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Categories
  const finance = await prisma.category.upsert({
    where: { name: "Finance" },
    update: {},
    create: { name: "Finance" },
  });

  const learning = await prisma.category.upsert({
    where: { name: "Learning" },
    update: {},
    create: { name: "Learning" },
  });

  // Prompt 1: The Complete Stock Breakdown
  const existingStock = await prisma.prompt.findFirst({
    where: { title: "The Complete Stock Breakdown" },
  });

  if (!existingStock) {
    await prisma.prompt.create({
      data: {
        title: "The Complete Stock Breakdown",
        description: "Deep-dive analysis of any stock ticker",
        template: `Analyze the {{stock_ticker}} stock in detail. Cover the following:

1. Company overview and business model
2. Recent financial performance (revenue, earnings, margins)
3. Key growth drivers and risks
4. Valuation metrics (P/E, P/S, EV/EBITDA) vs peers
5. Technical analysis: support/resistance levels, trend
6. Analyst consensus and price targets
7. Your overall assessment: buy, hold, or sell — and why.`,
        categoryId: finance.id,
        variables: {
          create: [
            {
              key: "stock_ticker",
              label: "Stock Ticker",
              type: "text",
              placeholder: "e.g. AAPL",
              order: 0,
            },
          ],
        },
      },
    });
    console.log("Created: The Complete Stock Breakdown");
  }

  // Prompt 2: Personalized Roadmap Builder
  const existingRoadmap = await prisma.prompt.findFirst({
    where: { title: "Personalized Roadmap Builder" },
  });

  if (!existingRoadmap) {
    await prisma.prompt.create({
      data: {
        title: "Personalized Roadmap Builder",
        description: "Generate a custom learning roadmap for any skill",
        template: `Create a personalized learning roadmap for someone who wants to master {{skill}}.

**Current level:** {{level}}
**Background:** {{background}}
**Goal:** {{outcome}}
**Timeframe:** {{timeframe}}
**Available time:** {{hours_per_week}} hours/week

Provide:
1. A phased learning plan broken into milestones
2. Recommended resources (books, courses, projects) for each phase
3. Weekly schedule template
4. Key skills and checkpoints to validate progress
5. Common mistakes to avoid at this level`,
        categoryId: learning.id,
        variables: {
          create: [
            { key: "skill", label: "Skill", type: "text", placeholder: "e.g. Machine Learning", order: 0 },
            {
              key: "level",
              label: "Current Level",
              type: "select",
              options: JSON.stringify(["beginner", "intermediate", "advanced"]),
              order: 1,
            },
            { key: "background", label: "Background", type: "text", placeholder: "e.g. Software engineer with Python experience", order: 2 },
            { key: "outcome", label: "Goal / Outcome", type: "text", placeholder: "e.g. Get a job as an ML engineer", order: 3 },
            { key: "timeframe", label: "Timeframe", type: "text", placeholder: "e.g. 6 months", order: 4 },
            { key: "hours_per_week", label: "Hours per Week", type: "number", placeholder: "e.g. 10", order: 5 },
          ],
        },
      },
    });
    console.log("Created: Personalized Roadmap Builder");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
