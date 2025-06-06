# MCPLookup Bridge - Production Docker Image
# Multi-stage build for optimal size and security

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S mcpbridge && \
    adduser -S mcpbridge -u 1001 -G mcpbridge

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy any additional files needed at runtime
COPY README.md ./
COPY LICENSE ./

# Change ownership to non-root user
RUN chown -R mcpbridge:mcpbridge /app

# Switch to non-root user
USER mcpbridge

# Expose port (if needed for HTTP mode)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Bridge is healthy')" || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV MCPLOOKUP_BASE_URL=https://mcplookup.org/api/v1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command - run the bridge
CMD ["node", "dist/cli.js"]

# Labels for metadata
LABEL org.opencontainers.image.title="MCPLookup Bridge"
LABEL org.opencontainers.image.description="Universal MCP bridge for dynamic server discovery"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="MCPLookup.org"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/MCPLookup-org/mcp-bridge"
LABEL org.opencontainers.image.documentation="https://github.com/MCPLookup-org/mcp-bridge#readme"
