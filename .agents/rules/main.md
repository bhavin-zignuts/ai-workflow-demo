# Next.js & React Coding Rules

These rules apply when developing in this project. They enforce consistent, reusable, and structured frontend development.

## 1. Code Reuse & Component Design
* **Check Existing Codebase**: Before creating any new component, search the existing codebase (especially under `components/`, `ui/`, or common folders) to see if a similar or customizable component already exists.
* **Component Location**: Place reusable/common UI components in the common component directory.
* **Server vs Client Components**: Prefer React Server Components (RSC) by default for performance and SEO. Use `"use client"` only when interactive features (e.g., state, effects, event listeners) or React Query / React Hook Form hooks are required.

## 2. Form Integration (React Hook Form & Zod)
* **Standard Stack**: Use `react-hook-form` along with `@hookform/resolvers/zod` and `zod` for all form handling and validation.
* **Validation Schemas**: Always define schemas using `zod`. Keep validation rules strict and provide user-friendly error messages.
* **Typing**: Infer form input types directly from the Zod schema using `zod.infer<typeof schema>` to maintain type safety.

## 3. API Integration (React Query)
* **Standard Stack**: Use TanStack React Query (`@tanstack/react-query`) for data fetching, caching, synchronization, and state management.
* **Check Existing API Structure**: Before writing any new API hooks or fetching code, inspect the existing API structure (e.g., Axios instances, interceptors, services, hooks, query keys) to ensure you follow the established patterns.
* **Custom Hooks**: Wrap API calls in custom hooks (e.g., `useQuery` or `useMutation`) rather than calling raw fetch/Axios inside components.

## 4. Styling & Types
* **Tailwind CSS**: Use Tailwind CSS for utility-first styling. Avoid writing inline styles or custom CSS classes unless absolutely necessary.
* **TypeScript**: Keep all components and hooks strictly typed. Avoid `any` types.
* **Design Guidelines**: Always refer to the `design-system` skill ([SKILL.md](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/design-system/SKILL.md)) for color palettes, typography tracking values, card layout padding, border radius tables, and Do's and Don'ts before executing design-related tasks.
