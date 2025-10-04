# Railway deployment Dockerfile
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@8.15.6

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all workspace package.json files
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the API
RUN pnpm build --filter=@hackathon/api

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "apps/api/dist/main.js"]
