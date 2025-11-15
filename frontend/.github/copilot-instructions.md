# Copilot Instructions for Fin(Ai)d Hub

## Project Overview
- **Monorepo structure**: Organized by user roles (`app/accountant`, `app/accounting-firm-owner`, `app/admin`, `app/super-admin`) and shared UI/components.
- **Tech stack**: Next.js (App Router), React 18+, TypeScript, TailwindCSS, Radix UI, Zod, Axios.
- **Design system**: Custom theme via Tailwind config and CSS variables. Shared UI in `components/ui/`.

## Key Patterns & Conventions
- **Role-based navigation**: Each role has its own dashboard and navigation items, managed in `components/dashboard-layout.tsx`.
- **Providers**: Theme and Toast providers are set up in `app/layout.tsx`.
- **State management**: Local state and context, no Redux/MobX. Use hooks in `hooks/`.
- **API calls**: Use Axios, typically in `assets/functions/` or directly in components.
- **Form handling**: Use `react-hook-form` and Zod for validation.
- **Styling**: TailwindCSS with custom colors, radii, and animations. Use classnames from `clsx` and `class-variance-authority`.
- **Component organization**: Shared components in `components/`, role-specific in subfolders.
- **Routing**: Next.js App Router, pages in `app/`.

## Developer Workflows
- **Start dev server**: `pnpm dev` (or `npm run dev`)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Type checking**: TypeScript strict mode, but build ignores type errors (see `next.config.mjs`).
- **No test suite detected**: Add tests in future if needed.

## Integration Points
- **Radix UI**: Used for advanced UI primitives (menus, dialogs, etc.).
- **TailwindCSS**: Custom config in `tailwind.config.ts`, animated plugin enabled.
- **Theme**: Controlled via `ThemeProvider` and CSS variables.
- **Toast/Toaster**: Provided via `ToastProvider` and `Toaster` in layout.

## Project-Specific Notes
- **Access control**: Role-based UI, enforced in dashboard layout and via localStorage tokens.
- **Experimental Next.js features**: Enabled in `next.config.mjs` (parallel builds, etc.).
- **No global state library**: Prefer hooks/context.
- **Path aliases**: Use `@/` for root imports (see `tsconfig.json`).

## Examples
- To add a new dashboard item for a role, update the relevant array in `dashboard-layout.tsx`.
- To create a new shared UI component, add to `components/ui/` and import where needed.
- For API integration, use Axios and place helpers in `assets/functions/`.

---

If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.
