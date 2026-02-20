"use client";

import type { CategoryData } from "@/types";

interface Props {
  categories: CategoryData[];
  selected: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-zinc-900 text-white"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === cat.id
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
