import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PromptForm from "@/components/PromptForm";
import type { CategoryData, PromptData, VariableType } from "@/types";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [rawPrompt, rawCategories] = await Promise.all([
    prisma.prompt.findUnique({
      where: { id },
      include: { category: true, variables: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!rawPrompt) notFound();

  const prompt: PromptData = {
    ...rawPrompt,
    description: rawPrompt.description,
    category: { ...rawPrompt.category, createdAt: rawPrompt.category.createdAt.toISOString() },
    variables: rawPrompt.variables.map((v) => ({ ...v, type: v.type as VariableType, promptId: rawPrompt.id })),
    createdAt: rawPrompt.createdAt.toISOString(),
    updatedAt: rawPrompt.updatedAt.toISOString(),
  };

  const categories: CategoryData[] = rawCategories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">Edit Prompt</h1>
      <PromptForm categories={categories} prompt={prompt} />
    </div>
  );
}
