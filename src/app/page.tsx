"use client";

import { useEffect, useState } from "react";
import PromptCard from "@/components/PromptCard";
import CategoryFilter from "@/components/CategoryFilter";
import type { CategoryData, PromptData } from "@/types";

export default function LibraryPage() {
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/prompts").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([p, c]) => {
      setPrompts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this prompt?")) return;
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = selectedCategory
    ? prompts.filter((p) => p.categoryId === selectedCategory)
    : prompts;

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Prompt Library</h1>
        <span className="text-sm text-zinc-400">{filtered.length} prompt{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400">No prompts yet. Create your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <PromptCard key={p.id} prompt={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
