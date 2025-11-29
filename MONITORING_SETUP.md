# 🔍 Comprehensive Monitoring & Auto-Remediation System

## Overview

Multi-layer monitoring system that detects errors before users are impacted and provides automatic first-level remediation.

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Browser                                │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Frontend Error Monitoring                             │
│  ✓ JavaScript errors                                            │
│  ✓ Network failures                                             │
│  ✓ Performance issues                                           │
│  ✓ Auto-retry & cache clearing                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Cloud Run (Next.js App)                            │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Backend Monitoring                                    │
│  ✓ Health check endpoint (/api/health)                         │
│  ✓ Error reporting (/api/monitor/error)                        │
│  ✓ API performance tracking                                     │
│  ✓ Email alerts for critical errors                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Google Cloud Monitoring                            │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Infrastructure Monitoring                             │
│  ✓ Uptime checks                                                │
│  ✓ Cloud Run metrics                                            │
│  ✓ Auto-restart on failures                                     │
│  ✓ Alert policies                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Features Implemented

### 1. Frontend Error Monitoring (`lib/error-monitoring.ts`)

**Automatic Detection:**
- JavaScript errors and exceptions
- Unhandled promise rejections
- Network/API failures
- Performance bottlenecks (>100ms tasks)
- Rendering issues

**Auto-Remediation Strategies:**
- **Network Errors**: Exponential backoff retry (3 attempts)
- **API Errors**: Clear cache and retry
- **Performance Issues**: Log and track for optimization

**Example Usage:**
```typescript
import { errorMonitor } from '@/lib/error-monitoring'

// Errors are automatically captured
// Manual event tracking:
errorMonitor.trackEvent('user_action', { action: 'button_click' })
```

### 2. Backend Error Reporting (`/api/monitor/error`)

**Features:**
- Receives frontend error reports
- Sends email alerts for HIGH/CRITICAL errors
- Logs to Cloud Run (viewable in Cloud Logging)
- Structured error data for analysis

**Alert Email Includes:**
- Error severity and category
- Full stack trace
- User context (URL, browser)
- Recommended actions

### 3. Health Check Endpoint (`/api/health`)

**Checks:**
- ✅ API responsiveness
- ✅ Google AI API key configured
- ✅ Email credentials configured
- ✅ Critical environment variables

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-29T20:00:00.000Z",
  "uptime": 3600,
  "checks": {
    "api": true,
    "googleAI": true,
    "email": true,
    "environment": true
  },
  "version": "e6aa6c8",
  "responseTime": 45
}
```

**Status Codes:**
- `200`: Healthy
- `200` + "degraded": Some non-critical services down
- `503`: Unhealthy (critical services down)

## 🔧 Setup Instructions

### Step 1: Enable Monitoring (Already Done ✅)

The monitoring system is already implemented. It will automatically:
1. Capture frontend errors
2. Report to backend
3. Send email alerts
4. Log to Cloud Run

### Step 2: Configure Google Cloud Monitoring

#### A. Uptime Check (Recommended)
```bash
# Create uptime check for your website
gcloud monitoring uptime create https \
  --display-name="NRI Wealth Partners - Main Site" \
  --hostname="nriwealthpartners.com" \
  --path="/" \
  --check-interval=5m \
  --timeout=10s

# Create uptime check for health endpoint
gcloud monitoring uptime create https \
  --display-name="NRI Wealth Partners - Health Check" \
  --hostname="nriwealthpartners.com" \
  --path="/api/health" \
  --check-interval=1m \
  --timeout=10s
```

#### B. Alert Policy for Critical Errors
```bash
# This will alert you when health check fails
gcloud alpha monitoring policies create \
  --display-name="Health Check Failed" \
  --condition-display-name="Health endpoint returning 503" \
  --condition-threshold-value=1 \
  --condition-threshold-duration=300s \
  --notification-channels=YOUR_EMAIL_CHANNEL_ID
```

### Step 3: Configure Cloud Run Health Checks

Update your Cloud Run service:
```bash
gcloud run services update nri-wealth-partners \
  --region=us-central1 \
  --min-instances=1 \
  --max-instances=10 \
  --cpu=1 \
  --memory=512Mi \
  --startup-cpu-boost \
  --health-checks-enabled \
  --health-check-path=/api/health \
  --startup-probe-initial-delay=10 \
  --startup-probe-period=10 \
  --startup-probe-failure-threshold=3 \
  --liveness-probe-initial-delay=0 \
  --liveness-probe-period=10 \
  --liveness-probe-failure-threshold=3
```

## 📧 Email Alerts

Alerts are automatically sent for **HIGH** and **CRITICAL** errors to:
- `CONTACT_EMAIL` environment variable
- Fallback: `GMAIL_USER` environment variable

**Example Alert:**
```
Subject: 🚨 CRITICAL Error - NRI Wealth Partners

Error Details:
- Category: API
- Message: Google AI API quota exceeded
- URL: https://nriwealthpartners.com/
- Timestamp: 2025-11-29 20:15:30

Recommended Actions:
✓ Check Cloud Run logs
✓ Review recent deployments
✓ Check API endpoint health
```

## 📈 Monitoring Dashboard

### View Logs in Google Cloud Console
1. Go to: https://console.cloud.google.com/logs
2. Select your project: `nri-wealth-partners`
3. Filter by:
   - `resource.type="cloud_run_revision"`
   - `resource.labels.service_name="nri-wealth-partners"`
   - Search for: `[Frontend Error]` or `[Health Check]`

### Create Custom Dashboard
```bash
# This creates a dashboard with key metrics
gcloud monitoring dashboards create --config-from-file=- <<EOF
{
  "displayName": "NRI Wealth Partners Monitoring",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Request Count",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=\"nri-wealth-partners\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        }
      }
    ]
  }
}
EOF
```

## 🔍 Troubleshooting Common Issues

### Issue: Chatbot showing connection error

**Auto-Remediation Triggered:**
1. ✅ Frontend retries API call (3 attempts with backoff)
2. ✅ Clears chatbot session storage
3. ✅ Reports error to backend
4. ✅ Email alert sent if critical

**Manual Fix:**
```bash
# Check health endpoint
curl https://nriwealthpartners.com/api/health

# Check chatbot API
curl -X POST https://nriwealthpartners.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","userEmail":"test@test.com","conversationHistory":[]}'

# Check Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" \
  --limit=50 --format=json
```

### Issue: Performance degradation

**Auto-Detection:**
- Frontend monitors tasks >100ms
- Automatically reports to backend
- Email alert sent with performance data

**Investigation:**
```bash
# Check Cloud Run performance
gcloud monitoring time-series list \
  --filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_latencies"' \
  --format=json
```

## 🎯 Best Practices

### 1. Regular Health Checks
Set up cron job or external monitoring:
```bash
# Every 5 minutes
*/5 * * * * curl -f https://nriwealthpartners.com/api/health || echo "Health check failed"
```

### 2. Review Error Alerts Weekly
- Check email for error notifications
- Review Cloud Run logs
- Identify patterns and fix root causes

### 3. Monitor Key Metrics
- **Error Rate**: <1% of requests
- **Response Time**: <2s (p95)
- **Availability**: >99.9%

### 4. Set Up Uptime Monitoring
Use external services (free tier):
- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **StatusCake**: https://www.statuscake.com

## 📊 Metrics to Track

### Frontend Metrics
- JavaScript error rate
- API failure rate
- Page load time
- Time to Interactive (TTI)

### Backend Metrics
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Health check success rate
- AI API response time

### Infrastructure Metrics
- CPU utilization
- Memory usage
- Cold start frequency
- Instance count

## 🚨 Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Error Rate | >1% | >5% | Email alert + investigate |
| Response Time | >2s | >5s | Email alert + scale up |
| Health Check | 1 failure | 3 failures | Auto-restart + email |
| API Quota | >80% | >95% | Email alert + increase quota |

## 🔄 Auto-Remediation Actions

### Automatic Actions Taken
1. **Network Error**: Retry with exponential backoff (1s, 2s, 4s)
2. **API Error**: Clear cache, retry once
3. **Performance Issue**: Log for review, no user impact
4. **Critical Error**: Email alert to admin

### Manual Remediation Required
- Google AI API quota exceeded → Increase quota
- Cloud Run out of memory → Increase memory allocation
- Database connection failure → Check Firestore status
- Certificate expiration → Renew SSL certificate

## 📝 Next Steps

### Immediate (Free)
- [x] Frontend error monitoring
- [x] Health check endpoint
- [x] Email alerts
- [ ] Set up Google Cloud Monitoring uptime checks
- [ ] Configure alert policies
- [ ] Add external uptime monitoring (UptimeRobot)

### Short-term (1-2 weeks)
- [ ] Create monitoring dashboard
- [ ] Set up synthetic tests
- [ ] Implement performance budgets
- [ ] Add user session replay (optional)

### Long-term (1-3 months)
- [ ] Analyze error patterns
- [ ] Optimize based on metrics
- [ ] Implement A/B testing for fixes
- [ ] Advanced AI-powered alerting

## 💰 Cost Estimation

### Free Tier (Current)
- Frontend monitoring: **$0** (included)
- Cloud Run logs: **$0** (50 GB/month free)
- Email alerts: **$0** (Gmail)
- Health checks: **$0** (Cloud Monitoring free tier)

### Paid Options (Optional)
- **Sentry** (Advanced error tracking): $26/month
- **LogRocket** (Session replay): $99/month
- **DataDog** (Full stack): $15/host/month
- **UptimeRobot** (Pro): $7/month

**Recommendation**: Start with free tier, upgrade if needed.

## 🔗 Useful Links

- [Cloud Run Logs](https://console.cloud.google.com/logs/query?project=nri-wealth-partners)
- [Cloud Monitoring](https://console.cloud.google.com/monitoring?project=nri-wealth-partners)
- [Health Endpoint](https://nriwealthpartners.com/api/health)
- [Google Cloud Status](https://status.cloud.google.com/)

---

**Last Updated**: 2025-11-29
**Maintained By**: Development Team
**Contact**: support@nriwealthpartners.com
