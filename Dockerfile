# Multi-stage build for Next.js application (standalone)

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./
RUN npm ci || npm install


FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy everything including next.config.js
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Verify next.config.js exists
RUN test -f next.config.js || (echo "❌ next.config.js missing inside container" && exit 1)

# Build and verify standalone output
RUN npm run build && \
    test -f .next/standalone/server.js || ( \
      echo "❌ Standalone output missing" && \
      echo "Contents of .next:" && \
      ls -la .next && \
      exit 1 \
    )


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
