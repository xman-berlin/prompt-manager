# Prompt Manager

A personal web app to manage, organize, and use AI prompt templates with variable substitution.

**Production:** https://prompt-manager-green-gamma.vercel.app
**GitHub:** https://github.com/xman-berlin/prompt-manager
**Neon:** https://console.neon.tech (project: prompt-manager, database: neondb)

## Features

- Browse prompts filtered by category
- Fill in variables via form and copy the finished prompt
- Create, edit, delete prompts and categories
- Variable types: text, select (predefined options), number
- Template syntax: `{{variable_key}}`

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Prisma 7 + `@prisma/adapter-pg`
- Neon PostgreSQL
- Deployed on Vercel

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env` file with:

```
DATABASE_URL="postgresql://..."   # pooler connection (runtime)
DIRECT_URL="postgresql://..."     # direct connection (migrations)
```

```bash
npx prisma migrate dev   # run migrations
npx tsx prisma/seed.ts   # seed initial data
```
