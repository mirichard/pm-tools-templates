# AI-Powered Project Insights - Production Dockerfile
# Node 24 (Active LTS as of 2026-09-21, maintenance starts 2026-10-20, end
# 2028-04-30 — verified against nodejs/Release's schedule.json) to match the
# rest of the repo's CI runtime; node:18 (used previously) is end-of-life.
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S aiinsights && \
    adduser -S aiinsights -u 1001

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl \
    dumb-init

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p data/models data/logs data/cache && \
    chown -R aiinsights:aiinsights /app

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    LOG_LEVEL=info \
    TENSORFLOW_BACKEND=cpu

# Switch to non-root user
USER aiinsights

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Expose port
EXPOSE 3001

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]

# Build information
LABEL version="1.0.0" \
      description="AI-Powered Project Insights API" \
      maintainer="PM Tools Templates" \
      org.opencontainers.image.source="https://github.com/pm-tools-templates"

