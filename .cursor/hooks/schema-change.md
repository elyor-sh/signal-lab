# Hook: After Prisma Schema Change

Trigger: files matching `prisma/schema.prisma` change.

Problem solved: schema edits often land without migrations or regenerated Prisma client.

Required agent action:
1. Check whether a new folder exists under `prisma/migrations`.
2. Confirm backend scripts still run `prisma generate` and `prisma migrate deploy`.
3. Remind the implementer to run `pnpm --filter @signal-lab/backend prisma:generate`.
4. If the schema affects API responses, check frontend types and README verification notes.
