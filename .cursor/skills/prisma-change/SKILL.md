---
name: prisma-change
description: Make Prisma schema and migration changes safely for Signal Lab.
---

# Prisma Change Skill

## When to Use

Use when changing `prisma/schema.prisma`, adding a model, or changing persisted fields.

## Instructions

1. Edit `prisma/schema.prisma` first.
2. Add a migration under `prisma/migrations`.
3. Confirm `DATABASE_URL` is documented in `.env.example`.
4. Update backend code to use `PrismaService`.
5. Update frontend types if API responses change.
6. Avoid raw SQL in app logic.
7. Keep migrations deterministic and reviewable.

## Done Criteria

- Migration exists.
- Prisma client can be generated.
- Backend compile does not rely on stale generated types.
