# Docker Deployment Guide for PDF Generation

## Issue: Puppeteer in Docker

The PDF generation feature uses Puppeteer, which requires Chrome/Chromium to be installed in the Docker container.

## Solution

### 1. Dockerfile Updates

The Dockerfile has been updated to include Chromium and its dependencies:

```dockerfile
# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji

# Tell Puppeteer to use the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

### 2. Service Configuration

The `PdfGeneratorService` has been updated to use the system Chromium:

```typescript
executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ||
  "/usr/bin/chromium-browser";
```

### 3. Railway Environment Variables

Add this to your Railway environment variables (if not set by Dockerfile):

```env
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
FRONTEND_URL=https://your-frontend-url.railway.app
```

## Browser Launch Arguments

The following flags are used for containerized environments:

- `--no-sandbox` - Required in Docker
- `--disable-setuid-sandbox` - Additional security bypass for containers
- `--disable-dev-shm-usage` - Prevents memory issues
- `--disable-gpu` - Not needed in headless mode
- `--single-process` - Reduces memory usage in containers
- `--no-zygote` - Better for containerized environments

## Memory Considerations

### Railway/Docker Settings

- **Minimum RAM**: 512MB
- **Recommended RAM**: 1GB+
- **Per PDF Generation**: ~100-200MB

### If You Have Memory Issues

1. **Increase Railway service memory** in the settings
2. **Close browser after each PDF** (already implemented)
3. **Add request rate limiting** to prevent concurrent generations

## Testing Locally with Docker

Build and test locally:

```bash
# Build the Docker image
docker build -t hackathon-api .

# Run with environment variables
docker run -p 5000:5000 \
  -e DATABASE_URL=your_db_url \
  -e FRONTEND_URL=http://localhost:3000 \
  hackathon-api
```

## Troubleshooting

### Error: "spawn /usr/bin/chromium-browser ENOENT"

**Solution**: Chromium wasn't installed. Rebuild the Docker image:

```bash
railway up --force
```

### Error: "Failed to launch browser"

**Solution**: Check browser arguments are correct for your environment.

### Error: PDF is blank or incomplete

**Solutions**:

1. Increase `timeout` values in `pdf-generator.service.ts`
2. Check `FRONTEND_URL` is accessible from the container
3. Verify the frontend loads without errors

### Memory errors

**Solutions**:

1. Increase Railway service memory
2. Add `--disable-dev-shm-usage` flag (already added)
3. Ensure browser closes after each PDF generation (already implemented)

## Alternative: Using Debian-based Image

If Alpine causes issues, you can switch to Debian:

```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

Note: Debian images are larger (~200MB more) but more compatible.

## Monitoring

Add logging to track PDF generation:

```typescript
// Already implemented in pdf-generator.service.ts
this.logger.log("Generating PDF report for token: ${tokenId}");
this.logger.log("PDF generated successfully");
```

Check Railway logs for browser launch issues.

## Production Checklist

- [x] Chromium installed in Docker image
- [x] `PUPPETEER_EXECUTABLE_PATH` set
- [x] `FRONTEND_URL` configured correctly
- [x] Browser launch arguments optimized for containers
- [x] Browser cleanup on module destroy
- [x] Error handling and logging
- [ ] Rate limiting for PDF generation (optional)
- [ ] Monitoring/alerting for failures (optional)
