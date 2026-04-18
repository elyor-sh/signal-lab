# Hook: Before Commit Secret Scan

Trigger: before commit or before final answer after implementation.

Problem solved: local DSNs, passwords, and tokens can accidentally be committed.

Required agent action:
1. Search staged and changed files for `SENTRY_DSN=`, `postgresql://`, `secret`, `token`, `password`, and `api_key`.
2. Allow placeholders in `.env.example` and Docker default development passwords.
3. Block or warn on real-looking private credentials.
4. Replace secrets with env variables before proceeding.
