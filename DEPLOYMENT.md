# Production Deployment Guide

This guide covers deploying your MarketHub marketplace to production on Netlify or Vercel.

## Prerequisites

1. GitHub account and repository
2. Stripe account (for payments)
3. Email service (Gmail, SendGrid, etc. for notifications)
4. Netlify or Vercel account

## Pre-Deployment Setup

### 1. Environment Configuration

Create a `.env.production` file with production values:

```bash
# Database
DATABASE_URL=marketplace.db

# JWT & Security
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_<your_stripe_key>
STRIPE_PUBLISHABLE_KEY=pk_live_<your_stripe_key>
STRIPE_WEBHOOK_SECRET=whsec_<your_webhook_secret>

# Email Service
SMTP_HOST=<your-smtp-host>
SMTP_PORT=587
SMTP_USER=<your-email@gmail.com>
SMTP_PASSWORD=<your-app-password>
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=MarketHub

# Application
SITE_NAME=MarketHub
SITE_URL=https://yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
NODE_ENV=production
PORT=8080

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 2. Update Stripe Webhook

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in your environment

### 3. Build the Application

```bash
npm run build
```

This creates:

- `dist/spa/` - Frontend (React)
- `dist/server/` - Backend (Express)

## Deployment on Netlify

### Using Netlify with Functions

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Create `netlify.toml`** (already included):

   ```toml
   [build]
   command = "npm run build"
   functions = "netlify/functions"
   publish = "dist/spa"

   [[redirects]]
   from = "/api/*"
   to = "/.netlify/functions/api/:splat"
   status = 200

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

3. **Create `netlify/functions/api.ts`** (already included):

   - This wraps your Express server for Netlify Functions

4. **Deploy:**

   ```bash
   netlify deploy --prod
   ```

5. **Set Environment Variables:**

   - Go to Netlify Dashboard > Site > Settings > Build & Deploy > Environment
   - Add all variables from `.env.production`

6. **Configure Database:**

   - Since Netlify Functions are stateless, you'll need to use a persistent database
   - Options:
     - SQLite with persistent storage (PlanetScale, Railway, etc.)
     - PostgreSQL (Neon, Supabase, Railway)
     - MongoDB Atlas

   **Option A: Using Neon PostgreSQL** (Recommended)

   - Create account at https://neon.tech
   - Create database and get connection string
   - Update code to use PostgreSQL instead of SQLite
   - Add to environment variables

   **Option B: Using Railway (Simpler)**

   - Create account at https://railway.app
   - Connect your GitHub repo
   - Set environment variables in Railway dashboard
   - Railway auto-deploys on push

## Deployment on Vercel

### Using Vercel

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`** (if not exists):

   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist/spa",
     "framework": "react",
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "/api/:path*"
       },
       {
         "source": "/:path*",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Deploy:**

   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**

   - In Vercel Dashboard > Settings > Environment Variables
   - Add all variables from `.env.production`

5. **Configure API Routes:**
   - Create `api/index.ts` for Vercel Serverless Functions
   - Or use a separate backend deployment (Railway, Render, etc.)

## Database Migration

For production, migrate from SQLite to a managed database:

### Option 1: Neon (PostgreSQL)

1. Create account at neon.tech
2. Create database
3. Update `server/database/db.ts` to use PostgreSQL
4. Update schema.sql for PostgreSQL syntax
5. Add connection string to environment variables

### Option 2: Railway (All-in-one)

1. Create account at railway.app
2. Connect GitHub repository
3. Railway automatically detects and deploys
4. Add PostgreSQL or MySQL service from Railway plugins
5. Set environment variables

### Option 3: PlanetScale (MySQL)

1. Create account at planetscale.com
2. Create database
3. Update code for MySQL
4. Add connection string to environment

## Production Checklist

- [ ] JWT_SECRET is a strong, random string (min 32 characters)
- [ ] Stripe keys are production keys (sk_live, pk_live)
- [ ] Email service is configured and tested
- [ ] Database is backed up regularly
- [ ] CORS is configured for production domain
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Security headers (helmet) are active
- [ ] File upload directory has size limits
- [ ] Database indexes are created for performance
- [ ] Monitoring/logging is set up
- [ ] Backups are automated

## Monitoring & Logging

### Sentry (Error Tracking)

1. Create account at sentry.io
2. Create project for your app
3. Install Sentry SDK:
   ```bash
   npm install @sentry/node @sentry/tracing
   ```
4. Add to server/index.ts:

   ```typescript
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

### Log Aggregation

- Netlify Functions: Built-in logs in dashboard
- Vercel: Built-in logs in dashboard
- Railway: Built-in logs in dashboard
- Or use external: LogRocket, Datadog, New Relic

## Post-Deployment

1. Test all critical flows:

   - User registration
   - Product browsing
   - Cart & checkout
   - Payment processing
   - Order confirmation emails

2. Monitor for errors and performance

3. Set up automated backups for database

4. Plan for scaling as traffic grows

## Troubleshooting

### Cold Starts on Serverless

Serverless functions (Netlify, Vercel) may have slow initial responses. To improve:

- Use edge functions if available
- Optimize dependencies
- Use caching headers

### Database Connection Issues

- Verify connection string
- Check database credentials
- Ensure IP whitelist includes deployment provider
- Test connection locally first

### File Upload Issues

- Ensure upload directory is writable
- For serverless, use cloud storage (AWS S3, Cloudinary, etc.)
- Update upload middleware for your provider

## Scaling Considerations

1. **Load Balancing**: As traffic grows, use managed services
2. **Database Optimization**: Add indexes, optimize queries
3. **Caching**: Implement Redis for session/data caching
4. **CDN**: Serve static assets through CDN
5. **Monitoring**: Set up alerts for performance issues

## Support

For issues or questions:

- Check deployment provider docs
- Review error logs in dashboard
- Consult Stripe documentation for payments
- Test environment variables locally first
