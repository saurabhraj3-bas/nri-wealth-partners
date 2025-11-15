# 🔧 Site Administration Guide

Technical guide for administering and configuring the NRI Wealth Partners website infrastructure.

---

## 🎯 Overview

This guide covers advanced administrative tasks:
- Environment variables and secrets management
- Google Analytics configuration
- Form submission handling
- Email service integration
- Security and performance
- Monitoring and alerts
- Domain and SSL management
- Backup and recovery

**Audience**: Site administrators with technical knowledge

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Google Analytics Setup](#google-analytics-setup)
3. [Contact Form Configuration](#contact-form-configuration)
4. [Email Service Integration](#email-service-integration)
5. [Security Configuration](#security-configuration)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Domain & SSL Management](#domain--ssl-management)
9. [Database Integration (Future)](#database-integration)
10. [Backup & Recovery](#backup--recovery)
11. [Advanced Deployment](#advanced-deployment)

---

## 🔐 Environment Variables

### Overview

Environment variables store sensitive configuration without exposing them in code.

### Local Development (.env.local)

**Location**: `/Users/jyotikumari/Projects/NRIWealthPartners/.env.local`

**Create from template**:
```bash
cp .env.example .env.local
```

**Edit .env.local**:
```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (Future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@nriwealthpartners.com
EMAIL_TO=support@nriwealthpartners.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Development
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development
```

### Production Environment Variables (Cloud Run)

**View current variables**:
```bash
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)'
```

**Add/Update a variable**:
```bash
gcloud run services update nri-wealth-partners \
  --update-env-vars KEY=VALUE \
  --region=us-central1
```

**Add multiple variables**:
```bash
gcloud run services update nri-wealth-partners \
  --update-env-vars \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX,\
    NEXT_PUBLIC_SITE_URL=https://nriwealthpartners.com \
  --region=us-central1
```

**Remove a variable**:
```bash
gcloud run services update nri-wealth-partners \
  --remove-env-vars KEY_NAME \
  --region=us-central1
```

### Using Google Secret Manager (Recommended for sensitive data)

**Create a secret**:
```bash
echo -n "your-secret-value" | \
  gcloud secrets create SECRET_NAME \
  --data-file=-
```

**Grant Cloud Run access**:
```bash
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:979245985437-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**Mount secret in Cloud Run**:
```bash
gcloud run services update nri-wealth-partners \
  --update-secrets=ENV_VAR_NAME=SECRET_NAME:latest \
  --region=us-central1
```

---

## 📊 Google Analytics Setup

### Step 1: Create Google Analytics Property

1. **Go to**: https://analytics.google.com
2. **Click**: Admin (bottom left)
3. **Create Property**:
   - Property name: `NRI Wealth Partners`
   - Time zone: `(GMT+05:30) India`
   - Currency: `Indian Rupee (₹)`
4. **Create Data Stream**:
   - Platform: Web
   - Website URL: `https://nriwealthpartners.com`
   - Stream name: `NRI Wealth Partners Website`
5. **Copy Measurement ID**: Format `G-XXXXXXXXXX`

### Step 2: Add to Environment Variables

**Local (.env.local)**:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Production (Cloud Run)**:
```bash
gcloud run services update nri-wealth-partners \
  --update-env-vars NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
  --region=us-central1
```

### Step 3: Verify Installation

1. **Deploy changes** (push to GitHub)
2. **Visit website**: https://nriwealthpartners.com
3. **Check in GA**: Realtime → Overview (should see your visit)

### Step 4: Configure Important Reports

**Enhanced Measurement** (auto-tracking):
- ✅ Page views
- ✅ Scrolls
- ✅ Outbound clicks
- ✅ Site search
- ✅ File downloads

**Custom Events** (add to `components/analytics/google-analytics.tsx`):

```tsx
// Track button clicks
onClick={() => {
  window.gtag('event', 'cta_click', {
    event_category: 'engagement',
    event_label: 'Schedule Consultation',
    value: 1
  })
}}

// Track PDF downloads
onClick={() => {
  window.gtag('event', 'file_download', {
    event_category: 'engagement',
    event_label: 'Tax Guide 2024',
    file_name: 'nri-tax-guide-2024.pdf'
  })
}}

// Track webinar registrations
onClick={() => {
  window.gtag('event', 'webinar_registration', {
    event_category: 'conversion',
    event_label: 'March 2024 Webinar',
    value: 1
  })
}}
```

### Recommended GA4 Reports

**Create Custom Reports**:
1. Most visited pages
2. User demographics (country, city)
3. Traffic sources
4. Conversion funnels
5. Form submissions
6. PDF downloads
7. Webinar clicks

---

## 📧 Contact Form Configuration

### Current Setup

The contact form is in: `components/forms/contact-form.tsx`

**Current status**: Form validates but doesn't send emails yet

### Option 1: Resend Email Service (Recommended)

**Why Resend?**
- ✅ Simple API
- ✅ 100 free emails/day
- ✅ High deliverability
- ✅ Email templates

**Setup Steps**:

1. **Sign up**: https://resend.com
2. **Get API key**: Dashboard → API Keys
3. **Add domain**: Settings → Domains → Add Domain
4. **Verify domain**: Add DNS records (TXT, MX, CNAME)

**Install Resend**:
```bash
npm install resend
```

**Create API route**: `app/api/contact/route.ts`

```typescript
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'NRI Wealth Partners <noreply@nriwealthpartners.com>',
      to: ['support@nriwealthpartners.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
```

**Update form component**: `components/forms/contact-form.tsx`

Add this to the `onSubmit` function:

```typescript
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true)

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      router.push('/thank-you')
    } else {
      throw new Error('Failed to submit')
    }
  } catch (error) {
    alert('Failed to submit form. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}
```

**Add environment variable**:
```bash
# Local
echo "RESEND_API_KEY=re_xxxxxxxxxxxx" >> .env.local

# Production
gcloud run services update nri-wealth-partners \
  --update-env-vars RESEND_API_KEY=re_xxxxxxxxxxxx \
  --region=us-central1
```

### Option 2: Gmail SMTP

**Setup Steps**:

1. **Enable 2FA** on Gmail account
2. **Create App Password**: Google Account → Security → 2-Step Verification → App passwords
3. **Add to environment**:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_TO=support@nriwealthpartners.com
```

**Install nodemailer**:
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

**Create API route**: `app/api/contact/route.ts`

```typescript
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
```

### Testing Email Integration

**Test locally**:
```bash
npm run dev
# Visit: http://localhost:3000/contact
# Submit test form
```

**Test with curl**:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "message": "This is a test message"
  }'
```

---

## 🔒 Security Configuration

### Current Security Headers

**Already configured** in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ]
}
```

### Test Security Score

**SecurityHeaders.com**:
```bash
https://securityheaders.com/?q=nriwealthpartners.com
```

**Mozilla Observatory**:
```bash
https://observatory.mozilla.org/analyze/nriwealthpartners.com
```

### Add Content Security Policy (CSP)

**Enhanced security** (add to headers in `next.config.js`):

```javascript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-ancestors 'self'"
  ].join('; ')
}
```

### Rate Limiting (Prevent Abuse)

**Install Upstash Redis** (for Cloud Run):

```bash
npm install @upstash/ratelimit @upstash/redis
```

**Create rate limiter**: `lib/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})
```

**Apply to API route**:

```typescript
import { ratelimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // Continue with form processing...
}
```

---

## ⚡ Performance Optimization

### Current Optimizations

**Already configured**:
- ✅ Image optimization (WebP/AVIF)
- ✅ Compression enabled
- ✅ Static asset caching
- ✅ Standalone build

### Measure Performance

**Lighthouse (Chrome DevTools)**:
```
1. Open Chrome
2. Navigate to: https://nriwealthpartners.com
3. Press F12 → Lighthouse tab
4. Click "Generate report"
```

**PageSpeed Insights**:
```
https://pagespeed.web.dev/analysis?url=https://nriwealthpartners.com
```

**Target scores**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Additional Optimizations

**1. Add next/font for font optimization**:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {children}
    </html>
  )
}
```

**2. Lazy load images**:

```tsx
import Image from 'next/image'

<Image
  src="/images/service.jpg"
  alt="Service"
  width={800}
  height={600}
  loading="lazy"  // Lazy load below fold
  placeholder="blur"  // Show blur while loading
/>
```

**3. Preload critical resources**:

```tsx
// app/layout.tsx
export default function RootLayout() {
  return (
    <html>
      <head>
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />
        <link
          rel="dns-prefetch"
          href="https://www.google-analytics.com"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 📡 Monitoring & Alerts

### Google Cloud Monitoring

**Already set up** via Cloud Build. Access at:
```
https://console.cloud.google.com/monitoring?project=nri-wealth-partners
```

### Create Custom Alerts

**High error rate alert**:
```bash
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

**High latency alert**:
```bash
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Latency" \
  --condition-display-name="Latency > 2s" \
  --condition-threshold-value=2000 \
  --condition-threshold-duration=300s
```

### Set Up Email Notifications

```bash
# Create notification channel
gcloud alpha monitoring channels create \
  --display-name="Admin Email" \
  --type=email \
  --channel-labels=email_address=admin@nriwealthpartners.com
```

### Uptime Monitoring (UptimeRobot - Free)

**Setup**:
1. Go to: https://uptimerobot.com
2. Sign up (free account)
3. Add monitor:
   - Type: HTTPS
   - URL: `https://nriwealthpartners.com`
   - Interval: 5 minutes
4. Add alert contacts (email, SMS)

**What it monitors**:
- ✅ Website availability
- ✅ Response time
- ✅ SSL certificate expiry
- ✅ Status page

---

## 🌐 Domain & SSL Management

### Current Setup

- **Domain**: nriwealthpartners.com
- **SSL**: Managed by Google Cloud Run (auto-renews)
- **DNS**: Managed by domain registrar

### Verify Domain Mapping

```bash
gcloud run domain-mappings list \
  --region=us-central1
```

### Update Domain Mapping

**If domain changes or needs remapping**:

```bash
gcloud run domain-mappings create \
  --service=nri-wealth-partners \
  --domain=nriwealthpartners.com \
  --region=us-central1
```

### Check SSL Certificate Status

```bash
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(status.url,status.conditions)'
```

**Verify SSL**:
```bash
openssl s_client -connect nriwealthpartners.com:443 -servername nriwealthpartners.com
```

### Add www Subdomain

**Option 1: Redirect www to non-www** (recommended)

Add CNAME record in DNS:
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

Then map in Cloud Run:
```bash
gcloud run domain-mappings create \
  --service=nri-wealth-partners \
  --domain=www.nriwealthpartners.com \
  --region=us-central1
```

**Option 2: Make www primary**

Update all marketing materials and SEO to use www version.

---

## 💾 Database Integration

### Current Status

**Database**: None (static content)

### Future: Add Database for Dynamic Content

**Recommended options**:

#### Option 1: Supabase (Easiest)

**Why Supabase?**
- ✅ PostgreSQL database
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Free tier available
- ✅ Hosted (no management)

**Setup**:
```bash
npm install @supabase/supabase-js

# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Use cases**:
- Store contact form submissions
- Blog posts and articles
- User accounts (future)
- Testimonials management

#### Option 2: Cloud SQL (Google Cloud)

**For enterprise needs**:
```bash
gcloud sql instances create nri-wealth-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1
```

#### Option 3: Prisma + PlanetScale

**Modern stack**:
```bash
npm install prisma @prisma/client
npx prisma init
```

### Sample Schema (Testimonials)

```prisma
model Testimonial {
  id        String   @id @default(cuid())
  name      String
  location  String
  text      String
  rating    Int
  approved  Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 💾 Backup & Recovery

### What's Already Backed Up

✅ **Source code**: GitHub repository
✅ **Container images**: Google Container Registry
✅ **Deployment config**: Cloud Run service definition

### Create Configuration Backup

**Script**: `scripts/backup-production.sh`

```bash
#!/bin/bash

BACKUP_DIR=~/backups/nri-wealth-$(date +%Y%m%d)
mkdir -p ${BACKUP_DIR}

# Backup Cloud Run configuration
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format=yaml > ${BACKUP_DIR}/cloudrun-config.yaml

# Backup environment variables
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)' > \
  ${BACKUP_DIR}/env-vars.txt

# Backup domain mappings
gcloud run domain-mappings list \
  --region=us-central1 \
  --format=yaml > ${BACKUP_DIR}/domains.yaml

echo "Backup saved to ${BACKUP_DIR}"
```

**Make executable and run**:
```bash
chmod +x scripts/backup-production.sh
./scripts/backup-production.sh
```

### Restore from Backup

**Restore service configuration**:
```bash
gcloud run services replace backups/YYYYMMDD/cloudrun-config.yaml \
  --region=us-central1
```

**Restore environment variables**:
```bash
# Extract from backup and reapply
gcloud run services update nri-wealth-partners \
  --update-env-vars KEY1=VALUE1,KEY2=VALUE2 \
  --region=us-central1
```

### Automated Monthly Backups

**Add to GitHub Actions**: `.github/workflows/backup.yml`

```yaml
name: Monthly Backup

on:
  schedule:
    - cron: '0 2 1 * *'  # 2 AM on 1st of each month
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Backup configuration
        run: |
          mkdir -p backups/$(date +%Y-%m-%d)
          gcloud run services describe nri-wealth-partners \
            --region=us-central1 \
            --format=yaml > backups/$(date +%Y-%m-%d)/config.yaml

      - name: Commit backups
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add backups/
          git commit -m "Automated backup - $(date +%Y-%m-%d)" || echo "No changes"
          git push || echo "No changes to push"
```

---

## 🚀 Advanced Deployment

### Deploy Specific Version

**Deploy by commit SHA**:
```bash
gcloud run deploy nri-wealth-partners \
  --image=gcr.io/nri-wealth-partners/nri-wealth-partners:COMMIT_SHA \
  --region=us-central1
```

### Blue-Green Deployment

**Deploy new version with traffic split**:

```bash
# Deploy new revision without traffic
gcloud run deploy nri-wealth-partners \
  --image=gcr.io/nri-wealth-partners/nri-wealth-partners:latest \
  --no-traffic \
  --region=us-central1

# Test the new revision URL (provided in output)
# If good, gradually shift traffic:

# 10% to new version
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions=NEW_REVISION=10,OLD_REVISION=90 \
  --region=us-central1

# Monitor metrics, then increase:
# 50% to new version
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions=NEW_REVISION=50,OLD_REVISION=50 \
  --region=us-central1

# If all good, 100% to new:
gcloud run services update-traffic nri-wealth-partners \
  --to-latest \
  --region=us-central1
```

### Rollback to Previous Version

```bash
# List revisions
gcloud run revisions list \
  --service=nri-wealth-partners \
  --region=us-central1

# Rollback to specific revision
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region=us-central1
```

### Custom Domain Email Forwarding

**Using CloudFlare** (free):

1. Add domain to CloudFlare
2. Go to Email → Email Routing
3. Add forwarding rules:
   ```
   support@nriwealthpartners.com → your-gmail@gmail.com
   info@nriwealthpartners.com → your-gmail@gmail.com
   ```

**Using Google Workspace** (paid):
- Full email hosting
- Professional email addresses
- Calendar, Drive integration

---

## 🧪 Testing & QA

### Pre-Deployment Checklist

```bash
# Local testing
npm run build          # Verify build succeeds
npm run lint           # Check for code issues
npm start              # Test production build locally

# Manual testing
- Test all forms
- Check all links
- Verify images load
- Test on mobile
- Check different browsers

# Performance
- Run Lighthouse
- Check PageSpeed Insights
- Verify analytics tracking
```

### Automated Testing (Future)

**Add Jest for unit tests**:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Add Playwright for E2E tests**:
```bash
npm install -D @playwright/test
```

**Example test**: `tests/contact-form.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('https://nriwealthpartners.com/contact')

  await page.fill('[name="name"]', 'Test User')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="phone"]', '+91 9876543210')
  await page.fill('[name="message"]', 'Test message')

  await page.click('button[type="submit"]')

  await expect(page).toHaveURL(/thank-you/)
})
```

---

## 📊 Analytics & Reports

### Google Analytics 4 Custom Reports

**Create these reports**:

1. **Monthly Traffic Report**
   - Total users
   - New vs returning
   - Top pages
   - Traffic sources

2. **Conversion Tracking**
   - Form submissions
   - PDF downloads
   - Webinar clicks
   - Phone number clicks

3. **User Behavior**
   - Average session duration
   - Bounce rate
   - Pages per session
   - Exit pages

### Export Data for Analysis

**Using Google Analytics Data API**:
```bash
npm install @google-analytics/data
```

**Sample report script**: `scripts/analytics-report.js`

```javascript
const { BetaAnalyticsDataClient } = require('@google-analytics/data')

const analyticsDataClient = new BetaAnalyticsDataClient()

async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
  })

  console.log('Report result:')
  response.rows.forEach((row) => {
    console.log(row.dimensionValues[0], row.metricValues[0])
  })
}

runReport()
```

---

## 🎯 Best Practices

### Security
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS only
- ✅ Regular security audits
- ✅ Keep dependencies updated
- ✅ Use Secret Manager for sensitive data

### Performance
- ✅ Monitor Core Web Vitals
- ✅ Optimize images
- ✅ Use CDN for static assets
- ✅ Enable compression
- ✅ Lazy load below-fold content

### Monitoring
- ✅ Set up uptime monitoring
- ✅ Configure error alerts
- ✅ Monitor performance metrics
- ✅ Track user analytics
- ✅ Regular backup verification

### Deployment
- ✅ Test locally before pushing
- ✅ Use staging environment (future)
- ✅ Monitor deployment logs
- ✅ Have rollback plan ready
- ✅ Document all changes

---

## 📞 Support & Resources

### Documentation
- **Next.js**: https://nextjs.org/docs
- **Google Cloud Run**: https://cloud.google.com/run/docs
- **Google Analytics**: https://support.google.com/analytics

### Useful Commands

```bash
# View Cloud Run logs
gcloud run services logs read nri-wealth-partners \
  --region=us-central1 \
  --limit=50

# Check Cloud Run metrics
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(status.traffic,status.conditions)'

# List all environment variables
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)'

# Check current deployment
gcloud run revisions list \
  --service=nri-wealth-partners \
  --region=us-central1 \
  --limit=5
```

---

## 🎉 Summary

This guide covered:
- ✅ Environment variables management
- ✅ Google Analytics setup
- ✅ Email integration options
- ✅ Security configuration
- ✅ Performance optimization
- ✅ Monitoring and alerts
- ✅ Domain and SSL management
- ✅ Backup and recovery
- ✅ Advanced deployment strategies

**Keep this guide updated** as you add new features and integrations!

---

**Last Updated**: November 2024
**Version**: 1.0
**Maintained by**: Site Administrator
