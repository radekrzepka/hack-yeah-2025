# Railway Deployment Guide

## Quick Fix for PDF Generation Issue

### Problem

```
Error: Failed to launch the browser process: spawn /root/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome ENOENT
```

### Solution

The Dockerfile has been updated to install Chromium. **Redeploy your application on Railway.**

## Deployment Steps

### 1. Push Changes to Git

```bash
git add Dockerfile apps/api/src/modules/simulation/services/pdf-generator.service.ts
git commit -m "fix: Add Chromium to Docker for PDF generation"
git push origin main
```

### 2. Railway Will Auto-Deploy

Railway will automatically detect the changes and rebuild the Docker image with Chromium installed.

### 3. Configure Environment Variables

In Railway dashboard, ensure these variables are set:

**Required:**

```env
DATABASE_URL=your_postgres_url
FRONTEND_URL=https://your-frontend-domain.railway.app
```

**Optional (already set in Dockerfile):**

```env
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

### 4. Verify Deployment

Check Railway logs for:

```
[Nest] ... LOG [PdfGeneratorService] Launching new browser instance...
[Nest] ... LOG [PdfGeneratorService] PDF generated successfully
```

## Resource Requirements

### Railway Service Settings

**Recommended:**

- **Memory**: 1GB+ (minimum 512MB)
- **CPU**: 1 vCPU (default is fine)

**Why:** Chromium requires ~100-200MB per PDF generation.

### To Increase Memory in Railway:

1. Go to your service settings
2. Navigate to "Resources" or "Settings"
3. Increase memory allocation to at least 1GB

## Testing After Deployment

### 1. Check API Health

```bash
curl https://your-api-domain.railway.app/health
```

### 2. Test PDF Generation

```bash
curl -O https://your-api-domain.railway.app/v1/simulation/{valid-token-id}/report
```

Should download a PDF file.

### 3. Test from Frontend

1. Visit your dashboard: `https://your-frontend.railway.app/dashboard/{token-id}`
2. Click "Pobierz Raport"
3. PDF should download automatically

## Troubleshooting

### Build Fails

**Check Railway build logs for errors:**

- Chromium installation issues
- Package installation failures

**Solution:** Ensure the Dockerfile syntax is correct (it should be).

### PDF Generation Still Fails

**Check logs for specific error:**

```bash
railway logs --tail 100
```

**Common issues:**

1. **"Cannot connect to frontend"**
   - Solution: Check `FRONTEND_URL` is set correctly
   - Solution: Ensure frontend is accessible from API container

2. **"Timeout waiting for page"**
   - Solution: Increase timeout in `pdf-generator.service.ts` (line 32)
   - Solution: Check frontend loads without errors

3. **"Out of memory"**
   - Solution: Increase Railway service memory
   - Solution: Add rate limiting to PDF endpoint

### PDF is Blank

**Possible causes:**

- Frontend not loading properly
- Charts not rendering
- Timeout too short

**Solutions:**

1. Test frontend URL manually from Railway container
2. Increase wait times in `pdf-generator.service.ts`
3. Check browser console logs in error handler

## Environment-Specific Configuration

### Development (Local)

```env
FRONTEND_URL=http://localhost:3000
# No PUPPETEER_EXECUTABLE_PATH needed
# Puppeteer will automatically download and use its bundled Chrome
```

**How it works locally:**

- First run: Puppeteer downloads Chrome (~300MB) to `~/.cache/puppeteer/`
- Subsequent runs: Uses cached Chrome
- No additional configuration needed

### Production (Railway)

```env
FRONTEND_URL=https://your-frontend.railway.app
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

**How it works in Docker:**

- `PUPPETEER_EXECUTABLE_PATH` is set in Dockerfile
- Uses Alpine's Chromium package
- Adds container-specific browser flags automatically

## Cost Optimization

### Reduce Memory Usage

1. **Close browser after each PDF** (already implemented)
2. **Add caching** for frequently accessed reports
3. **Queue PDF generation** for large batches

### Example: Add Rate Limiting

In `simulation.controller.ts`:

```typescript
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 PDFs per minute
@Get(':tokenId/report')
async generateReport(...)
```

## Monitoring

### Key Metrics to Watch

1. **Memory Usage**: Should stay under 80% of allocated memory
2. **PDF Generation Time**: Should be 2-10 seconds
3. **Error Rate**: Monitor failed PDF generations

### Railway Metrics

Available in Railway dashboard:

- Memory usage graph
- CPU usage
- Request logs
- Error logs

## Rollback Plan

If PDF generation causes issues:

1. **Quick fix**: Disable PDF endpoint temporarily
2. **Revert**: Roll back to previous deployment in Railway
3. **Alternative**: Use external PDF service (e.g., Browserless, Gotenberg)

## Support

If issues persist:

1. Check Railway status: https://railway.app/status
2. Check Puppeteer docs: https://pptr.dev/troubleshooting
3. Review logs in Railway dashboard
