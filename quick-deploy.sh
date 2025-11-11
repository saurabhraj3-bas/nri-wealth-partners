#!/bin/bash

# Quick Deploy Script - For subsequent deployments after initial setup
# This assumes you've already run deploy.sh once

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Deploy to Google Cloud Run${NC}\n"

# Add gcloud to PATH
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

# Get project and region
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
REGION=$(gcloud config get-value run/region 2>/dev/null)

if [ -z "$REGION" ]; then
    REGION="us-east1"
fi

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Deploy
echo "Deploying..."
gcloud builds submit --config cloudbuild.yaml --quiet

# Get URL
SERVICE_URL=$(gcloud run services describe nri-wealth-partners --region $REGION --format='value(status.url)' 2>/dev/null)

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 URL: $SERVICE_URL"
echo ""
