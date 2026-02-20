# Prompt Manager — Plan

A personal web app to manage, organize, and use AI prompt templates with variable substitution. Prompts are categorized, stored in a database, and can be filled out via a form before copying the result to any AI tool.

## Stack

- **Framework**: Next.js (App Router, TypeScript)
- **ORM**: Prisma
- **Database**: Neon (Postgres, new project)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Package Manager**: npm

---

## Features

1. **Prompt Library** — Browse all prompts, filtered by category
2. **Use Prompt** — Fill in variables via form, get the finished prompt, copy to clipboard
3. **CRUD** — Create, edit, delete prompts and categories
4. **Variable Types** — `text`, `select` (predefined options), `number`

---

## Database Schema

```prisma
model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  prompts   Prompt[]
  createdAt DateTime @default(now())
}

model Prompt {
  id         String     @id @default(cuid())
  title      String
  description String?
  template   String     @db.Text
  category   Category   @relation(fields: [categoryId], references: [id])
  categoryId String
  variables  Variable[]
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

model Variable {
  id          String  @id @default(cuid())
  label       String
  type        String  // "text" | "select" | "number"
  placeholder String?
  options     String? // JSON array, only for type "select", e.g. ["beginner","intermediate","advanced"]
  order       Int     @default(0)
  prompt      Prompt  @relation(fields: [promptId], references: [id], onDelete: Cascade)
  promptId    String
}
```

---

## App Structure

```
src/
├── app/
│   ├── page.tsx                   # Prompt library (list + category filter)
│   ├── prompts/
│   │   ├── new/page.tsx           # Create prompt
│   │   └── [id]/
│   │       ├── page.tsx           # Use prompt (variable form + result)
│   │       └── edit/page.tsx      # Edit prompt
│   ├── categories/
│   │   └── page.tsx               # Manage categories
│   └── api/
│       ├── prompts/
│       │   ├── route.ts           # GET (list), POST (create)
│       │   └── [id]/route.ts      # GET, PUT, DELETE
│       └── categories/
│           ├── route.ts           # GET (list), POST (create)
│           └── [id]/route.ts      # PUT, DELETE
├── components/
│   ├── PromptCard.tsx             # Card in library view
│   ├── PromptForm.tsx             # Create/Edit form
│   ├── VariableForm.tsx           # Dynamic variable input form
│   ├── CategoryFilter.tsx         # Filter bar
│   └── CopyButton.tsx             # Copy to clipboard
├── lib/
│   ├── db.ts                      # Prisma singleton
│   └── prompt-utils.ts            # Template variable substitution
└── types/
    └── index.ts                   # Shared TypeScript types
```

---

## UI Flow

```
Library Page (/)
  → Prompts listed as cards, filterable by category
  → [Use] button → Variable form page
  → [Edit] button → Edit page (admin)
  → [+ New Prompt] button → Create page

Use Prompt (/prompts/[id])
  → Shows prompt title + description
  → Form with one input per variable (text input, select, number)
  → [Generate] → shows filled prompt in a text area
  → [Copy to Clipboard] button

Create/Edit (/prompts/new or /prompts/[id]/edit)
  → Title, Description, Category (select or create new)
  → Template textarea (use {{variable_id}} syntax)
  → Variable builder: add/remove/reorder variables
    → Each variable: label, type, placeholder, options (if select)
```

---

## Variable Substitution

Template syntax: `{{variable_id}}`

Example:
```
Template:  "Analyze the {{stock_ticker}} stock..."
Variables: [{ id: "stock_ticker", label: "Stock Ticker", type: "text" }]
Input:     stock_ticker = "AAPL"
Result:    "Analyze the AAPL stock..."
```

Utility function in `lib/prompt-utils.ts`:
```ts
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`);
}
```

---

## Seed Data

Two initial prompts from the planning phase:

1. **The Complete Stock Breakdown** (Category: Finance)
   - Variable: `stock_ticker` (text)

2. **Personalized Roadmap Builder** (Category: Learning)
   - Variables: `skill` (text), `level` (select: beginner/intermediate/advanced), `background` (text), `outcome` (text), `timeframe` (text), `hours_per_week` (number)

---

## Implementation Tasks

- [x] Create GitHub repo `prompt-manager`
- [x] Initialize Next.js project with TypeScript + Tailwind
- [x] Set up Neon project and database (`prompt_manager` DB auto-created by Prisma)
- [x] Configure Prisma with Neon connection string (Prisma 7 + `@prisma/adapter-pg`; pooler URL for runtime, direct URL for migrations in `prisma.config.ts`)
- [x] Define and migrate Prisma schema (Variable has `key` field — auto-generated snake_case from label)
- [x] Implement API routes (prompts + categories CRUD)
- [x] Build Library page (list + category filter)
- [x] Build Use Prompt page (variable form + result + copy)
- [x] Build Create/Edit Prompt page (with variable builder)
- [x] Build Categories management page
- [x] Add seed data (2 initial prompts)
- [ ] Deploy to Vercel
