import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { labelToKey } from "@/lib/prompt-utils";
import type { PromptInput } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: { category: true, variables: { orderBy: { order: "asc" } } },
  });
  if (!prompt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(prompt);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body: PromptInput = await request.json();
  const { title, description, template, categoryId, variables } = body;

  await prisma.variable.deleteMany({ where: { promptId: id } });

  const prompt = await prisma.prompt.update({
    where: { id },
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

  return NextResponse.json(prompt);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.prompt.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
