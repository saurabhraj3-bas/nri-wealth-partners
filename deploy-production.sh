#!/bin/bash

# ===================================
# NRI Wealth Partners - Production Deployment Script
# ===================================

echo "🚀 Starting production deployment to Google Cloud Run..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found!"
    echo "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Configuration
PROJECT_ID="nriwealthpartners"  # Update if different
SERVICE_NAME="nriwealthpartners"
REGION="us-central1"  # Update if different

echo "📋 Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Service: $SERVICE_NAME"
echo "  Region: $REGION"
echo ""

# Confirm deployment
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🔐 Setting up Google Cloud project..."
gcloud config set project $PROJECT_ID

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo ""
echo "☁️  Deploying to Google Cloud Run..."
echo ""

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Cloud Run console:"
echo "   - Go to: https://console.cloud.google.com/run"
echo "   - Select service: $SERVICE_NAME"
echo "   - Edit & Deploy New Revision"
echo "   - Variables & Secrets tab"
echo "   - Add: GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_EMAIL, etc."
echo ""
echo "2. Test your production site"
echo "3. Monitor logs for any issues"
echo ""
echo "🌐 Your site should be live at the URL shown above!"
