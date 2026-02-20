# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # Run ESLint
npm start      # Start production server
```

No test framework is configured yet.

## Architecture

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Prisma + Neon PostgreSQL, deployed on Vercel.

**Path alias:** `@/*` → `./src/*`

**Planned directory structure** (from `docs/plans/prompt-manager.md`):

```
src/
├── app/
│   ├── page.tsx                    # Prompt library with category filter
│   ├── prompts/new/page.tsx        # Create prompt
│   ├── prompts/[id]/page.tsx       # Use prompt (fill variables, copy result)
│   ├── prompts/[id]/edit/page.tsx  # Edit prompt
│   ├── categories/page.tsx         # Manage categories
│   └── api/
│       ├── prompts/route.ts
│       └── categories/route.ts
├── components/
│   ├── PromptCard.tsx
│   ├── PromptForm.tsx
│   ├── VariableForm.tsx
│   ├── CategoryFilter.tsx
│   └── CopyButton.tsx
├── lib/
│   ├── db.ts            # Prisma singleton
│   └── prompt-utils.ts  # Template variable substitution
└── types/index.ts
```

## Data Model

Three Prisma models: `Category` (id, name unique), `Prompt` (id, title, description, template, categoryId), `Variable` (id, label, type: text|select|number, placeholder, options JSON, order, promptId).

## Template Syntax

Prompt templates use `{{variable_id}}` placeholders. The `lib/prompt-utils.ts` utility substitutes values via regex; missing values fall back to the original placeholder.

## Implementation Plan

The project plan with 14 tasks and progress tracking is in `docs/plans/prompt-manager.md`. Update it as tasks are completed.
