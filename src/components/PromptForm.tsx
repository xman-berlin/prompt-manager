"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VariableForm from "@/components/VariableForm";
import type { CategoryData, PromptData, VariableInput } from "@/types";

interface Props {
  categories: CategoryData[];
  prompt?: PromptData; // present when editing
}

function parseVariables(prompt: PromptData): VariableInput[] {
  return prompt.variables.map((v) => ({
    key: v.key,
    label: v.label,
    type: v.type as "text" | "select" | "number",
    placeholder: v.placeholder ?? "",
    options: v.options ? JSON.parse(v.options) : [],
    order: v.order,
  }));
}

export default function PromptForm({ categories, prompt }: Props) {
  const router = useRouter();
  const isEdit = !!prompt;

  const [title, setTitle] = useState(prompt?.title ?? "");
  const [description, setDescription] = useState(prompt?.description ?? "");
  const [template, setTemplate] = useState(prompt?.template ?? "");
  const [categoryId, setCategoryId] = useState(prompt?.categoryId ?? categories[0]?.id ?? "");
  const [variables, setVariables] = useState<VariableInput[]>(
    prompt ? parseVariables(prompt) : []
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !template.trim() || !categoryId) {
      setError("Title, template and category are required.");
      return;
    }
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/prompts/${prompt!.id}` : "/api/prompts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, template, categoryId, variables }),
    });

    if (!res.ok) {
      setError("Failed to save prompt.");
      setSaving(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-zinc-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete Stock Breakdown"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Description <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of what this prompt does"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Template{" "}
          <span className="font-normal text-zinc-400">use {"{{variable_key}}"} placeholders</span>
        </label>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={10}
          placeholder="Write your prompt template here..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700">Variables</h3>
        <VariableForm variables={variables} onChange={setVariables} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Prompt"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
