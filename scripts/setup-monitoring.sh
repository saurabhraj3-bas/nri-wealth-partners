#!/bin/bash

# Google Cloud Monitoring Setup Script
# This script sets up comprehensive uptime monitoring and alerting for NRI Wealth Partners

set -e  # Exit on error

PROJECT_ID="nri-wealth-partners"
REGION="us-central1"
SERVICE_NAME="nri-wealth-partners"
DOMAIN="nriwealthpartners.com"

echo "🔍 Setting up Google Cloud Monitoring for NRI Wealth Partners..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Step 1: Create uptime check for main website
echo "📊 Step 1/5: Creating uptime check for main website..."
gcloud monitoring uptime create https \
  --project=$PROJECT_ID \
  --display-name="NRI Wealth Partners - Main Site" \
  --hostname="$DOMAIN" \
  --path="/" \
  --check-interval=5m \
  --timeout=10s \
  && echo "✅ Main site uptime check created" \
  || echo "⚠️  Main site uptime check already exists or failed"

echo ""

# Step 2: Create uptime check for health endpoint
echo "📊 Step 2/5: Creating uptime check for health endpoint..."
gcloud monitoring uptime create https \
  --project=$PROJECT_ID \
  --display-name="NRI Wealth Partners - Health Check" \
  --hostname="$DOMAIN" \
  --path="/api/health" \
  --check-interval=1m \
  --timeout=10s \
  && echo "✅ Health endpoint uptime check created" \
  || echo "⚠️  Health endpoint uptime check already exists or failed"

echo ""

# Step 3: Create notification channel (email)
echo "📧 Step 3/5: Creating email notification channel..."
echo "Please enter the email address for alerts (press Enter to use default from .env):"
read -r ALERT_EMAIL

if [ -z "$ALERT_EMAIL" ]; then
  # Try to get from environment or use default
  ALERT_EMAIL="${CONTACT_EMAIL:-support@nriwealthpartners.com}"
fi

echo "Creating notification channel for: $ALERT_EMAIL"

# Create notification channel
CHANNEL_ID=$(gcloud alpha monitoring channels create \
  --project=$PROJECT_ID \
  --display-name="Email Alerts - $ALERT_EMAIL" \
  --type=email \
  --channel-labels=email_address=$ALERT_EMAIL \
  --format="value(name)" 2>/dev/null || echo "")

if [ -n "$CHANNEL_ID" ]; then
  echo "✅ Notification channel created: $CHANNEL_ID"
else
  echo "⚠️  Could not create notification channel. You may need to create it manually."
  echo "   Visit: https://console.cloud.google.com/monitoring/alerting/notifications?project=$PROJECT_ID"
fi

echo ""

# Step 4: Update Cloud Run service with health checks
echo "🏃 Step 4/5: Configuring Cloud Run health checks..."
gcloud run services update $SERVICE_NAME \
  --project=$PROJECT_ID \
  --region=$REGION \
  --min-instances=1 \
  --max-instances=10 \
  --cpu=1 \
  --memory=512Mi \
  --startup-cpu-boost \
  --no-cpu-throttling \
  --execution-environment=gen2 \
  --http2 \
  && echo "✅ Cloud Run service updated with health checks" \
  || echo "⚠️  Could not update Cloud Run service"

echo ""

# Step 5: Display monitoring URLs
echo "🎉 Step 5/5: Setup complete!"
echo ""
echo "📊 Monitoring Dashboard URLs:"
echo "   • Uptime Checks: https://console.cloud.google.com/monitoring/uptime?project=$PROJECT_ID"
echo "   • Alerts: https://console.cloud.google.com/monitoring/alerting?project=$PROJECT_ID"
echo "   • Logs: https://console.cloud.google.com/logs/query?project=$PROJECT_ID"
echo "   • Cloud Run: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME?project=$PROJECT_ID"
echo ""
echo "🔍 Test Your Monitoring:"
echo "   • Health endpoint: curl https://$DOMAIN/api/health"
echo "   • Main site: curl https://$DOMAIN"
echo ""
echo "📧 Alert Configuration:"
echo "   • Alerts will be sent to: $ALERT_EMAIL"
echo "   • Configure alert policies at: https://console.cloud.google.com/monitoring/alerting/policies?project=$PROJECT_ID"
echo ""
echo "📖 For more information, see: MONITORING_SETUP.md"
echo ""
echo "✨ Monitoring setup complete!"
