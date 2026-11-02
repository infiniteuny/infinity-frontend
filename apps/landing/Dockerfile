FROM node:26.13.0-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json* ./
COPY apps/dashboard/package.json ./apps/dashboard/package.json
COPY apps/landing/package.json ./apps/landing/package.json
COPY packages/domain/package.json ./packages/domain/package.json
COPY packages/application/package.json ./packages/application/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/infrastructure/package.json ./packages/infrastructure/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund;

FROM node:26.13.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Accept NEXT_PUBLIC_ env vars as build args so they are baked in at build time
ARG NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_INFINITY_API_URL \
    NEXT_PUBLIC_INFINITY_API_TIMEOUT

# Set build stage environment variables
ENV NODE_ENV=production \
    CI=1 \
    # Disable telemetry during the build.
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_INFINITY_API_URL=${NEXT_PUBLIC_INFINITY_API_URL} \
    NEXT_PUBLIC_INFINITY_API_TIMEOUT=${NEXT_PUBLIC_INFINITY_API_TIMEOUT}

# Build Next.js application
RUN --mount=type=cache,target=/app/apps/landing/.next/cache \
    npx nx build landing

FROM oven/bun:1.4.3 AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="[::]" \
    # Disable telemetry during the run time.
    NEXT_TELEMETRY_DISABLED=1

# Copy production assets
COPY --from=builder --chown=bun:bun /app/apps/landing/public ./apps/landing/public

# Set the correct permission for prerender cache
RUN mkdir -p apps/landing/.next && \
    chown -R bun:bun apps/landing/.next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bun:bun /app/apps/landing/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/apps/landing/.next/static ./apps/landing/.next/static

# Switch to non-root user for security best practices
USER bun

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Start Next.js standalone server with Bun
CMD ["bun", "apps/landing/server.js"]
