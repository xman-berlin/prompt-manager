"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  _count: { prompts: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  async function create() {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) { setError("Name already taken."); return; }
    const cat = await res.json();
    setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
    setError("");
  }

  async function save(id: string) {
    const name = editName.trim();
    if (!name) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) { setError("Name already taken."); return; }
    const updated = await res.json();
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: updated.name } : c)).sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditId(null);
    setError("");
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setError("");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">Categories</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="New category name"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <button
          onClick={create}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Add
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-zinc-400">No categories yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3"
            >
              {editId === cat.id ? (
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save(cat.id);
                    if (e.key === "Escape") setEditId(null);
                  }}
                  className="flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-zinc-900">{cat.name}</span>
                  <span className="text-xs text-zinc-400">{cat._count.prompts} prompt{cat._count.prompts !== 1 ? "s" : ""}</span>
                </div>
              )}

              <div className="flex gap-2">
                {editId === cat.id ? (
                  <>
                    <button onClick={() => save(cat.id)} className="text-sm text-zinc-700 hover:text-zinc-900">Save</button>
                    <button onClick={() => setEditId(null)} className="text-sm text-zinc-400 hover:text-zinc-600">Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditId(cat.id); setEditName(cat.name); setError(""); }}
                      className="text-sm text-zinc-500 hover:text-zinc-900"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => remove(cat.id)}
                      className="text-sm text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
