"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import { fillTemplate } from "@/lib/prompt-utils";
import type { PromptData, VariableData } from "@/types";

export default function UsePromptPage() {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<PromptData | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch(`/api/prompts/${id}`)
      .then((r) => r.json())
      .then((p: PromptData) => {
        setPrompt(p);
        const initial: Record<string, string> = {};
        p.variables.forEach((v) => (initial[v.key] = ""));
        setValues(initial);
      });
  }, [id]);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function generate() {
    if (!prompt) return;
    setResult(fillTemplate(prompt.template, values));
  }

  if (!prompt) return <p className="text-sm text-zinc-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="mb-1 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
          {prompt.category.name}
        </span>
        <h1 className="text-xl font-semibold text-zinc-900">{prompt.title}</h1>
        {prompt.description && (
          <p className="mt-1 text-sm text-zinc-500">{prompt.description}</p>
        )}
      </div>

      {prompt.variables.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-700">Fill in the variables</h2>
          {prompt.variables.map((v: VariableData) => (
            <div key={v.id}>
              <label className="mb-1 block text-sm font-medium text-zinc-700">{v.label}</label>
              {v.type === "select" ? (
                <select
                  value={values[v.key] ?? ""}
                  onChange={(e) => handleChange(v.key, e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 sm:max-w-xs"
                >
                  <option value="">— Select —</option>
                  {(JSON.parse(v.options ?? "[]") as string[]).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={v.type === "number" ? "number" : "text"}
                  value={values[v.key] ?? ""}
                  onChange={(e) => handleChange(v.key, e.target.value)}
                  placeholder={v.placeholder ?? ""}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 sm:max-w-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={generate}
        className="w-fit rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Generate
      </button>

      {result && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-700">Result</h2>
          <textarea
            readOnly
            value={result}
            rows={12}
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-800"
          />
          <div className="flex">
            <CopyButton text={result} />
          </div>
        </div>
      )}
    </div>
  );
}
