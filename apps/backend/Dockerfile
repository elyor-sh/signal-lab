FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json

RUN pnpm install --filter @signal-lab/backend... --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["pnpm", "--filter", "@signal-lab/backend", "dev"]
