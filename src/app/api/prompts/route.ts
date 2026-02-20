import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { labelToKey } from "@/lib/prompt-utils";
import type { PromptInput } from "@/types";

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    include: { category: true, variables: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  const body: PromptInput = await request.json();
  const { title, description, template, categoryId, variables } = body;

  const prompt = await prisma.prompt.create({
    data: {
      title,
      description,
      template,
      categoryId,
      variables: {
        create: variables.map((v, i) => ({
          key: v.key || labelToKey(v.label),
          label: v.label,
          type: v.type,
          placeholder: v.placeholder ?? null,
          options: v.options ? JSON.stringify(v.options) : null,
          order: v.order ?? i,
        })),
      },
    },
    include: { category: true, variables: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(prompt, { status: 201 });
}
