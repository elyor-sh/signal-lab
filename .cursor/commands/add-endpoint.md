# /add-endpoint

Use when adding a new NestJS endpoint to Signal Lab.

Steps:
1. Read `.cursor/rules/stack-constraints.mdc`, `.cursor/rules/error-handling.mdc`, and `.cursor/rules/observability-conventions.mdc`.
2. Identify the module, controller, DTO, service method, and Swagger response shape.
3. Add validation with class-validator DTOs.
4. Add structured logs with relevant identifiers.
5. Add Prometheus metric updates if the endpoint changes domain state.
6. Add Sentry capture only for unexpected errors.
7. Update frontend API client if the endpoint is user-facing.
8. Add or update README/API documentation if verification steps change.
