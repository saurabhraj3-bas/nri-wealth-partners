# Deployment & Setup Checklist
## NRI Wealth Partners - Technical Setup Guide

---

## ✅ COMPLETED - Code Implementation

### Admin Management System
- [x] Team Management (`/admin/team`)
  - Super admin can invite team members
  - Role-based permissions (5 roles)
  - Email invitations with automated welcome emails
  - Status management (active/suspended)

- [x] Webinar Management (`/admin/webinars`)
  - Create/Edit/Delete webinars
  - Modal-based interface (600px/700px width)
  - Date/time picker with timezone support
  - Tags, speaker details, max attendees
  - Status tracking (draft/published/completed/cancelled)

- [x] Resource Management (`/admin/resources`)
  - Drag-drop PDF upload
  - Firebase Storage integration
  - Metadata editing (title, description, category, tags)
  - Category includes "immigration"
  - File cleanup on delete

### Public Features
- [x] Immigration News Section (`/news`)
  - Category filters (all, immigration, tax, investment, market)
  - Search functionality
  - Last 7 days auto-population support
  - Responsive design

- [x] Error Handling
  - Graceful DatabaseErrorMessage component
  - Enhanced error messages across all pages
  - Retry and contact support options
  - User-friendly language

### Navigation & UI
- [x] Added "News" link to main navigation
- [x] Updated admin dashboard with quick actions
- [x] Fixed webinar registration modal width (desktop display)

---

## ⚠️ PENDING - Deployment & Configuration

### 1. Firebase Configuration (CRITICAL)

**Environment Variables Needed:**

Add to `.env.local` (development) and Vercel/hosting platform (production):

```bash
# Firebase Admin SDK
FIREBASE_ADMIN_KEY='{"type":"service_account","project_id":"your-project-id",...}'

# Or separate fields:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Email Configuration (for invitations & notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@nriwealthpartners.com

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://nriwealthpartners.com
```

**How to Get Firebase Admin Key:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click Settings (gear icon) → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Download JSON file
7. Copy entire JSON content to `FIREBASE_ADMIN_KEY` environment variable

**Firebase Storage Setup:**

1. In Firebase Console → Storage
2. Ensure bucket exists: `{your-project}.appspot.com`
3. Update Storage Rules to allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resources/{category}/{fileName} {
      // Allow public read
      allow read: if true;

      // Allow authenticated admin uploads
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

### 2. News Aggregator Setup

**Option A: Deploy Cloud Function (Recommended for Automation)**

1. Navigate to cloud functions directory:
```bash
cd cloud-functions
npm install
```

2. Deploy to Firebase:
```bash
firebase deploy --only functions:aggregateNewsDaily
```

3. Set up Cloud Scheduler (runs daily at 6 AM UTC):
```bash
firebase functions:config:set schedule.timezone="America/New_York"
```

4. Verify deployment:
```bash
firebase functions:log --only aggregateNewsDaily
```

**Option B: Run Seed Script (Quick Start for Testing)**

Populate initial news data:
```bash
node scripts/seed-news.js
```

This adds 10 sample articles from the last 7 days (3 immigration, 3 tax, 4 investment/market).

**Option C: Manual API Call (Testing)**

Test the news fetch API:
```bash
curl https://nriwealthpartners.com/api/news/fetch-latest?days=7
```

### 3. Email Service Configuration

**Gmail Setup (For Invitations & Notifications):**

1. Enable 2-factor authentication on your Google account
2. Generate App-Specific Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy generated password to `SMTP_PASSWORD` env variable

**Alternative: SendGrid (Recommended for Production)**

```bash
# Add to .env
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@nriwealthpartners.com
```

Update `/app/api/admin/invite/route.ts` to use SendGrid instead of Nodemailer.

### 4. Firestore Database Setup

**Required Collections:**

1. **admins** (for team management)
   - Fields: email, name, role, permissions, status, invitedBy, createdAt, lastLoginAt

2. **webinars** (for webinar management)
   - Fields: title, description, date, time, timezone, duration, speaker, speakerTitle, maxAttendees, registrationCount, tags, status, createdAt, updatedAt, createdBy

3. **resources** (for resource management)
   - Fields: title, description, category, type, fileUrl, fileName, fileSize, downloadCount, status, tags, createdAt, updatedAt, createdBy

4. **news** (for news aggregation)
   - Fields: title, description, category, source, url, publishedAt, imageUrl, tags, status, createdAt

5. **webinar_registrations** (existing)
   - Fields: name, email, phone, country, webinarId, webinarTitle, webinarDate, webinarTime, registeredAt

6. **newsletter_subscribers** (existing)
   - Fields: email, name, preferences, status, confirmedAt, subscribedAt

**Firestore Indexes:**

Create composite indexes:
```bash
# Navigate to Firestore Console → Indexes → Add Index

# Index 1: Resources by category and createdAt
Collection: resources
Fields: category (Ascending), createdAt (Descending)

# Index 2: Webinars by status and date
Collection: webinars
Fields: status (Ascending), date (Descending)

# Index 3: News by publishedAt and status
Collection: news
Fields: publishedAt (Descending), status (Ascending)
```

### 5. Production Deployment

**Vercel Deployment (Recommended):**

1. Push code to GitHub:
```bash
git push origin main
```

2. Connect Vercel to GitHub repo:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import project from GitHub
   - Select `NRIWealthPartners` repo

3. Add environment variables in Vercel:
   - Settings → Environment Variables
   - Add all variables from `.env.local`

4. Deploy:
```bash
vercel --prod
```

**Custom Domain Setup:**

1. In Vercel → Project Settings → Domains
2. Add domain: `nriwealthpartners.com`
3. Update DNS records (Vercel will provide instructions)
4. Wait for SSL certificate provisioning (automatic)

### 6. Security Checklist

**Before Going Live:**

- [ ] Change all default passwords
- [ ] Remove any test/demo data from Firestore
- [ ] Verify Firebase Security Rules are restrictive
- [ ] Enable Firestore backup (Firebase Console → Firestore → Backups)
- [ ] Set up monitoring alerts (Firebase Console → Alerts)
- [ ] Review and update CORS settings
- [ ] Enable rate limiting on API routes (if needed)
- [ ] Verify HTTPS is enforced
- [ ] Test all forms for security vulnerabilities
- [ ] Ensure sensitive data is not logged
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

### 7. Testing Checklist

**Admin Features:**

- [ ] Create super admin account in Firestore
- [ ] Login to `/admin/login`
- [ ] Test team invitation flow
- [ ] Create/edit/delete webinar
- [ ] Upload/edit/delete resource PDF
- [ ] Verify Firebase Storage file upload works
- [ ] Test permission restrictions (non-admin shouldn't access)

**Public Features:**

- [ ] View webinars on `/webinars`
- [ ] Register for webinar
- [ ] Receive confirmation email
- [ ] Download resources from `/resources`
- [ ] View news at `/news`
- [ ] Filter news by category
- [ ] Search news
- [ ] Subscribe to newsletter at `/insights/subscribe`
- [ ] Receive welcome email

**Error Handling:**

- [ ] Disconnect internet, verify error messages are graceful
- [ ] Remove Firebase config, verify DatabaseErrorMessage shows
- [ ] Test 404 pages
- [ ] Test permission denied scenarios

### 8. Analytics & Monitoring Setup

**Google Analytics 4:**

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Add tracking code to `app/layout.tsx` (if not already present)

**Google Search Console:**

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `https://nriwealthpartners.com`
3. Verify ownership (HTML tag or DNS)
4. Submit sitemap: `https://nriwealthpartners.com/sitemap.xml`

**Error Tracking (Optional but Recommended):**

Set up Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 9. Performance Optimization

**Before Launch:**

- [ ] Run Lighthouse audit (target: 90+ for Performance, Accessibility, SEO)
- [ ] Optimize all images (use WebP format)
- [ ] Enable image lazy loading
- [ ] Minimize JavaScript bundle size
- [ ] Enable gzip compression (automatic on Vercel)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test page load speed: < 3 seconds on 4G

**Recommended Tools:**

- PageSpeed Insights: [pagespeed.web.dev](https://pagespeed.web.dev)
- WebPageTest: [webpagetest.org](https://www.webpagetest.org)
- GTmetrix: [gtmetrix.com](https://gtmetrix.com)

### 10. Content Population

**Initial Content Needed:**

- [ ] At least 10 blog posts published
- [ ] 5-10 resources uploaded (PDFs)
- [ ] 2-3 upcoming webinars scheduled
- [ ] News populated (run seed script or wait for aggregator)
- [ ] Homepage hero images optimized
- [ ] About Us page with team photos
- [ ] Contact information verified

---

## Quick Start Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run news seed script
node scripts/seed-news.js

# Deploy to Vercel
vercel --prod

# Deploy Cloud Functions
cd cloud-functions && firebase deploy --only functions
```

---

## Support & Troubleshooting

### Common Issues:

**1. "Database connection failed"**
- Cause: Missing or invalid `FIREBASE_ADMIN_KEY`
- Fix: Add correct Firebase service account JSON to environment variables

**2. "Upload failed" (Resource Management)**
- Cause: Firebase Storage not configured or permissions issue
- Fix: Check Storage Rules, verify bucket exists

**3. "Email not sent" (Team Invitations)**
- Cause: SMTP credentials incorrect
- Fix: Verify SMTP settings, use app-specific password for Gmail

**4. "News not loading"**
- Cause: No news data in Firestore
- Fix: Run `node scripts/seed-news.js` or deploy Cloud Function

**5. Build errors**
- Solution: `rm -rf .next && npm run build`
- Verify all dependencies: `npm install`

### Getting Help:

- Firebase Docs: [firebase.google.com/docs](https://firebase.google.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

---

## Post-Launch Checklist

**Week 1:**
- [ ] Monitor error logs daily
- [ ] Check form submissions working
- [ ] Verify emails being sent
- [ ] Test all user flows
- [ ] Collect initial user feedback

**Month 1:**
- [ ] Review analytics (traffic, conversions)
- [ ] A/B test headlines and CTAs
- [ ] Optimize underperforming pages
- [ ] Gather client testimonials
- [ ] Plan content calendar for Month 2

**Ongoing:**
- [ ] Weekly: Review analytics, adjust strategy
- [ ] Monthly: Update blog content, publish resources
- [ ] Quarterly: Review and refresh pillar content
- [ ] Annually: Major design/feature updates

---

**Ready to Launch?**

Once you complete items in the "PENDING" section above, your site will be fully functional and ready for production traffic. Start with the Firebase configuration, then test thoroughly before going live.

Good luck with the launch! 🚀
