# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# DOCKER_BUILD=true triggers output:'standalone' in next.config.ts
ARG DOCKER_BUILD=true
ENV DOCKER_BUILD=$DOCKER_BUILD

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# skip the Vercel-only wake-api script; the API is already up in docker-compose
RUN pnpm build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# standalone output bundles its own node_modules copy — no pnpm needed here
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public

EXPOSE 3000
CMD ["node", "server.js"]
