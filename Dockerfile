# =============================================================================
# Qorway OS - Multi-stage Docker Build
# =============================================================================
# Image tag convention: qorway-os-gateway:<commit-hash>
# =============================================================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# --- Stage 2: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Stage 3: Production ---
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 qorway && \
    adduser --system --uid 1001 qorway

COPY --from=builder --chown=qorway:qorway /app/dist ./dist
COPY --from=builder --chown=qorway:qorway /app/node_modules ./node_modules
COPY --from=builder --chown=qorway:qorway /app/package.json ./package.json
COPY --from=builder --chown=qorway:qorway /app/prisma ./prisma

USER qorway

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/main"]
