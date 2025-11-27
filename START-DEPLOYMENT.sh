#!/bin/bash

echo "🚀 Starting NRI Wealth Partners Admin Deployment"
echo "================================================"
echo ""
echo "Step 1: Authenticate with Google Cloud"
echo "---------------------------------------"
echo "Running: gcloud auth login"
echo ""

gcloud auth login

if [ $? -ne 0 ]; then
    echo "❌ Authentication failed"
    exit 1
fi

echo ""
echo "✅ Authentication successful!"
echo ""
echo "Step 2: Running deployment script"
echo "----------------------------------"
echo ""

# Run the main deployment script
./deploy-admin.sh
