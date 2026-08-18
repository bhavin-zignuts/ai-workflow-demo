---
name: react-development
description: >-
  Use this skill when implementing UI components, forms with React Hook Form & Zod, or API integrations with React Query.
---

# React & Next.js Development Skill

This skill outlines best practices and standard workflows for creating reusable components, managing forms with React Hook Form and Zod, and integration with React Query.

## 1. Codebase Analysis (Pre-requisites)

Before writing any new component or API query:
1. **Search for Existing Components**: Search the repository (e.g., in `components/`, `ui/`, or `src/`) for similar code. Do not duplicate components (such as Buttons, Modals, Inputs, Loaders).
2. **Search for Existing API Calls**: Locating existing API setup (e.g., `services/`, `lib/api.ts`, `hooks/api/`). Understand how auth headers, base URL, and Axios instances are defined, and use the same configuration.

---

## 2. Form Integration Workflow (React Hook Form + Zod)

Always structure forms using the following pattern:

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
* Use the register function or Controller for third-party UI components.
* Display validation errors using helper components or styled text block under each field.

---

## 3. API Integration Workflow (React Query)

Use TanStack Query hooks for asynchronous requests.

### Data Fetching (useQuery)
* Wrap queries in custom hooks.
* Follow project query key conventions (e.g., `['users', userId]`).

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
* Use mutations for creation, updates, and deletions.
* Handle invalidation of related queries upon success.

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/lib/api';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Invalidate existing queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
    },
  });
}
```

---

## 4. Abstracting Common Components

When creating common components:
* Define props with TypeScript interfaces.
* Use Tailwind CSS variables for themes if applicable.
* Support forwarding ref if it's an input or low-level layout element.
