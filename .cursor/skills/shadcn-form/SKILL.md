---
name: shadcn-form
description: Add a frontend form with React Hook Form, shadcn-style components, TanStack Query mutation, and visible feedback.
---

# shadcn Form Skill

## When to Use

Use when adding a user input flow in `apps/frontend`.

## Instructions

1. Build the form with React Hook Form.
2. Use `src/components/ui` primitives before adding new components.
3. Put API calls in `src/lib/api.ts`.
4. Use TanStack Query `useMutation` for writes.
5. Disable submit controls while the mutation is pending.
6. Show success and error toasts.
7. Invalidate affected queries on mutation settle.
8. Keep labels, error text, and button copy user-facing and concise.

## Done Criteria

- Form submits a typed payload.
- User sees loading, success, and failure states.
- Relevant query data refreshes after submission.
