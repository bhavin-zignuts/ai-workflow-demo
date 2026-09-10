---
name: react-development
description: >-
  Use this skill whenever designing, implementing, refactoring, or reviewing React & Next.js UI components, pages, forms, or data integrations. Enforces component reuse, modular splitting, LOC guidelines, React Hook Form with Zod, TanStack Query, Compound Components, and performance optimization.
---

# React & Next.js Development Skill

This skill governs standard frontend engineering workflows for Next.js (App Router) and React. It ensures code is clean, reusable, human-readable, and production-grade with near-zero errors.

---

## 1. Core Engineering Principles

### A. Component Reuse First (Search & Compose Before Creating)
Before creating any new component or writing raw UI markup:
1. **Search Existing Components:** Always check existing directories (e.g., `components/`, `components/ui/`, `ui/`, or `app/`) for existing primitives (such as Buttons, Inputs, Cards, Modals, Tabs, Badges, Loaders).
2. **Extend Rather Than Duplicate:** If an existing component covers 80% of your requirement, add a new variant, prop, or slot to the existing component rather than creating a duplicate or near-duplicate.
3. **Consistent Primitives:** Always compose features using existing design tokens and shared UI components to maintain visual and functional consistency.

### B. Proactive Component Splitting & Modular Architecture
Human developers write clean code by decomposing large problems into smaller, focused units.
1. **Single Responsibility:** A component should ideally do one thing well — rendering a specific section, handling a specific interaction, or wrapping a specific layout.
2. **Component Decomposition Hierarchy:**
   - **Page Orchestrator** (`app/**/page.tsx`): High-level layout and routing coordinator. Avoid inlining entire sections, massive tables, or deep nested markup here. Delegate to section components.
   - **Feature/Section Containers** (`components/features/*` or co-located): Orchestrate state, queries, and business logic for a specific section.
   - **Presentational Sub-Components**: Pure UI receiving typed props. Easy to test, read, and maintain.
   - **UI Primitives** (`components/ui/*`): Atomic, reusable building blocks (Button, Dialog, Input, Dropdown).
3. **Logic Extraction (Custom Hooks):** If a component's state management, effects, or event handlers grow beyond ~40–50 lines, extract them into a dedicated custom hook (e.g., `useUserProfile.ts` or `useDataTable.ts`).
4. **Co-location:** For sub-components that are only used by a single parent, co-locate them in a dedicated sub-folder or beside the parent feature rather than jamming hundreds of lines of JSX into a single file.

### C. Lines of Code (LOC) & Readability Guidelines
* **LOC Sweet Spot:** Aim to keep components under **500 lines of code** for optimal human readability and developer ergonomics. The ideal sweet spot is 100–300 lines for feature containers and < 150 lines for leaf components.
* **When to Split:** Whenever a component approaches 250–300 lines or starts managing multiple distinct UI sections, evaluate whether extracting sub-components improves clarity. Split when it makes architectural sense.
* **Pragmatic Flexibility:** Keeping under 500 LOC is a strong readability guideline, not an inflexible dogma. If a component exceeds 500 lines and splitting it is impractical, tightly coupled, or introduces unnecessary indirection, **it is completely fine** to keep it in one file.

---

## 2. Next.js & React Architecture Standards

### Server vs. Client Components
* **Default to React Server Components (RSC):** Keep components as Server Components by default for superior performance, smaller bundle sizes, and SEO.
* **Push `"use client"` to the Leaves:** Only mark components with `"use client"` when interactivity, browser APIs, React state (`useState`, `useEffect`), or client hooks (`useQuery`, `useForm`) are necessary. Never mark an entire page as `"use client"` if only a single nested widget is interactive.

### Strict TypeScript Standards
* Explicitly type all component props using interfaces or types.
* Avoid `any`. Use generics, union types, or `unknown` with type guards.
* Export prop types when the component is reusable across files.

---

## 3. State Management & "You Might Not Need an Effect" (Official React Standards)

Adhere strictly to modern React state architecture:

| State Classification | Recommended Solution | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Server / API State** | **TanStack React Query v5** or **RSC** | ❌ Storing server cache in `useState`, `useEffect`, or Context |
| **Shared Client State** | **Scoped React Context** or **State Lifting** | ❌ Sprawling, monolithic root contexts causing app-wide re-renders |
| **Local UI State** | **`useState` / `useReducer`** | ❌ Prematurely elevating local toggles/inputs to global state |
| **Derived State** | **Compute during render** (or `useMemo`) | ❌ Syncing state inside `useEffect` (e.g., `useEffect(() => setFiltered(items.filter(...)))`) |

---

## 4. Modern Component Patterns

### A. Compound Components Pattern (Clean Composable APIs)
Use React Context to build expressive, accessible compound components without prop drilling:

```typescript
'use client';

import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full flex flex-col gap-2">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-4" role="tablist">{children}</div>;
}

export function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => context.setActiveTab(value)}
      className={`pb-2 text-sm font-medium transition-colors ${
        isActive ? 'border-b-2 border-blue-600 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
      }`}
    >
      {children}
    </button>
  );
}

export function TabContent({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabContent must be used within Tabs');

  if (context.activeTab !== value) return null;
  return <div role="tabpanel" className="pt-4">{children}</div>;
}
```

---

## 5. Standard Utility Custom Hooks

When common UI interactions require extracted logic, adhere to referentially stable custom hooks:

### A. `useDebounce` (Search & Input Throttling)
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}
```

### B. `useOnClickOutside` (Popovers, Modals & Menus)
```typescript
import { useEffect, RefObject } from 'react';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

---

## 6. Form Integration Workflow (React Hook Form + Zod)

Always structure forms using React Hook Form paired with Zod validation.

### Step 1: Define the Zod Schema
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Step 2: Initialize React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});
```

### Step 3: Render and Bind Form
* Use `register` or `Controller` for controlled UI components.
* Render accessible error messages directly linked to form fields (`aria-invalid` and `aria-describedby`).

---

## 7. API Integration Workflow (TanStack React Query v5)

Always check the existing API setup (e.g., `lib/api.ts`, `services/`, or Axios instances) before introducing new requests.

### Data Fetching (useQuery)
* Wrap queries in custom hooks with descriptive query keys.
```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/api';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
}
```

### Data Mutations (useMutation)
* Handle optimistic updates and query invalidations on success.
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/lib/api';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
    },
  });
}
```

---

## 8. Performance Optimization & Virtualization

### A. Strategic Memoization (useMemo & useCallback)
* Follow official React guidance: **Do not prematurely memoize everything**.
* Use `useMemo` for computationally expensive transformations (e.g., sorting, filtering, aggregations on 500+ items).
* Use `useCallback` when passing callbacks to optimized children wrapped in `React.memo` or when used inside hook dependency arrays.

### B. Virtualization for Large Datasets (`@tanstack/react-virtual`)
For long lists (> 100 items) or massive tables, use `@tanstack/react-virtual` to keep DOM nodes minimal:
```typescript
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto border border-neutral-200 dark:border-neutral-800 rounded-md">
      <div
        className="w-full relative"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className="absolute top-0 left-0 w-full flex items-center px-4"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 9. Styling & Design System Alignment

* **Tailwind CSS & Token Architecture:** Use Tailwind utility classes and CSS variables/tokens defined in your project (e.g., theme colors, borders, and surfaces). Avoid ad-hoc inline styles.
* **Showcase Landing Page Tokens:** For styling changes to this repository's landing page, refer to the [`landing-design-system`](../landing-design-system/SKILL.md) skill for the specific Framer-inspired dark aesthetic, typography tracking, and atmospheric card tokens.
* **Component Forwarding:** Support `ref` forwarding (`React.forwardRef`) on low-level UI elements (inputs, buttons) where appropriate.
