import { prisma } from "@/lib/db";
import PromptForm from "@/components/PromptForm";
import type { CategoryData } from "@/types";

export default async function NewPromptPage() {
  const raw = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const categories: CategoryData[] = raw.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  if (categories.length === 0) {
    return (
      <div className="text-sm text-zinc-500">
        No categories yet.{" "}
        <a href="/categories" className="underline">
          Create one first.
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">New Prompt</h1>
      <PromptForm categories={categories} />
    </div>
  );
}
