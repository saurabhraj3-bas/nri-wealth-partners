#!/bin/bash

# View Cloud Run Logs Script

export PATH="$HOME/google-cloud-sdk/bin:$PATH"

REGION=$(gcloud config get-value run/region 2>/dev/null)
if [ -z "$REGION" ]; then
    REGION="us-east1"
fi

echo "📋 Viewing logs for nri-wealth-partners..."
echo "Press Ctrl+C to stop"
echo ""

gcloud run services logs read nri-wealth-partners \
    --region $REGION \
    --limit 50 \
    --format "table(timestamp,textPayload)"
