"use client";

import { labelToKey } from "@/lib/prompt-utils";
import type { VariableInput, VariableType } from "@/types";

interface Props {
  variables: VariableInput[];
  onChange: (variables: VariableInput[]) => void;
}

const EMPTY_VARIABLE: VariableInput = {
  key: "",
  label: "",
  type: "text",
  placeholder: "",
  options: [],
  order: 0,
};

export default function VariableForm({ variables, onChange }: Props) {
  function add() {
    onChange([...variables, { ...EMPTY_VARIABLE, order: variables.length }]);
  }

  function remove(index: number) {
    onChange(variables.filter((_, i) => i !== index).map((v, i) => ({ ...v, order: i })));
  }

  function update(index: number, field: keyof VariableInput, value: unknown) {
    const updated = variables.map((v, i) => {
      if (i !== index) return v;
      const next = { ...v, [field]: value };
      if (field === "label") next.key = labelToKey(value as string);
      return next;
    });
    onChange(updated);
  }

  function updateOptions(index: number, raw: string) {
    const opts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    update(index, "options", opts);
  }

  return (
    <div className="flex flex-col gap-4">
      {variables.map((v, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-600">Variable {i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Label</label>
              <input
                type="text"
                value={v.label}
                onChange={(e) => update(i, "label", e.target.value)}
                placeholder="e.g. Stock Ticker"
                className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Template key <span className="font-normal text-zinc-400">(auto)</span>
              </label>
              <input
                type="text"
                value={v.key}
                readOnly
                className="w-full rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm text-zinc-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Type</label>
              <select
                value={v.type}
                onChange={(e) => update(i, "type", e.target.value as VariableType)}
                className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Placeholder</label>
              <input
                type="text"
                value={v.placeholder ?? ""}
                onChange={(e) => update(i, "placeholder", e.target.value)}
                placeholder="e.g. AAPL"
                className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
            </div>
            {v.type === "select" && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Options <span className="font-normal text-zinc-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={(v.options ?? []).join(", ")}
                  onChange={(e) => updateOptions(i, e.target.value)}
                  placeholder="e.g. beginner, intermediate, advanced"
                  className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
      >
        + Add Variable
      </button>
    </div>
  );
}
