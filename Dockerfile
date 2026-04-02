# Multi-stage build for Next.js application (standalone)

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
# postinstall runs `prisma generate` — schema must exist before npm ci
COPY prisma ./prisma/
RUN npm ci


FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure public exists even if repo doesn't have it
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_OUTPUT=standalone
# Auth.js + Prisma: allow CI/Docker build-args to override defaults
ARG AUTH_SECRET=build-time-placeholder-change-in-deployment-min-32-chars
ARG DATABASE_URL=file:./prisma/dev.db
ENV AUTH_SECRET=$AUTH_SECRET
ENV DATABASE_URL=$DATABASE_URL

# Build (standalone output relies on NEXT_OUTPUT environment variable)
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]