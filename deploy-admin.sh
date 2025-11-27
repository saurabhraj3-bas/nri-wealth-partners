#!/bin/bash

# ===================================
# NRI Wealth Partners - Admin System Deployment
# Automated deployment script for production
# ===================================

set -e  # Exit on any error

echo "🚀 NRI Wealth Partners - Admin System Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="nriwealthpartners"
SERVICE_NAME="nriwealthpartners"
REGION="us-central1"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if gcloud is installed
print_info "Checking prerequisites..."
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI not found!"
    echo "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
print_success "gcloud CLI found"

# Check authentication
print_info "Checking Google Cloud authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    print_warning "Not authenticated with Google Cloud"
    echo ""
    echo "Please run the following command in your terminal:"
    echo ""
    echo "    gcloud auth login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -1)
print_success "Authenticated as: $ACTIVE_ACCOUNT"

# Set project
print_info "Setting Google Cloud project to: $PROJECT_ID"
if ! gcloud config set project $PROJECT_ID 2>&1; then
    print_error "Failed to set project. Do you have access to project: $PROJECT_ID?"
    echo ""
    echo "Available projects:"
    gcloud projects list 2>&1 || echo "Unable to list projects"
    exit 1
fi
print_success "Project set to: $PROJECT_ID"

# Check if Cloud Build trigger exists
print_info "Checking for Cloud Build triggers..."
TRIGGER_COUNT=$(gcloud builds triggers list --project=$PROJECT_ID --format="value(name)" 2>/dev/null | wc -l | tr -d ' ')

if [ "$TRIGGER_COUNT" -gt 0 ]; then
    print_success "Found $TRIGGER_COUNT Cloud Build trigger(s)"
    echo ""
    echo "You have automatic deployment triggers configured!"
    echo ""
    echo "Recent builds:"
    gcloud builds list --limit=3 --project=$PROJECT_ID 2>/dev/null || echo "Unable to fetch recent builds"
    echo ""
    read -p "Do you want to manually trigger a new build? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Triggering Cloud Build..."
        gcloud builds submit --config=cloudbuild.yaml --project=$PROJECT_ID
        exit 0
    else
        print_info "Skipping manual build trigger"
        echo ""
        echo "Your code was pushed to GitHub. If you have push triggers enabled,"
        echo "the deployment may have already started automatically."
        echo ""
        echo "Check build status at:"
        echo "https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
        echo ""
        read -p "Continue with direct deployment instead? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Deployment cancelled"
            exit 0
        fi
    fi
fi

echo ""
print_info "Proceeding with direct Cloud Run deployment..."
echo ""

# Confirm deployment
echo "📋 Deployment Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo ""
print_warning "This will deploy your admin system to production!"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled"
    exit 1
fi

echo ""
print_info "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed"

echo ""
print_info "Building application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed. Please check for errors above."
    exit 1
fi
print_success "Build completed successfully"

echo ""
print_info "Deploying to Google Cloud Run..."
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
  --timeout 300 \
  --project $PROJECT_ID

if [ $? -ne 0 ]; then
    print_error "Deployment failed"
    exit 1
fi

echo ""
print_success "Deployment successful!"
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --project=$PROJECT_ID \
  --format='value(status.url)' 2>/dev/null)

if [ ! -z "$SERVICE_URL" ]; then
    echo "=================================================="
    echo ""
    print_success "Your application is now live!"
    echo ""
    echo "🌐 Service URL: $SERVICE_URL"
    echo ""
    echo "📝 Important Next Steps:"
    echo ""
    echo "1. SET ENVIRONMENT VARIABLES (REQUIRED!):"
    echo "   Go to: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME?project=$PROJECT_ID"
    echo "   Click: Edit & Deploy New Revision → Variables & Secrets"
    echo ""
    echo "   Required variables:"
    echo "   - GMAIL_USER=saurabh@nriwealthpartners.com"
    echo "   - GMAIL_APP_PASSWORD=qmoowbypzhirolve"
    echo "   - CONTACT_EMAIL=saurabh@nriwealthpartners.com"
    echo "   - GOOGLE_AI_API_KEY=AIzaSyB2-kHpGgtNBOKl8nhhGfsRHdhKdVX2Yjc"
    echo "   - GOOGLE_SHEETS_ID=1DoxCClgmqk9gTqRus0mAireUy1OsMvOVQaPG-v72o9M"
    echo "   - GOOGLE_SHEETS_API_KEY=AIzaSyATn5vVDTqO24JFZ3IFU2xoT27BL_58hLs"
    echo ""
    echo "   Generate and add:"
    echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "   - NEXTAUTH_URL=$SERVICE_URL"
    echo "   - ADMIN_PASSWORD (create a strong password)"
    echo "   - NODE_ENV=production"
    echo ""
    echo "2. TEST YOUR DEPLOYMENT:"
    echo "   - Homepage: $SERVICE_URL/"
    echo "   - Admin Login: $SERVICE_URL/admin/login"
    echo "   - Admin Dashboard: $SERVICE_URL/admin"
    echo "   - Content Generator: $SERVICE_URL/admin/content-generator"
    echo ""
    echo "3. MONITOR LOGS:"
    echo "   gcloud run services logs tail $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
    echo ""
    echo "=================================================="
    echo ""

    # Generate NextAuth secret
    print_info "Generating NextAuth secret for you..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo ""
    echo "Your NEXTAUTH_SECRET (copy this):"
    echo "$NEXTAUTH_SECRET"
    echo ""

    # Open browser to service
    read -p "Open service in browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$SERVICE_URL" 2>/dev/null || echo "Please visit: $SERVICE_URL"
    fi

    # Open Cloud Run console
    read -p "Open Cloud Run console to set environment variables? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        CONSOLE_URL="https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME?project=$PROJECT_ID"
        open "$CONSOLE_URL" 2>/dev/null || echo "Please visit: $CONSOLE_URL"
    fi
fi

echo ""
print_success "Deployment complete!"
echo ""
print_warning "Don't forget to set environment variables in Cloud Run console!"
echo ""
