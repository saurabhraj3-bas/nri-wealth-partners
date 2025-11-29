# News Aggregation Cloud Function - Deployment Guide

## Overview
This guide helps you complete the deployment of the automated news aggregation system for NRI Wealth Partners.

**What it does:**
- Automatically fetches news from 6+ trusted RSS sources daily
- Categorizes articles (Immigration, Tax, Investment, Market)
- Saves to Firestore database
- Articles appear automatically on https://nriwealthpartners.com/resources

---

## Current Status

✅ **Completed:**
- Cloud Function code written (`/cloud-functions/`)
- Dependencies installed
- Firebase configuration updated
- Admin panel ready at `/admin/news`
- Public display ready at `/resources`

⏳ **Next Steps:**
1. Verify function deployment
2. Set up daily schedule
3. Test the function

---

## Step 1: Verify Function Deployment

### Option A: Via Google Cloud Console (Easiest)

1. Go to: https://console.cloud.google.com/run/functions?project=nri-wealth-partners
2. Look for function named: `scheduledrsscollection` or `scheduledRSSCollection`
3. **Green checkmark** = Successfully deployed ✅
4. **Red X or missing** = Need to redeploy ❌

### Option B: Via Command Line

```bash
gcloud functions list --project=nri-wealth-partners --gen2
```

**Expected output:**
```
NAME                        STATE    TRIGGER       REGION
scheduledrsscollection      ACTIVE   Pub/Sub       us-central1
```

---

## Step 2: Set Up Daily Schedule (Cloud Scheduler)

This makes the function run automatically every day at 2:00 AM IST.

### Via Google Cloud Console:

1. **Go to Cloud Scheduler:**
   https://console.cloud.google.com/cloudscheduler?project=nri-wealth-partners

2. **Click "CREATE JOB"**

3. **Fill in details:**
   - **Name:** `rss-collection-daily`
   - **Region:** `us-central1`
   - **Frequency (cron):** `30 20 * * *`
     - This means: Daily at 8:30 PM UTC (2:00 AM IST next day)
   - **Timezone:** `Asia/Kolkata`

4. **Configure the execution:**
   - **Target type:** Pub/Sub
   - **Topic:** `scheduled-rss-collection` (select existing)
   - **Message body:** `{}` (just empty braces)

5. **Click "CREATE"**

### Via Command Line:

```bash
gcloud scheduler jobs create pubsub rss-collection-daily \
  --location=us-central1 \
  --schedule="30 20 * * *" \
  --topic=scheduled-rss-collection \
  --message-body='{}' \
  --time-zone="Asia/Kolkata" \
  --project=nri-wealth-partners
```

---

## Step 3: Test the Function NOW (Get Immediate Results)

Don't wait until 2 AM! Trigger the function manually to populate news articles right away.

### Method 1: Via Cloud Console

1. **Go to Pub/Sub Topics:**
   https://console.cloud.google.com/cloudpubsub/topic/list?project=nri-wealth-partners

2. **Find topic:** `scheduled-rss-collection`

3. **Click on it** → Click **"PUBLISH MESSAGE"**

4. **Message body:** `{}` (just empty braces)

5. **Click "PUBLISH"**

6. **Wait 2-3 minutes** for function to process RSS feeds

### Method 2: Via Command Line

```bash
gcloud pubsub topics publish scheduled-rss-collection \
  --message='{}' \
  --project=nri-wealth-partners
```

---

## Step 4: Verify News Articles Appear

### Check 1: Firestore Database

1. Go to: https://console.firebase.google.com/project/nri-wealth-partners/firestore
2. Look for collection: `news`
3. You should see multiple documents (articles)

### Check 2: Public Website

1. Go to: https://nriwealthpartners.com/resources
2. Click the **"News"** tab
3. Articles should now appear instead of "sample news"

### Check 3: API Endpoint

```bash
curl "https://nri-wealth-partners-979245985437.us-central1.run.app/api/news/fetch-latest?days=30"
```

**Expected response:**
```json
{
  "success": true,
  "articles": [...], // Array of news articles
  "count": 10,       // Number of articles
  "isLiveData": true // Should be true now!
}
```

---

## Step 5: Check Function Logs (If Issues)

1. **Go to Cloud Functions:**
   https://console.cloud.google.com/functions/details/us-central1/scheduledrsscollection?project=nri-wealth-partners

2. **Click "LOGS" tab**

3. **Look for:**
   - ✅ "RSS collection completed: X articles"
   - ❌ Any error messages

---

## Troubleshooting

### Problem: Function doesn't appear in list

**Solution:** Redeploy using Google Cloud Console:
1. Go to: https://console.cloud.google.com/run?project=nri-wealth-partners
2. Click "WRITE A FUNCTION"
3. Follow deployment steps in main deployment guide

### Problem: No news articles after triggering

**Check these:**
1. Function logs for errors
2. Firestore rules allow writes
3. FIREBASE_ADMIN_KEY environment variable is set

### Problem: Articles appear but don't show on website

**Check:**
1. Firestore indexes are READY (not BUILDING)
2. Clear browser cache and refresh
3. Check browser console for JavaScript errors

---

## News Sources

The function automatically fetches from these sources:

**Immigration:**
- USCIS News
- UK Visas and Immigration
- IRCC Canada

**Tax & Compliance:**
- IRS Tax News
- India Economic Times (Tax Policy)

**Investment & Market:**
- Economic Times Markets
- Reuters India Business

---

## Admin Functions

### View All News Articles

**Admin panel:** https://nriwealthpartners.com/admin/news

**Permissions required:** `deleteContent` permission

**What you can do:**
- View all aggregated news articles
- Filter by category
- Search articles
- Delete outdated/irrelevant articles

### Delete Old Articles

The admin can manually delete:
- Outdated information (>90 days old)
- Duplicate articles
- Incorrect/misleading content
- Off-topic content

---

## Monitoring

### Check Function Metrics

1. Go to function details page
2. Click **"METRICS"** tab
3. View:
   - Invocation count (should be 1/day)
   - Execution time
   - Error rate (should be 0%)

### Check Article Count Over Time

```bash
# In Firestore console, count documents in 'news' collection
```

**Expected growth:**
- ~5-15 new articles per day
- Delete old articles manually to keep database clean

---

## Cost Estimate

**Cloud Function:**
- Free tier: 2M invocations/month
- Your usage: 30 invocations/month (1/day)
- **Cost: $0**

**Cloud Scheduler:**
- Free tier: 3 jobs
- Your usage: 1 job
- **Cost: $0**

**Firestore:**
- Reads: ~10/day on public site
- Writes: ~10/day from function
- **Cost: ~$0.01/month**

**Total: ~$0.01/month** 🎉

---

## Future Enhancements

### Add More News Sources

Edit `/cloud-functions/src/news-aggregator.js`:

```javascript
const NEWS_SOURCES = {
  immigration: [
    // Add new RSS feed URL here
    {
      name: 'Your Source Name',
      url: 'https://example.com/rss.xml',
      category: 'immigration',
      tags: ['tag1', 'tag2'],
    },
  ],
  // ... other categories
}
```

Then redeploy the function.

### Change Schedule Frequency

**Hourly updates:**
```
--schedule="0 * * * *"
```

**Twice daily (2 AM and 2 PM IST):**
```
--schedule="30 8,20 * * *"
```

### Add Email Notifications

Modify `/cloud-functions/src/news-aggregator.js` to send email when new articles are found.

---

## Support

**If you encounter issues:**
1. Check function logs in Google Cloud Console
2. Verify Firestore permissions
3. Contact: tech@nriwealthpartners.com

---

## Quick Reference Commands

```bash
# List functions
gcloud functions list --project=nri-wealth-partners --gen2

# View function details
gcloud functions describe scheduledrsscollection \
  --region=us-central1 --project=nri-wealth-partners --gen2

# Trigger function manually
gcloud pubsub topics publish scheduled-rss-collection \
  --message='{}' --project=nri-wealth-partners

# View function logs
gcloud functions logs read scheduledrsscollection \
  --region=us-central1 --project=nri-wealth-partners --gen2 --limit=50

# List scheduler jobs
gcloud scheduler jobs list --project=nri-wealth-partners

# Test scheduler job
gcloud scheduler jobs run rss-collection-daily \
  --location=us-central1 --project=nri-wealth-partners
```

---

*Last Updated: November 28, 2025*
*Version: 1.0*
