# Cloud Functions Deployment Guide - Newsletter System

This guide covers deploying the newsletter automation Cloud Functions to Google Cloud.

---

## Prerequisites

- ✅ Firebase/Firestore setup completed (see `firebase-setup-guide.md`)
- ✅ Google Cloud project: `nri-wealth-partners`
- ✅ Firebase Admin SDK credentials configured
- ✅ Google AI API key for Gemini
- ✅ Gmail app password for sending emails

---

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Login to Firebase:
```bash
firebase login
```

---

## Step 2: Initialize Firebase in Project

From your project root directory:

```bash
cd /Users/jyotikumari/Projects/NRIWealthPartners

# Initialize Firebase (if not already done)
firebase init
```

Select:
- ☑️ Functions: Configure Cloud Functions
- ☑️ Firestore: Deploy security rules
- Project: nri-wealth-partners

When prompted:
- **Language:** JavaScript
- **ESLint:** No (optional)
- **Install dependencies:** Yes
- **Functions directory:** `cloud-functions`

---

## Step 3: Install Cloud Functions Dependencies

```bash
cd cloud-functions
npm install
```

This will install:
- firebase-admin
- firebase-functions
- rss-parser
- axios
- @google/generative-ai
- cheerio
- nodemailer

---

## Step 4: Configure Environment Variables

Cloud Functions need environment variables for:
- Firebase Admin SDK credentials
- Google AI API key
- Gmail credentials

### Set Environment Variables:

```bash
firebase functions:config:set \
  google.ai_api_key="AIzaSyB55oEX-yg7vcabPGedY60Q0NccniqqA5c" \
  gmail.user="newsletters@nriwealthpartners.com" \
  gmail.password="YOUR_GMAIL_APP_PASSWORD"
```

### Verify Configuration:

```bash
firebase functions:config:get
```

### For Local Development:

Create `.runtimeconfig.json` in `cloud-functions` directory:

```json
{
  "google": {
    "ai_api_key": "AIzaSyB55oEX-yg7vcabPGedY60Q0NccniqqA5c"
  },
  "gmail": {
    "user": "newsletters@nriwealthpartners.com",
    "password": "YOUR_GMAIL_APP_PASSWORD"
  }
}
```

**IMPORTANT:** Add `.runtimeconfig.json` to `.gitignore`

---

## Step 5: Update Environment Variable Access

Update Cloud Function code to read from Firebase config:

In each Cloud Function file, replace:
```javascript
process.env.GOOGLE_AI_API_KEY
```

With:
```javascript
functions.config().google.ai_api_key
```

And:
```javascript
process.env.GMAIL_USER
process.env.GMAIL_APP_PASSWORD
```

With:
```javascript
functions.config().gmail.user
functions.config().gmail.password
```

---

## Step 6: Deploy Cloud Functions

### Deploy All Functions:

```bash
cd cloud-functions
firebase deploy --only functions
```

### Deploy Specific Function:

```bash
firebase deploy --only functions:scheduledRSSCollection
```

### Deployment Output:

You should see:
```
✔ functions: Finished running predeploy script.
i functions: preparing cloud-functions directory for uploading...
✔ functions: cloud-functions folder uploaded successfully
i functions: creating Node.js 18 function scheduledRSSCollection(us-central1)...
i functions: creating Node.js 18 function scheduledArticleFiltering(us-central1)...
i functions: creating Node.js 18 function scheduledArticleSummarization(us-central1)...
i functions: creating Node.js 18 function scheduledNewsletterCompilation(us-central1)...
i functions: creating Node.js 18 function triggerRSSCollection(us-central1)...
i functions: creating Node.js 18 function triggerArticleFiltering(us-central1)...
i functions: creating Node.js 18 function sendNewsletter(us-central1)...
i functions: creating Node.js 18 function trackEmail(us-central1)...
i functions: creating Node.js 18 function onRawArticleCreated(us-central1)...
i functions: creating Node.js 18 function onNewsletterAnalyticsCreated(us-central1)...
✔ Deploy complete!
```

---

## Step 7: Set Up Cloud Scheduler

Cloud Scheduler triggers functions on a schedule.

### Enable Cloud Scheduler API:

```bash
gcloud services enable cloudscheduler.googleapis.com --project=nri-wealth-partners
```

### Create Scheduler Jobs:

Firebase Pub/Sub scheduled functions are automatically created, but verify:

```bash
gcloud scheduler jobs list --project=nri-wealth-partners
```

You should see:
- `firebase-schedule-scheduledRSSCollection-us-central1`
- `firebase-schedule-scheduledArticleFiltering-us-central1`
- `firebase-schedule-scheduledArticleSummarization-us-central1`
- `firebase-schedule-scheduledNewsletterCompilation-us-central1`

### Manually Trigger a Scheduled Function (for testing):

```bash
gcloud scheduler jobs run firebase-schedule-scheduledRSSCollection-us-central1 \
  --project=nri-wealth-partners \
  --location=us-central1
```

---

## Step 8: Test Cloud Functions

### Test Manual Trigger Functions:

Use Firebase Console or gcloud CLI:

```bash
# Via gcloud (requires proper auth setup)
gcloud functions call triggerRSSCollection \
  --region=us-central1 \
  --data='{}'
```

### Test via Next.js (from admin UI):

Create API route in Next.js app:

```typescript
// app/api/admin/trigger-rss/route.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFunctions } from 'firebase-admin/functions';

export async function POST(request: Request) {
  // Verify admin authentication
  // ...

  const functions = getFunctions();
  const result = await functions.taskQueue('triggerRSSCollection').enqueue({});

  return Response.json({ success: true, result });
}
```

---

## Step 9: Monitor Cloud Functions

### View Logs:

```bash
# All functions
firebase functions:log

# Specific function
firebase functions:log --only scheduledRSSCollection

# Last 10 lines
firebase functions:log --limit 10

# Follow logs in real-time
firebase functions:log --tail
```

### View in Cloud Console:

1. Go to [Cloud Functions Console](https://console.cloud.google.com/functions/list?project=nri-wealth-partners)
2. Click on a function
3. View "Logs" tab

---

## Step 10: Set Up Monitoring & Alerts

### Create Alerting Policy:

1. Go to [Cloud Monitoring](https://console.cloud.google.com/monitoring?project=nri-wealth-partners)
2. Click "Alerting" → "Create Policy"
3. Set conditions:
   - **Resource type:** Cloud Function
   - **Metric:** Execution count, Error count
   - **Condition:** Error count > 5 in 1 hour
4. Set notification channel (email)

### Recommended Alerts:

- **Error rate:** Alert if >10% of function executions fail
- **Execution time:** Alert if function timeout (>540s for scheduled functions)
- **Quota:** Alert when approaching Cloud Functions quota

---

## Architecture Overview

```
Daily Automation Flow:
====================

2:00 AM IST → scheduledRSSCollection
              ↓ Collects articles from RSS feeds
              ↓ Stores in raw_articles collection
              ↓
3:00 AM IST → scheduledArticleFiltering
              ↓ AI filters articles (Gemini)
              ↓ Creates curated_articles (score >= 7)
              ↓
4:00 AM IST → scheduledArticleSummarization
              ↓ AI generates summaries (Gemini)
              ↓ Updates curated_articles with headlines/summaries
              ↓
Monday 9 AM → scheduledNewsletterCompilation
              ↓ Compiles newsletter from last week's articles
              ↓ Creates draft newsletter (status: pending_review)
              ↓
              ↓ [Admin reviews and approves in UI]
              ↓
              ↓ Admin clicks "Send Now" or "Schedule"
              ↓
              → sendNewsletter (callable function)
                ↓ Creates email_queue entries
                ↓ Sends emails in batches
                ↓ Tracks sent emails
                ↓
                → Email opens/clicks tracked via trackEmail
```

---

## Function Details

### Scheduled Functions (Pub/Sub):

| Function | Schedule | Timeout | Memory | Purpose |
|----------|----------|---------|--------|---------|
| `scheduledRSSCollection` | Daily 2 AM IST | 9 min | 512MB | Collect RSS feeds |
| `scheduledArticleFiltering` | Daily 3 AM IST | 9 min | 1GB | AI filter articles |
| `scheduledArticleSummarization` | Daily 4 AM IST | 9 min | 1GB | AI summarize articles |
| `scheduledNewsletterCompilation` | Mon 9 AM IST | 5 min | 512MB | Compile newsletter |

### Callable Functions (HTTPS):

| Function | Auth Required | Purpose |
|----------|---------------|---------|
| `triggerRSSCollection` | Yes (admin) | Manual RSS collection |
| `triggerArticleFiltering` | Yes (admin) | Manual article filtering |
| `sendNewsletter` | Yes (admin w/ publish permission) | Send newsletter |

### HTTP Functions:

| Function | Method | Purpose |
|----------|--------|---------|
| `trackEmail` | GET | Track email opens/clicks |

### Firestore Triggers:

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onRawArticleCreated` | onCreate in raw_articles | Auto-process new articles |
| `onNewsletterAnalyticsCreated` | onCreate in newsletter_analytics | Update newsletter stats |

---

## Costs Estimation

### Cloud Functions Pricing:

**Free Tier (per month):**
- 2M invocations
- 400,000 GB-seconds compute time
- 200,000 GHz-seconds compute time
- 5GB outbound data

**Expected Usage:**
- Scheduled functions: ~120 invocations/month (4 daily)
- Callable functions: ~10 invocations/month (manual triggers)
- Firestore triggers: ~3,000 invocations/month (new articles)
- HTTP functions: ~4,000 invocations/month (email tracking)

**Total:** ~7,130 invocations/month

**Estimated Cost:** $0/month (within free tier)

---

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Solution:** Grant Cloud Functions service account Firestore permissions:

```bash
gcloud projects add-iam-policy-binding nri-wealth-partners \
  --member=serviceAccount:nri-wealth-partners@appspot.gserviceaccount.com \
  --role=roles/datastore.user
```

### Error: "DEADLINE_EXCEEDED" or "Timeout"

**Solution:** Increase function timeout:

In `index.js`:
```javascript
exports.functionName = functions
  .runWith({ timeoutSeconds: 540 })  // Max 9 minutes
  .pubsub.schedule('...')
```

### Error: "AI API quota exceeded"

**Solution:** Implement rate limiting or request quota increase:

1. Check quota: [API & Services → Quotas](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas?project=nri-wealth-partners)
2. Request increase if needed
3. Add delay between AI requests (already implemented in code)

### Error: "Gmail daily sending limit exceeded"

**Solution:** Google Workspace has 2,000 emails/day limit:

1. Monitor subscriber count
2. If >2,000 subscribers, consider:
   - SendGrid (100 emails/day free, then paid)
   - AWS SES (62,000 emails/month free)
   - Mailgun (5,000 emails/month free)

---

## Next Steps

After deployment:

1. ✅ Test each Cloud Function manually
2. ✅ Verify Cloud Scheduler jobs are running
3. ✅ Check logs for errors
4. ✅ Run seed scripts to populate Firestore
5. ✅ Trigger RSS collection manually
6. ✅ Verify articles are being collected
7. ✅ Build admin UI to review/approve newsletters
8. ✅ Test email sending with small subscriber list

---

## Maintenance

### Weekly:
- Review Cloud Function logs for errors
- Check newsletter compilation success
- Monitor email delivery rates

### Monthly:
- Review costs in Cloud Console
- Check API quota usage
- Update RSS feed sources if needed
- Analyze newsletter performance (open rates, clicks)

---

## Security Checklist

- ✅ Firebase security rules enforced
- ✅ Admin authentication required for callable functions
- ✅ API keys stored in Firebase config (not in code)
- ✅ Service account has minimal required permissions
- ✅ HTTPS-only for all endpoints
- ✅ Email unsubscribe tokens are unique and secure
- ✅ Rate limiting on AI API calls

---

## Useful Commands Reference

```bash
# Deploy
firebase deploy --only functions
firebase deploy --only functions:functionName

# Logs
firebase functions:log
firebase functions:log --only functionName
firebase functions:log --tail

# Config
firebase functions:config:set key="value"
firebase functions:config:get
firebase functions:config:unset key

# Local emulator
firebase emulators:start --only functions

# Delete function
firebase functions:delete functionName
```
