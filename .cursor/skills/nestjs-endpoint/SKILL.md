---
name: nestjs-endpoint
description: Add a NestJS endpoint following Signal Lab validation, Swagger, Prisma, logging, and error handling conventions.
---

# NestJS Endpoint Skill

## When to Use

Use when creating or modifying a backend route in `apps/backend/src`.

## Instructions

1. Place route handlers in a controller and business logic in a service.
2. Use DTOs with class-validator for request bodies.
3. Add Swagger decorators for route grouping and responses.
4. Use `PrismaService` for persistence.
5. Throw Nest exceptions for expected HTTP failures.
6. Let unexpected failures flow through the global exception filter.
7. Add structured logs for domain changes.
8. Add metrics when the route changes user-visible domain state.

## Done Criteria

- Endpoint compiles under TypeScript strict mode.
- Swagger route is visible at `/api/docs`.
- Request validation rejects invalid input.
- Errors return structured JSON with the correct HTTP status.
