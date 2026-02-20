import Link from "next/link";
import type { PromptData } from "@/types";

interface Props {
  prompt: PromptData;
  onDelete?: (id: string) => void;
}

export default function PromptCard({ prompt, onDelete }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="mb-1 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            {prompt.category.name}
          </span>
          <h2 className="text-base font-semibold text-zinc-900">{prompt.title}</h2>
          {prompt.description && (
            <p className="mt-0.5 text-sm text-zinc-500 line-clamp-2">{prompt.description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Link
          href={`/prompts/${prompt.id}`}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Use
        </Link>
        <Link
          href={`/prompts/${prompt.id}/edit`}
          className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Edit
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(prompt.id)}
            className="ml-auto rounded-md px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
