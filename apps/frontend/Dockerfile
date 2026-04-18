FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --filter @signal-lab/frontend... --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "--filter", "@signal-lab/frontend", "dev"]
