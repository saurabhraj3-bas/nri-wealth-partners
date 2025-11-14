# 📊 Monitoring & Alerts Setup Guide

Complete guide to set up monitoring, alerts, and uptime tracking for your NRI Wealth Partners website.

---

## 🎯 Overview

This guide covers:
1. Google Cloud Monitoring & Alerts
2. Uptime Checks
3. Error Rate Monitoring
4. Performance Monitoring
5. Cost Alerts
6. Third-party Monitoring (Optional)

---

## 1️⃣ Google Cloud Monitoring Setup

### Step 1: Enable Required APIs

Run in Cloud Shell:

```bash
# Enable Cloud Monitoring API
gcloud services enable monitoring.googleapis.com

# Enable Alerting API
gcloud services enable clouderrorreporting.googleapis.com
```

### Step 2: Create Uptime Check

```bash
# Create uptime check for your website
gcloud monitoring uptime create nri-wealth-partners-uptime \
  --resource-type=uptime-url \
  --display-name="NRI Wealth Partners Website" \
  --protocol=HTTPS \
  --host=nriwealthpartners.com \
  --path=/ \
  --check-interval=60s \
  --timeout=10s
```

### Step 3: Set Up Alert Policies

#### A. Uptime Alert

```bash
# Create notification channel first (email)
gcloud alpha monitoring channels create \
  --display-name="Email Notifications" \
  --type=email \
  --channel-labels=email_address=saurabh@nriwealthpartners.com
```

Get the channel ID:
```bash
gcloud alpha monitoring channels list
```

Create uptime alert:
```bash
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Website Down Alert" \
  --condition-display-name="Website is down" \
  --condition-threshold-value=1 \
  --condition-threshold-duration=60s \
  --combiner=OR
```

#### B. Error Rate Alert

Via Console (easier):
1. Go to https://console.cloud.google.com/monitoring/alerting
2. Click **Create Policy**
3. **Target**: Cloud Run Revision
4. **Metric**: `Request count` with filter `response_code_class="5xx"`
5. **Threshold**: > 5 errors in 5 minutes
6. **Notification**: Your email
7. Click **Create Policy**

#### C. High Latency Alert

1. Go to https://console.cloud.google.com/monitoring/alerting
2. Click **Create Policy**
3. **Metric**: `Request latencies`
4. **Threshold**: 95th percentile > 3000ms for 5 minutes
5. **Notification**: Your email
6. Click **Create Policy**

#### D. High CPU/Memory Alert

1. **Metric**: `Container CPU utilization`
2. **Threshold**: > 80% for 5 minutes
3. **Notification**: Your email

---

## 2️⃣ Set Up Budget Alerts

### Prevent Unexpected Costs

```bash
# Set up budget alert
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="NRI Wealth Partners Monthly Budget" \
  --budget-amount=50USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

Get billing account ID:
```bash
gcloud billing accounts list
```

**Via Console (Easier)**:
1. Go to https://console.cloud.google.com/billing
2. Click **Budgets & alerts**
3. **Create Budget**
4. Set amount: **$50/month**
5. Add threshold alerts at: 50%, 90%, 100%
6. Add email notification
7. Click **Finish**

---

## 3️⃣ Configure Log-Based Alerts

### Alert on Specific Errors

```bash
# Create alert for application errors
gcloud logging metrics create error_rate \
  --description="Rate of application errors" \
  --log-filter='resource.type="cloud_run_revision"
    resource.labels.service_name="nri-wealth-partners"
    severity>=ERROR'

# Create alert policy for this metric
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Application Error Alert" \
  --condition-display-name="High error rate" \
  --condition-threshold-value=5 \
  --condition-threshold-duration=300s
```

---

## 4️⃣ Dashboard Setup

### Create Custom Monitoring Dashboard

1. Go to https://console.cloud.google.com/monitoring/dashboards
2. Click **Create Dashboard**
3. Name it: "NRI Wealth Partners Production"
4. Add the following widgets:

#### Widget 1: Request Count
- **Resource**: Cloud Run Revision
- **Metric**: Request count
- **Chart type**: Line chart
- **Time range**: 1 hour

#### Widget 2: Request Latency
- **Metric**: Request latencies
- **Percentiles**: 50th, 95th, 99th
- **Chart type**: Line chart

#### Widget 3: Error Rate
- **Metric**: Request count
- **Filter**: `response_code_class="5xx"`
- **Chart type**: Stacked area chart

#### Widget 4: CPU Utilization
- **Metric**: Container CPU utilization
- **Chart type**: Line chart

#### Widget 5: Memory Utilization
- **Metric**: Container memory utilization
- **Chart type**: Line chart

#### Widget 6: Active Instances
- **Metric**: Instance count
- **Chart type**: Line chart

5. **Save Dashboard**

---

## 5️⃣ Third-Party Monitoring (Optional)

### Option A: UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Sign up for free account
3. **Add New Monitor**:
   - Type: HTTP(S)
   - URL: https://nriwealthpartners.com
   - Name: NRI Wealth Partners
   - Monitoring Interval: 5 minutes
4. Add **Alert Contacts** (email, SMS, Slack)
5. Click **Create Monitor**

**Benefits**:
- ✅ Free for up to 50 monitors
- ✅ 5-minute checks
- ✅ Email/SMS alerts
- ✅ Public status page
- ✅ Downtime notifications

### Option B: Pingdom (Paid)

More advanced monitoring with detailed reports.

### Option C: New Relic (Free Tier)

Application performance monitoring.

---

## 6️⃣ Google Analytics Setup

### Step 1: Create Google Analytics Property

1. Go to https://analytics.google.com
2. Click **Admin** (bottom left)
3. Click **Create Property**
4. Property name: **NRI Wealth Partners**
5. Select timezone: **India**
6. Click **Next**
7. Business details: **Finance**, **Small** (1-10 employees)
8. Click **Create**
9. Accept terms

### Step 2: Get Measurement ID

1. Click **Data Streams**
2. Click **Add stream** → **Web**
3. Website URL: **https://nriwealthpartners.com**
4. Stream name: **NRI Wealth Partners Website**
5. Click **Create stream**
6. **Copy the Measurement ID** (looks like `G-XXXXXXXXXX`)

### Step 3: Add to Your Project

#### Method 1: Via Environment Variable (Recommended)

Add to `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Method 2: Via Cloud Run Environment Variable

```bash
gcloud run services update nri-wealth-partners \
  --update-env-vars NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
  --region us-central1
```

### Step 4: Deploy and Verify

After deployment, go to:
1. Google Analytics → **Reports** → **Realtime**
2. Open your website in a browser
3. You should see yourself in the realtime report!

---

## 7️⃣ Error Tracking Setup

### Google Cloud Error Reporting

Already enabled automatically! View errors at:
https://console.cloud.google.com/errors

### Set Up Error Notifications

1. Go to https://console.cloud.google.com/errors
2. Click **Settings** (gear icon)
3. Enable **Email notifications**
4. Add your email
5. Configure:
   - New errors: Immediate
   - Error spikes: When error rate increases 50%

---

## 8️⃣ Performance Monitoring

### Cloud Trace

Enable detailed request tracing:

```bash
# Already enabled by default for Cloud Run
# View traces at:
# https://console.cloud.google.com/traces
```

### Set Up Slow Request Alerts

1. Go to Cloud Monitoring
2. Create alert for requests > 5 seconds
3. Get notified when site is slow

---

## 9️⃣ Recommended Alert Configuration

### Critical Alerts (Immediate Notification)

- ✅ **Website Down** - Uptime check fails
- ✅ **High Error Rate** - > 5 errors in 5 min
- ✅ **Budget Exceeded** - 100% of budget used

### Warning Alerts (Email Summary)

- ⚠️ **High Latency** - > 3s response time
- ⚠️ **High CPU** - > 80% utilization
- ⚠️ **Budget Warning** - 90% of budget used

### Info Alerts (Daily Digest)

- ℹ️ **Traffic Spike** - Unusual traffic patterns
- ℹ️ **New Errors** - Previously unseen errors

---

## 🔟 Notification Channels

### Set Up Multiple Channels

1. **Email** - Primary (saurabh@nriwealthpartners.com)
2. **SMS** - Critical alerts only (add phone number)
3. **Slack** - Team notifications (optional)
4. **PagerDuty** - 24/7 on-call (enterprise only)

---

## 📋 Quick Setup Checklist

Run these commands in Cloud Shell:

```bash
# 1. Enable APIs
gcloud services enable monitoring.googleapis.com clouderrorreporting.googleapis.com

# 2. Create uptime check
gcloud monitoring uptime create nri-wealth-partners-uptime \
  --resource-type=uptime-url \
  --display-name="NRI Wealth Partners" \
  --protocol=HTTPS \
  --host=nriwealthpartners.com \
  --path=/ \
  --check-interval=60s

# 3. Get your billing account
gcloud billing accounts list

# 4. Set up budget (replace BILLING_ACCOUNT_ID)
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Monthly Budget" \
  --budget-amount=50USD \
  --threshold-rule=percent=90

# 5. View your dashboards
echo "Monitoring: https://console.cloud.google.com/monitoring"
echo "Errors: https://console.cloud.google.com/errors"
echo "Logs: https://console.cloud.google.com/logs"
```

---

## 🎯 Next Steps

1. ✅ Set up Google Analytics (get measurement ID)
2. ✅ Configure uptime checks
3. ✅ Create alert policies
4. ✅ Set budget alerts
5. ✅ Create monitoring dashboard
6. ✅ Test alerts (wait for an alert to verify)
7. ✅ Set up third-party monitoring (optional)

---

## 📊 Useful Links

- **Cloud Monitoring**: https://console.cloud.google.com/monitoring
- **Cloud Run Metrics**: https://console.cloud.google.com/run
- **Error Reporting**: https://console.cloud.google.com/errors
- **Logs Explorer**: https://console.cloud.google.com/logs
- **Billing**: https://console.cloud.google.com/billing
- **Google Analytics**: https://analytics.google.com

---

**Your monitoring is now enterprise-grade!** 🎉
