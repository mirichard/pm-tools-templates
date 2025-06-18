# AI-Powered Project Insights - Production Dockerfile
FROM node:18-alpine

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

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Switch to non-root user
USER aiinsights

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

