---
name: vercflow-development
description: Helps manage the VERCFLOW monorepo. Use when the user asks for database changes, new features, or architectural refactorings.
---

# VERCFLOW Development Skill

## When to use this skill
- Adding new models or fields to the Prisma schema.
- Creating new React components or pages in `apps/web`.
- Implementing new API endpoints in `apps/api`.
- Running database migrations or seeding data.
- Refactoring existing code for better modularity.

## Workflow

1.  **Plan-Validate-Execute**:
    - [ ] Analyze `package.json` for script names.
    - [ ] Check `packages/db/prisma/schema.prisma` before modifying models.
    - [ ] Run `npm run db:generate` after schema changes.
    - [ ] Use `npm run dev` to verify full-stack changes.

2.  **Architecture Rules**:
    - **API**: Modern Express + Prisma. Keep controllers thin.
    - **Web**: React + Vite + Tailwind + shadcn/ui. Use `DataView` for lists.
    - **DB**: Centralized in `packages/db`. Use Prisma Enums for status.

## Instructions

### Database Changes
To modify the database:
1.  Edit `packages/db/prisma/schema.prisma`.
2.  Run `npm run db:migrate` (requires Docker/Postgres up).
3.  Run `npm run db:generate` to update the client.

### Frontend Development
- Custom hooks go in `apps/web/src/hooks`.
- Shared components in `apps/web/src/components/ui`.
- Icons from `lucide-react`.

### Backend Development
- Routes in `apps/api/src/routes`.
- Services/Logic in `apps/api/src/services`.

## Resources
- [README.md](file:///Users/lucasmqar/Desktop/vercflow/README.md)
- [schema.prisma](file:///Users/lucasmqar/Desktop/vercflow/packages/db/prisma/schema.prisma)
