# Hook: After Backend Endpoint Change

Trigger: files under `apps/backend/src/**/*.controller.ts` or `apps/backend/src/**/*.service.ts` change.

Problem solved: new endpoints can bypass validation, Swagger, metrics, and logs.

Required agent action:
1. Confirm the endpoint has DTO validation when it accepts input.
2. Confirm Swagger decorators exist for the route.
3. Confirm errors flow through Nest exceptions or the global filter.
4. Confirm domain state changes emit metrics and structured logs.
5. Confirm frontend API client and README are updated if the endpoint is user-facing.
