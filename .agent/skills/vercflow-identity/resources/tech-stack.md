# Preferred Tech Stack & Implementation Rules

## Core Stack
* **Frontend Framework:** React 18+ (Vite)
* **Language:** TypeScript 5+ (Strict mode)
* **Styling:** Tailwind CSS + `tailwindcss-animate`
* **UI Components:** shadcn/ui (Radix Primitives)
* **State Management:** Zustand (Global), TanStack Query (Server)
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL (Prisma ORM)

## Implementation Guidelines

### 1. Styling & Glassmorphism
* Use the `.glass` or `.glass-card` utility classes for containers.
* Avoid solid white backgrounds for main containers; let the mesh gradient shine through.
* Use `backdrop-blur` utilities for overlays.

### 2. File Mappings (Critical)
* **Uploads:** Files uploaded to the system MUST be renamed according to `Manual R03` before saving to storage (S3/Minio).
* **Path:** `apps/api/src/uploads` -> Mapped to "ID Verc" folder structures.

### 3. Component Architecture
* **Dashboards:** Must be modular by Department (e.g., `apps/web/src/pages/commercial`).
* **Forms:** Use `react-hook-form` + `zod` schema validation.
* **Tables:** Use `@tanstack/react-table` with virtualization for large datasets.

### 4. Database Rules
* **Ids:** Always use `cuid()` for primary keys.
* **Audit:** All critical actions (Updates/Deletes) must create an `AuditLog` entry.
* **Soft Delete:** Use `ativo: Boolean` or `deletedAt` for archiving; never hard delete records.
