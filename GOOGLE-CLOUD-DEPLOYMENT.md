# 🚀 Google Cloud Deployment Guide

## Overview

This guide will help you deploy your NRI Wealth Partners website to **Google Cloud Run** - a fully managed serverless platform that's perfect for Next.js applications.

**Why Google Cloud Run?**
- ✅ Serverless - no server management
- ✅ Auto-scaling - handles traffic spikes automatically
- ✅ Pay per use - only charged when requests are served
- ✅ HTTPS by default - automatic SSL certificates
- ✅ Custom domains supported
- ✅ Integrated with Cloud Build for CI/CD
- ✅ Cost-effective for small to medium traffic

---

## 📋 Prerequisites

Before starting, ensure you have:

- [x] GitHub account with your code pushed
- [x] Google Cloud account (create at https://cloud.google.com)
- [x] Credit card for Google Cloud (free tier available)
- [x] Domain name (if using custom domain)
- [x] gcloud CLI installed (optional but recommended)

---

## 💰 Cost Estimate

**Google Cloud Run Pricing (Pay-as-you-go):**

**Free Tier (monthly):**
- 2 million requests
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds of compute time
- First 1 GiB of network egress

**After Free Tier:**
- $0.40 per million requests
- $0.00002400 per GB-second
- $0.00001000 per vCPU-second

**Estimated Monthly Cost for Small Business:**
- Traffic: 10,000 visits/month → ~$2-5/month
- Traffic: 50,000 visits/month → ~$10-20/month
- Traffic: 100,000 visits/month → ~$20-40/month

**Additional Costs:**
- Cloud Build: 120 build-minutes/day free, then $0.003/minute
- Container Registry: $0.026 per GB/month storage
- Cloud SQL (if added later): ~$7-25/month

---

## 🎯 Deployment Options

### **Option 1: Deploy via Google Cloud Console (Easiest)**
Best for: First-time deployment, testing
Time: 15-20 minutes

### **Option 2: Deploy via gcloud CLI (Recommended)**
Best for: Regular deployments, automation
Time: 10-15 minutes

### **Option 3: Automated CI/CD with GitHub Actions (Best)**
Best for: Production, automatic deployments on push
Time: 30-40 minutes setup, then automatic

We'll cover all three options below.

---

## 🚀 OPTION 1: Deploy via Cloud Console (Easiest)

### Step 1: Set Up Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Sign in with your Google account

2. **Create New Project**
   - Click project dropdown (top left)
   - Click "New Project"
   - Project name: `nri-wealth-partners`
   - Click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - [x] Cloud Run API
     - [x] Cloud Build API
     - [x] Container Registry API
     - [x] Secret Manager API (for environment variables)

4. **Set Up Billing**
   - Go to "Billing" in left menu
   - Link a billing account
   - Enable free tier if available

### Step 2: Build and Deploy

1. **Open Cloud Shell**
   - Click the terminal icon (top right of Cloud Console)
   - This opens a browser-based terminal

2. **Clone Your Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/nri-wealth-partners.git
   cd nri-wealth-partners
   ```

3. **Build for Production**
   ```bash
   # Install dependencies
   npm install

   # Build Next.js app
   npm run build
   ```

4. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy nri-wealth-partners \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 512Mi \
     --cpu 1 \
     --max-instances 10 \
     --port 3000
   ```

5. **Wait for Deployment**
   - Cloud Build will create a container automatically
   - Deployment takes 5-10 minutes first time
   - You'll see progress in Cloud Console

6. **Get Your URL**
   - After deployment completes, you'll see:
     ```
     Service URL: https://nri-wealth-partners-xxxxx-uc.a.run.app
     ```
   - Open this URL in your browser
   - Your site is live! 🎉

### Step 3: Configure Environment Variables (Optional)

If you have environment variables:

1. **Go to Cloud Run Services**
   - Cloud Console → Cloud Run → nri-wealth-partners

2. **Edit & Deploy New Revision**
   - Click "Edit & Deploy New Revision"
   - Go to "Variables & Secrets" tab
   - Add environment variables:
     - `NEXT_PUBLIC_SITE_URL`: Your production URL
     - `NEXT_PUBLIC_GOOGLE_ANALYTICS`: Your GA ID (if you have one)
     - Any API keys (use Secrets instead for sensitive data)

3. **Deploy**
   - Click "Deploy" at bottom

---

## 🔧 OPTION 2: Deploy via gcloud CLI (Recommended)

### Step 1: Install gcloud CLI

**On macOS:**
```bash
# Download and install
curl https://sdk.cloud.google.com | bash

# Restart your terminal, then initialize
gcloud init
```

**On Windows:**
- Download from: https://cloud.google.com/sdk/docs/install
- Run installer
- Open "Google Cloud SDK Shell"

**On Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### Step 2: Authenticate and Configure

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project nri-wealth-partners

# Set default region
gcloud config set run/region us-central1

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Create Deployment Configuration

Create `cloudbuild.yaml` in your project root (we'll do this in next section).

### Step 4: Deploy

```bash
# From your project directory
cd ~/Projects/NRIWealthPartners

# Deploy to Cloud Run
gcloud run deploy nri-wealth-partners \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --port 3000 \
  --timeout 300 \
  --concurrency 80
```

**Explanation of flags:**
- `--source .` - Deploy from current directory
- `--platform managed` - Use fully managed Cloud Run
- `--region us-central1` - Deploy to US Central region
- `--allow-unauthenticated` - Public website, no auth required
- `--memory 512Mi` - Allocate 512MB RAM (adjust as needed)
- `--cpu 1` - Use 1 CPU (can increase for better performance)
- `--max-instances 10` - Auto-scale up to 10 instances
- `--min-instances 0` - Scale down to 0 when no traffic (saves money)
- `--port 3000` - Next.js default port
- `--timeout 300` - 5-minute timeout for requests
- `--concurrency 80` - Handle 80 concurrent requests per instance

### Step 5: Verify Deployment

```bash
# Get service URL
gcloud run services describe nri-wealth-partners \
  --region us-central1 \
  --format 'value(status.url)'

# Test the deployment
curl -I https://nri-wealth-partners-xxxxx-uc.a.run.app
```

---

## 🤖 OPTION 3: Automated CI/CD with GitHub Actions (Best)

This sets up automatic deployment whenever you push to GitHub.

### Step 1: Set Up Service Account

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Get your project ID
export PROJECT_ID=$(gcloud config get-value project)

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

# Copy the contents of key.json (we'll use this in GitHub)
cat key.json
```

### Step 2: Add Secrets to GitHub

1. **Go to your GitHub repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add these secrets:**

   - **Name:** `GCP_PROJECT_ID`
     **Value:** Your Google Cloud project ID (e.g., `nri-wealth-partners`)

   - **Name:** `GCP_SA_KEY`
     **Value:** Paste entire contents of `key.json` file

   - **Name:** `GCP_REGION`
     **Value:** `us-central1`

5. **Delete the local key.json file** (security!)
   ```bash
   rm key.json
   ```

### Step 3: Create GitHub Actions Workflow

We'll create this file in the next section.

### Step 4: Push and Deploy

After creating the workflow file:

```bash
# Add the workflow file
git add .github/workflows/deploy.yml

# Commit
git commit -m "Add Google Cloud deployment workflow"

# Push to GitHub
git push origin main
```

**GitHub Actions will automatically:**
1. Detect the push
2. Run tests (if configured)
3. Build the Next.js app
4. Create Docker container
5. Push to Google Container Registry
6. Deploy to Cloud Run
7. Notify you of success/failure

**View deployment progress:**
- Go to your GitHub repository
- Click "Actions" tab
- Click on the latest workflow run

---

## 📁 Required Configuration Files

Now let's create all the necessary configuration files.

### File 1: `Dockerfile`

For containerizing your Next.js app:

```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build Next.js application
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### File 2: `.dockerignore`

Exclude unnecessary files from Docker build:

```
node_modules
.next
.git
.gitignore
README.md
*.md
.env*.local
.vscode
.idea
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.pem
```

### File 3: `cloudbuild.yaml`

For Google Cloud Build:

```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']

  # Build Next.js app
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']

  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/nri-wealth-partners:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/nri-wealth-partners:latest'
      - '.'

  # Push Docker image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/nri-wealth-partners:$SHORT_SHA'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'nri-wealth-partners'
      - '--image'
      - 'gcr.io/$PROJECT_ID/nri-wealth-partners:$SHORT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--max-instances'
      - '10'
      - '--min-instances'
      - '0'
      - '--port'
      - '3000'

images:
  - 'gcr.io/$PROJECT_ID/nri-wealth-partners:$SHORT_SHA'
  - 'gcr.io/$PROJECT_ID/nri-wealth-partners:latest'

timeout: '1200s'
```

### File 4: `.github/workflows/deploy.yml`

For automated GitHub Actions deployment:

```yaml
name: Deploy to Google Cloud Run

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: ${{ secrets.GCP_REGION }}
  SERVICE_NAME: nri-wealth-partners

jobs:
  deploy:
    name: Deploy to Cloud Run
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js app
        run: npm run build
        env:
          NEXT_TELEMETRY_DISABLED: 1

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker for GCR
        run: |
          gcloud auth configure-docker

      - name: Build Docker image
        run: |
          docker build -t gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:${{ github.sha }} \
                       -t gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:latest .

      - name: Push Docker image to GCR
        run: |
          docker push gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:${{ github.sha }}
          docker push gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:${{ github.sha }} \
            --region ${{ env.REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --memory 512Mi \
            --cpu 1 \
            --max-instances 10 \
            --min-instances 0 \
            --port 3000 \
            --timeout 300

      - name: Get service URL
        id: url
        run: |
          URL=$(gcloud run services describe ${{ env.SERVICE_NAME }} \
            --region ${{ env.REGION }} \
            --format 'value(status.url)')
          echo "url=$URL" >> $GITHUB_OUTPUT
          echo "Service deployed to: $URL"

      - name: Deployment summary
        run: |
          echo "## Deployment Successful! 🚀" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**Service URL:** ${{ steps.url.outputs.url }}" >> $GITHUB_STEP_SUMMARY
          echo "**Commit:** ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "**Region:** ${{ env.REGION }}" >> $GITHUB_STEP_SUMMARY
```

---

## 🔒 Environment Variables and Secrets

### Using Secret Manager (Recommended for Sensitive Data)

```bash
# Create secrets
echo -n "your-api-key-value" | gcloud secrets create API_KEY --data-file=-

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding API_KEY \
  --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update Cloud Run service to use secret
gcloud run services update nri-wealth-partners \
  --update-secrets=API_KEY=API_KEY:latest \
  --region us-central1
```

### Using Environment Variables

```bash
# Set environment variables
gcloud run services update nri-wealth-partners \
  --set-env-vars="NEXT_PUBLIC_SITE_URL=https://nriwealthpartners.com,NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" \
  --region us-central1
```

---

## 🌐 Custom Domain Setup

### Step 1: Verify Domain Ownership

1. **Go to Cloud Run Console**
2. **Click your service** → **Manage Custom Domains**
3. **Click "Add Mapping"**
4. **Select "Verify a new domain"**
5. **Follow verification steps** (add TXT record to your DNS)

### Step 2: Map Domain to Cloud Run

```bash
# Map your domain
gcloud run domain-mappings create \
  --service nri-wealth-partners \
  --domain nriwealthpartners.com \
  --region us-central1

# Map www subdomain
gcloud run domain-mappings create \
  --service nri-wealth-partners \
  --domain www.nriwealthpartners.com \
  --region us-central1
```

### Step 3: Update DNS Records

After mapping, you'll receive DNS records to add to your domain registrar:

**For Root Domain (nriwealthpartners.com):**
```
Type: A
Name: @
Value: 216.239.32.21
Value: 216.239.34.21
Value: 216.239.36.21
Value: 216.239.38.21

Type: AAAA
Name: @
Value: 2001:4860:4802:32::15
Value: 2001:4860:4802:34::15
Value: 2001:4860:4802:36::15
Value: 2001:4860:4802:38::15
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com.
```

**DNS Propagation:** Can take 24-48 hours, but usually faster (1-4 hours).

### Step 4: Enable HTTPS (Automatic)

Cloud Run automatically provisions SSL certificates for your custom domain. No action needed!

**Verify HTTPS:**
```bash
curl -I https://nriwealthpartners.com
# Should return 200 OK with SSL
```

---

## 📊 Monitoring and Logging

### View Logs

**Via Console:**
1. Go to Cloud Run → nri-wealth-partners
2. Click "Logs" tab
3. View real-time logs

**Via gcloud CLI:**
```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=nri-wealth-partners" \
  --limit 50 \
  --format="table(timestamp,severity,textPayload)"

# Tail logs in real-time
gcloud alpha logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=nri-wealth-partners"
```

### Set Up Monitoring Alerts

1. **Go to Cloud Console** → **Monitoring** → **Alerting**
2. **Create Policy**
3. **Add conditions:**
   - CPU utilization > 80%
   - Memory utilization > 80%
   - Request latency > 3 seconds
   - Error rate > 5%
4. **Set notification channels** (email, SMS, Slack)

### Metrics to Monitor

```bash
# Request count
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"' \
  --format="table(metric.type,metric.labels,points)"

# Request latencies
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_latencies"' \
  --format="table(metric.type,metric.labels,points)"
```

---

## 💰 Cost Optimization Tips

### 1. Right-Size Your Resources

```bash
# Start with smaller resources
gcloud run services update nri-wealth-partners \
  --memory 256Mi \
  --cpu 1 \
  --region us-central1

# Monitor and increase if needed
```

### 2. Set Min Instances to 0

```bash
# Scale down to zero when no traffic
gcloud run services update nri-wealth-partners \
  --min-instances 0 \
  --region us-central1
```

### 3. Optimize Cold Start (If Needed)

```bash
# Keep 1 instance warm for faster response
gcloud run services update nri-wealth-partners \
  --min-instances 1 \
  --region us-central1

# Note: This costs ~$7-10/month even with no traffic
```

### 4. Set Request Timeout

```bash
# Reduce timeout to avoid hanging requests
gcloud run services update nri-wealth-partners \
  --timeout 60 \
  --region us-central1
```

### 5. Enable Cloud CDN

```bash
# Cache static assets closer to users
gcloud compute backend-services update-backend \
  --enable-cdn \
  --global
```

### 6. Monitor Costs

- Set up budget alerts in Cloud Console
- Review Cloud Billing reports monthly
- Use Cloud Pricing Calculator: https://cloud.google.com/products/calculator

---

## 🔄 Update and Rollback

### Deploy New Version

```bash
# After making changes and committing to GitHub
cd ~/Projects/NRIWealthPartners

# Build and deploy
gcloud run deploy nri-wealth-partners \
  --source . \
  --region us-central1
```

### Rollback to Previous Version

```bash
# List revisions
gcloud run revisions list \
  --service nri-wealth-partners \
  --region us-central1

# Rollback to specific revision
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions nri-wealth-partners-00003-xyz=100 \
  --region us-central1
```

### Traffic Splitting (Blue-Green Deployment)

```bash
# Send 10% traffic to new revision, 90% to old
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions nri-wealth-partners-00004-abc=10,nri-wealth-partners-00003-xyz=90 \
  --region us-central1

# If new version looks good, switch 100%
gcloud run services update-traffic nri-wealth-partners \
  --to-latest \
  --region us-central1
```

---

## 🚨 Troubleshooting

### Issue: Build Fails with "Out of Memory"

**Solution:** Increase Cloud Build machine type
```yaml
# Add to cloudbuild.yaml
options:
  machineType: 'E2_HIGHCPU_8'
```

### Issue: Container Fails to Start

**Check logs:**
```bash
gcloud logging read "resource.type=cloud_run_revision" \
  --limit 50 \
  --format="table(timestamp,severity,textPayload)"
```

**Common causes:**
- Missing `next.config.js` configuration
- Environment variables not set
- Port mismatch (ensure listening on PORT env var)

**Fix in `next.config.js`:**
```javascript
module.exports = {
  output: 'standalone',
  // ... other config
}
```

### Issue: 502 Bad Gateway

**Causes:**
- Container startup timeout
- Application crash on startup
- Memory limit exceeded

**Solutions:**
```bash
# Increase memory
gcloud run services update nri-wealth-partners \
  --memory 1Gi \
  --region us-central1

# Increase timeout
gcloud run services update nri-wealth-partners \
  --timeout 300 \
  --region us-central1
```

### Issue: Custom Domain Not Working

**Check domain mapping status:**
```bash
gcloud run domain-mappings describe \
  --domain nriwealthpartners.com \
  --region us-central1
```

**Verify DNS:**
```bash
dig nriwealthpartners.com
nslookup nriwealthpartners.com
```

**Solution:** Wait for DNS propagation (up to 48 hours)

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Website loads correctly at Cloud Run URL
- [ ] All pages are accessible (Home, About, Services, etc.)
- [ ] Calculators work correctly
- [ ] Forms submit successfully
- [ ] Contact page functions
- [ ] Webinar registrations work
- [ ] Resources are downloadable
- [ ] Mobile responsive design works
- [ ] Custom domain is mapped (if applicable)
- [ ] HTTPS is working
- [ ] Monitoring alerts are set up
- [ ] Budget alerts are configured
- [ ] GitHub Actions workflow is running
- [ ] Environment variables are set
- [ ] Secrets are in Secret Manager (if applicable)

---

## 📚 Useful Commands Reference

### Service Management

```bash
# List all services
gcloud run services list

# Describe service
gcloud run services describe nri-wealth-partners --region us-central1

# Delete service
gcloud run services delete nri-wealth-partners --region us-central1

# View service URL
gcloud run services describe nri-wealth-partners \
  --region us-central1 \
  --format='value(status.url)'
```

### Revision Management

```bash
# List revisions
gcloud run revisions list --service nri-wealth-partners --region us-central1

# Delete old revisions
gcloud run revisions delete nri-wealth-partners-00001-abc --region us-central1
```

### Logs and Monitoring

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 100

# Export logs to BigQuery
gcloud logging sinks create cloud-run-logs \
  bigquery.googleapis.com/projects/PROJECT_ID/datasets/DATASET_ID
```

### IAM and Permissions

```bash
# List IAM policies
gcloud run services get-iam-policy nri-wealth-partners --region us-central1

# Make service public
gcloud run services add-iam-policy-binding nri-wealth-partners \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region us-central1
```

---

## 🔗 Useful Links

- **Cloud Run Documentation:** https://cloud.google.com/run/docs
- **Next.js Deployment Guide:** https://nextjs.org/docs/deployment
- **Cloud Build Documentation:** https://cloud.google.com/build/docs
- **GitHub Actions for GCP:** https://github.com/google-github-actions
- **Cloud Pricing Calculator:** https://cloud.google.com/products/calculator
- **Cloud Console:** https://console.cloud.google.com

---

## 📞 Need Help?

**Google Cloud Support:**
- Community support: https://www.googlecloudcommunity.com
- Stack Overflow: Tag questions with `google-cloud-run`
- Official documentation: https://cloud.google.com/run/docs

**Next.js Support:**
- Next.js Discord: https://nextjs.org/discord
- GitHub Discussions: https://github.com/vercel/next.js/discussions

---

## 🎉 You're Ready to Deploy!

Follow the steps in this guide to deploy your NRI Wealth Partners website to Google Cloud Run.

**Recommended Path for First-Time Deployment:**
1. Start with Option 1 (Cloud Console) to understand the process
2. Once comfortable, set up Option 3 (GitHub Actions) for automated deployments
3. Configure custom domain and monitoring
4. Set up budget alerts
5. Monitor performance and optimize as needed

**Questions?** Refer to the troubleshooting section or check the official documentation.

Good luck with your deployment! 🚀
