# Monitoring Quick Start Guide

## What's Been Deployed

Your comprehensive monitoring system is now live! Here's what's included:

### ✅ Already Active (No Action Required)

1. **Frontend Error Monitoring** - Automatically captures:
   - JavaScript errors and exceptions
   - Network/API failures
   - Performance issues (>100ms tasks)
   - Unhandled promise rejections

2. **Auto-Remediation** - Automatically attempts to fix:
   - Network errors: 3 retries with exponential backoff
   - API errors: Cache clearing and retry
   - Session errors: Auto-reset chatbot session

3. **Email Alerts** - Sends notifications for:
   - HIGH severity errors
   - CRITICAL severity errors
   - Sends to: `CONTACT_EMAIL` or `GMAIL_USER` from environment

4. **Health Check Endpoint** - Available at:
   ```
   https://nriwealthpartners.com/api/health
   ```

## Next Steps (Optional but Recommended)

### Step 1: Verify Deployment

Test the health endpoint:

```bash
curl https://nriwealthpartners.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-29T...",
  "uptime": 3600,
  "checks": {
    "api": true,
    "googleAI": true,
    "email": true,
    "environment": true
  },
  "version": "7794cfb",
  "responseTime": 45
}
```

### Step 2: Set Up Google Cloud Monitoring (5 minutes)

Run the automated setup script:

```bash
# 1. Re-authenticate with Google Cloud (if needed)
gcloud auth login

# 2. Run the monitoring setup script
./scripts/setup-monitoring.sh
```

This script will:
- Create uptime checks for main site and health endpoint
- Set up email notification channel
- Configure Cloud Run health checks
- Display monitoring dashboard URLs

### Step 3: Configure External Uptime Monitoring (Optional, Free)

For additional reliability, set up free external monitoring:

**UptimeRobot** (Recommended - Free tier includes 50 monitors)
1. Visit: https://uptimerobot.com
2. Create account (free)
3. Add monitor:
   - Type: HTTPS
   - URL: `https://nriwealthpartners.com/api/health`
   - Interval: 5 minutes
   - Alert: Your email

**Alternative Options:**
- Pingdom: https://www.pingdom.com (Free tier: 1 monitor)
- StatusCake: https://www.statuscake.com (Free tier: unlimited)

## How to Use

### View Error Reports

**In Google Cloud Console:**
```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50 --format=json

# Or visit:
https://console.cloud.google.com/logs/query?project=nri-wealth-partners
```

**Filter by error type:**
- `[Frontend Error]` - Frontend errors
- `[Health Check]` - Health check results

### Check Email Alerts

All HIGH and CRITICAL errors are automatically sent to your configured email. Example alert:

```
Subject: 🚨 CRITICAL Error - NRI Wealth Partners

Error Details:
- Category: API
- Message: Network request failed
- URL: https://nriwealthpartners.com/
- Timestamp: 2025-11-29 20:15:30

Recommended Actions:
✓ Check Cloud Run logs
✓ Review recent deployments
✓ Check API endpoint health
```

### Monitor Performance

Access monitoring dashboards:

1. **Uptime Checks**: https://console.cloud.google.com/monitoring/uptime?project=nri-wealth-partners
2. **Alerts**: https://console.cloud.google.com/monitoring/alerting?project=nri-wealth-partners
3. **Cloud Run Metrics**: https://console.cloud.google.com/run?project=nri-wealth-partners

## Troubleshooting

### Health endpoint returns 503

**Possible causes:**
- Google AI API key not configured
- Email credentials missing
- Environment variables not set

**Fix:**
```bash
# Check environment variables in Cloud Run
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

### Not receiving email alerts

**Check:**
1. Email credentials configured: `GMAIL_USER` and `GMAIL_APP_PASSWORD`
2. Contact email set: `CONTACT_EMAIL`
3. Error severity is HIGH or CRITICAL
4. Check spam folder

### Errors not being captured

**Verify:**
1. Error monitor initialized (check browser console for `[ErrorMonitor] Initialized`)
2. No browser extensions blocking requests
3. `/api/monitor/error` endpoint accessible

## Cost

**Current Setup (FREE):**
- Frontend monitoring: $0
- Cloud Run logs (50 GB/month): $0
- Health checks: $0
- Email alerts: $0

**Paid Options (if needed):**
- Sentry (advanced error tracking): $26/month
- LogRocket (session replay): $99/month
- DataDog (full stack): $15/host/month

## Support

- **Full Documentation**: See `MONITORING_SETUP.md`
- **Issues**: Report at https://github.com/saurabhraj3-bas/nri-wealth-partners/issues
- **Contact**: support@nriwealthpartners.com

---

**Last Updated**: 2025-11-29
**Status**: ✅ Active and Monitoring
