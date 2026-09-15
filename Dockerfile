FROM node:24.17.0-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json* ./

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund;

FROM node:24.17.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Accept NEXT_PUBLIC_ env vars as build args so they are baked in at build time
ARG NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_BETTER_AUTH_URL \
    NEXT_PUBLIC_INFINITY_API_URL \
    NEXT_PUBLIC_INFINITY_API_TIMEOUT

# Set build stage environment variables
ENV NODE_ENV=production \
    CI=1 \
    # Disable telemetry during the build.
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_BETTER_AUTH_URL=${NEXT_PUBLIC_BETTER_AUTH_URL} \
    NEXT_PUBLIC_INFINITY_API_URL=${NEXT_PUBLIC_INFINITY_API_URL} \
    NEXT_PUBLIC_INFINITY_API_TIMEOUT=${NEXT_PUBLIC_INFINITY_API_TIMEOUT}

# Build Next.js application
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

FROM oven/bun:1.4.2 AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="[::]" \
    # Disable telemetry during the run time.
    NEXT_TELEMETRY_DISABLED=1

# Copy production assets
COPY --from=builder --chown=bun:bun /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && \
    chown bun:bun .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

# Switch to non-root user for security best practices
USER bun

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Start Next.js standalone server with Bun
CMD ["bun", "server.js"]
