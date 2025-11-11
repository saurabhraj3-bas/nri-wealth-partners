#!/bin/bash

# Update Environment Variables Script

set -e

export PATH="$HOME/google-cloud-sdk/bin:$PATH"

REGION=$(gcloud config get-value run/region 2>/dev/null)
if [ -z "$REGION" ]; then
    REGION="us-east1"
fi

echo "🔧 Update Environment Variables"
echo ""
echo "Current environment variables:"
gcloud run services describe nri-wealth-partners --region $REGION --format='value(spec.template.spec.containers[0].env)'
echo ""

read -p "Enter new env vars (format: KEY1=value1,KEY2=value2): " ENV_VARS

if [ -n "$ENV_VARS" ]; then
    echo "Updating..."
    gcloud run services update nri-wealth-partners \
        --region $REGION \
        --set-env-vars "$ENV_VARS"
    echo "✅ Environment variables updated!"
else
    echo "No changes made."
fi
