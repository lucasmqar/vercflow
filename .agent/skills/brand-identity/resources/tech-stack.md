# Preferred Tech Stack & Implementation Rules

When generating code or UI components for VERCFLOW, you **MUST** strictly adhere to the following technology choices.

## Core Stack
* **Framework:** React 18+ (TypeScript is mandatory)
* **Build Tool:** Vite
* **Styling Engine:** Tailwind CSS
* **Component Library:** shadcn/ui
* **Icons:** Lucide React
* **State Management:** Zustand
* **Animations:** Framer Motion

## Implementation Guidelines

### 1. Tailwind Usage
* Use utility classes directly in JSX.
* Utilize the color tokens defined in `design-tokens.json` (e.g., use `bg-primary text-primary-foreground`).
* Always include `dark:` variants for components since VERCFLOW supports Dark Mode.

### 2. Component Patterns
* **Data Views:** Use the generic `DataView` component for all lists, tables, and kanban boards.
* **Forms:** Labels ABOVE input fields. Use `react-hook-form` and `zod` for validation.
* **Glassmorphism:** Use the `.glass-card` and `.glass-header` utility classes for premium UI sections.

### 3. Forbidden Patterns
* Do NOT use jQuery or Bootstrap.
* Do NOT use plain CSS in `.module.css` files unless strictly necessary for third-party libs.
* Do NOT hardcode colors; use Tailwind colors or CSS variables.

## Folder Structure
* Components: `apps/web/src/components`
* Hooks: `apps/web/src/hooks`
* Pages: `apps/web/src/pages`
* Services: `apps/web/src/services`
