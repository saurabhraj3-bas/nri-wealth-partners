#!/bin/bash

# NRI Wealth Partners - Google Cloud Run Deployment Script
# This script automates the deployment process to Google Cloud Run

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

# Check if gcloud is installed
print_header "Checking Prerequisites"

if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not found in PATH"
    print_info "Adding gcloud to PATH..."
    export PATH="$HOME/google-cloud-sdk/bin:$PATH"

    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please run: curl https://sdk.cloud.google.com | bash"
        exit 1
    fi
fi

print_success "gcloud CLI found"

# Check if user is authenticated
print_info "Checking authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    print_warning "Not authenticated. Starting authentication..."
    gcloud auth login
fi

ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
print_success "Authenticated as: $ACCOUNT"

# Get or set project
print_header "Project Configuration"

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    print_warning "No project set. Please select or create a project."
    gcloud projects list
    echo ""
    read -p "Enter your project ID (or press Enter to create a new one): " PROJECT_INPUT

    if [ -z "$PROJECT_INPUT" ]; then
        read -p "Enter a name for your new project: " PROJECT_NAME
        PROJECT_ID="nri-wealth-$(date +%s)"
        print_info "Creating project: $PROJECT_ID"
        gcloud projects create $PROJECT_ID --name="$PROJECT_NAME"
    else
        PROJECT_ID=$PROJECT_INPUT
    fi

    gcloud config set project $PROJECT_ID
fi

print_success "Using project: $PROJECT_ID"

# Enable required APIs
print_header "Enabling Required APIs"

APIS=("cloudbuild.googleapis.com" "run.googleapis.com" "containerregistry.googleapis.com")

for API in "${APIS[@]}"; do
    print_info "Enabling $API..."
    gcloud services enable $API --quiet
done

print_success "All required APIs enabled"

# Set default region
print_header "Region Configuration"

REGION=$(gcloud config get-value run/region 2>/dev/null)

if [ -z "$REGION" ] || [ "$REGION" = "(unset)" ]; then
    print_info "Setting default region to us-east1..."
    gcloud config set run/region us-east1
    REGION="us-east1"
fi

print_success "Using region: $REGION"

# Confirm deployment
print_header "Deployment Summary"

echo "Project ID:    $PROJECT_ID"
echo "Region:        $REGION"
echo "Service Name:  nri-wealth-partners"
echo "Image:         gcr.io/$PROJECT_ID/nri-wealth-partners"
echo ""

read -p "Do you want to proceed with deployment? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Build and deploy
print_header "Building and Deploying"

print_info "This will take 5-10 minutes. Please wait..."
echo ""

# Check if cloudbuild.yaml exists
if [ ! -f "cloudbuild.yaml" ]; then
    print_error "cloudbuild.yaml not found. Are you in the project directory?"
    exit 1
fi

# Submit build
print_info "Submitting build to Cloud Build..."
if gcloud builds submit --config cloudbuild.yaml --quiet; then
    print_success "Build and deployment completed successfully!"
else
    print_error "Build failed. Trying alternative deployment method..."

    # Alternative: Manual Docker build
    print_info "Building Docker image locally..."
    docker build -t gcr.io/$PROJECT_ID/nri-wealth-partners .

    print_info "Pushing image to Container Registry..."
    docker push gcr.io/$PROJECT_ID/nri-wealth-partners

    print_info "Deploying to Cloud Run..."
    gcloud run deploy nri-wealth-partners \
        --image gcr.io/$PROJECT_ID/nri-wealth-partners \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 3000 \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --set-env-vars NODE_ENV=production \
        --quiet

    print_success "Deployment completed!"
fi

# Get service URL
print_header "Deployment Complete!"

SERVICE_URL=$(gcloud run services describe nri-wealth-partners --region $REGION --format='value(status.url)' 2>/dev/null)

if [ -n "$SERVICE_URL" ]; then
    print_success "Your website is now live!"
    echo ""
    echo "🌐 Public URL: $SERVICE_URL"
    echo ""
    print_info "Share this URL with your stakeholders!"

    # Save URL to file
    echo $SERVICE_URL > deployment-url.txt
    print_success "URL saved to deployment-url.txt"
else
    print_error "Could not retrieve service URL. Please check manually:"
    echo "gcloud run services describe nri-wealth-partners --region $REGION"
fi

# Optional: Set environment variables
print_header "Environment Variables"

read -p "Do you want to set production environment variables now? (y/n): " SET_ENV

if [ "$SET_ENV" = "y" ] || [ "$SET_ENV" = "Y" ]; then
    echo ""
    echo "Available environment variables (leave empty to skip):"
    echo ""

    read -p "RESEND_API_KEY: " RESEND_KEY
    read -p "NEXT_PUBLIC_RECAPTCHA_SITE_KEY: " RECAPTCHA_SITE
    read -p "RECAPTCHA_SECRET_KEY: " RECAPTCHA_SECRET
    read -p "CONTACT_EMAIL: " CONTACT_EMAIL

    ENV_VARS="NODE_ENV=production,NEXT_PUBLIC_APP_URL=$SERVICE_URL"

    [ -n "$RESEND_KEY" ] && ENV_VARS="$ENV_VARS,RESEND_API_KEY=$RESEND_KEY"
    [ -n "$RECAPTCHA_SITE" ] && ENV_VARS="$ENV_VARS,NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$RECAPTCHA_SITE"
    [ -n "$RECAPTCHA_SECRET" ] && ENV_VARS="$ENV_VARS,RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET"
    [ -n "$CONTACT_EMAIL" ] && ENV_VARS="$ENV_VARS,CONTACT_EMAIL=$CONTACT_EMAIL"

    print_info "Updating environment variables..."
    gcloud run services update nri-wealth-partners \
        --region $REGION \
        --set-env-vars "$ENV_VARS" \
        --quiet

    print_success "Environment variables updated!"
fi

# Display helpful commands
print_header "Useful Commands"

echo "View logs:"
echo "  gcloud run services logs read nri-wealth-partners --region $REGION"
echo ""
echo "Update service:"
echo "  gcloud run services update nri-wealth-partners --region $REGION"
echo ""
echo "Delete service:"
echo "  gcloud run services delete nri-wealth-partners --region $REGION"
echo ""
echo "View in console:"
echo "  https://console.cloud.google.com/run/detail/$REGION/nri-wealth-partners"
echo ""

print_success "Deployment script completed! 🚀"
echo ""
