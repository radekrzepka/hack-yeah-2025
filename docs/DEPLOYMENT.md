# Hackathon Deployment Guide - Railway

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway account (sign up with GitHub at [railway.app](https://railway.app))

## Quick Start

### 1. Deploy API to Railway

1. **Sign up**: Go to [railway.app](https://railway.app) and sign in with GitHub
2. **Deploy**: Click "New Project" → "Deploy from GitHub repo" → Select your repository
3. **Wait**: Railway automatically builds and deploys your API (~2 minutes)
4. **Done**: Your API is live at `https://your-api.up.railway.app`

### 2. Add Database

1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Copy the connection string from the database service
3. Add it to your API's environment variables

### 3. Configure Environment Variables

In Railway dashboard → Your API Service → Variables:

```env
DATABASE_URL=postgresql://postgres:password@host:port/railway
JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=4000
```

### 4. Deploy Frontend to Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
   ```
3. Deploy!

## Project Configuration Files

The following files are included to optimize Railway deployment:

### `railway.json` - Railway Configuration

Tells Railway how to build and deploy your Turborepo API.

## Database Options

### Option 1: Railway PostgreSQL (Recommended)

- **Cost**: ~$1-2/month (within free tier)
- **Setup**: One click in Railway dashboard
- **Integrated**: Automatic connection string

## Cost Breakdown

### Railway Free Tier

- **$5 credit monthly** (resets each month)
- **512MB RAM, 1 vCPU**
- **1GB disk, 100GB bandwidth**

### Typical Hackathon Usage

- **API**: $2-3/month
- **Database**: $1-2/month
- **Total**: $3-5/month (within free tier!)

## Monitoring & Debugging

### View Logs

1. Railway Dashboard → Your Service → "Logs" tab
2. Real-time logs with filtering and search
3. Download logs for analysis

### Health Checks

- Railway automatically monitors `/health` endpoint
- View uptime and response times in dashboard

### Metrics

- CPU, memory, and network usage
- Request counts and response times
- Error rates and status codes

## Auto-Deployment

### GitHub Integration

- **Push to main** → Automatic deployment
- **Pull requests** → Optional preview deployments
- **Rollbacks** → One-click rollback to previous versions

### Build Process

1. Railway detects push to main branch
2. Runs `pnpm install && pnpm build --filter=@hackathon/api`
3. Starts API with `cd apps/api && node dist/main.js`
4. Health check on `/health` endpoint
5. Routes traffic to new deployment
