# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important URLs

- **Production:** https://prompt-manager-green-gamma.vercel.app
- **GitHub:** https://github.com/xman-berlin/prompt-manager
- **Neon:** https://console.neon.tech (project: prompt-manager, database: neondb)
- **Vercel:** https://vercel.com/xman-berlins-projects/prompt-manager

## Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Run ESLint
npm start                # Start production server
npx prisma migrate dev   # Run DB migrations
npx tsx prisma/seed.ts   # Seed initial data
```

No test framework is configured yet.

## Architecture

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Prisma 7 + `@prisma/adapter-pg` + Neon PostgreSQL, deployed on Vercel.

**Path alias:** `@/*` → `./src/*`

**Directory structure:**

```
src/
├── app/
│   ├── page.tsx                    # Prompt library with category filter (client component)
│   ├── prompts/new/page.tsx        # Create prompt
│   ├── prompts/[id]/page.tsx       # Use prompt (fill variables, copy result)
│   ├── prompts/[id]/edit/page.tsx  # Edit prompt
│   ├── categories/page.tsx         # Manage categories
│   └── api/
│       ├── prompts/route.ts        # GET, POST
│       ├── prompts/[id]/route.ts   # GET, PUT, DELETE
│       ├── categories/route.ts     # GET, POST
│       └── categories/[id]/route.ts # PUT, DELETE
├── components/
│   ├── PromptCard.tsx
│   ├── PromptForm.tsx
│   ├── VariableForm.tsx
│   ├── CategoryFilter.tsx
│   └── CopyButton.tsx
├── lib/
│   ├── db.ts            # Prisma singleton (uses @prisma/adapter-pg)
│   └── prompt-utils.ts  # fillTemplate(), labelToKey()
└── types/index.ts
```

## Data Model

- `Category` — id, name (unique), createdAt
- `Prompt` — id, title, description, template (Text), categoryId, createdAt, updatedAt
- `Variable` — id, **key** (snake_case, used in `{{key}}` placeholders), label, type (text|select|number), placeholder, options (JSON array for select), order, promptId

## Template Syntax

Prompt templates use `{{variable_key}}` placeholders. The `key` is auto-generated from the variable label via `labelToKey()` (snake_case). Example: label "Stock Ticker" → key `stock_ticker` → template `{{stock_ticker}}`.

## Prisma 7 Notes

- Uses `prisma-client-js` generator (output: `node_modules/@prisma/client`)
- No `url` in `schema.prisma` — URL passed via `@prisma/adapter-pg` at runtime
- `prisma.config.ts` uses `DIRECT_URL` for migrations
- `DATABASE_URL` = pooler (runtime), `DIRECT_URL` = direct (migrations)
- `postinstall` script runs `prisma generate` automatically on Vercel

## Implementation Plan

Progress tracking is in `docs/plans/prompt-manager.md`.
