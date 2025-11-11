# Google Cloud Run Deployment Guide

Complete guide to deploy NRI Wealth Partners website to Google Cloud Run.

## 📋 Prerequisites

- Google Cloud account (free tier available)
- Credit card for verification (won't be charged in free tier)
- Terminal access

## 🚀 One-Command Deployment

### First Time Deployment

```bash
cd ~/Projects/NRIWealthPartners
./deploy.sh
```

The script will:
1. ✅ Check if gcloud CLI is installed
2. ✅ Authenticate with Google Cloud
3. ✅ Set up project and enable APIs
4. ✅ Build and deploy your website
5. ✅ Give you a public URL

**Total time:** 5-10 minutes

---

## 📦 What You'll Get

After successful deployment:

- **Public URL:** `https://nri-wealth-partners-xxxxx-uc.a.run.app`
- **Free Tier:** 2 million requests/month
- **Auto-scaling:** Handles traffic spikes automatically
- **HTTPS:** SSL certificate included
- **Global CDN:** Fast loading worldwide

---

## 🔄 Subsequent Deployments

After first deployment, use quick deploy:

```bash
cd ~/Projects/NRIWealthPartners
./quick-deploy.sh
```

This is faster (2-3 minutes) for updates.

---

## 📝 Detailed Steps (Manual)

If you prefer manual control:

### Step 1: Authenticate

```bash
# Add gcloud to PATH
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

# Login (opens browser)
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Deploy

```bash
cd ~/Projects/NRIWealthPartners
gcloud builds submit --config cloudbuild.yaml
```

### Step 4: Get URL

```bash
gcloud run services describe nri-wealth-partners \
    --region us-east1 \
    --format='value(status.url)'
```

---

## ⚙️ Environment Variables

### View Current Variables

```bash
gcloud run services describe nri-wealth-partners \
    --region us-east1 \
    --format='value(spec.template.spec.containers[0].env)'
```

### Update Variables

Use the helper script:

```bash
./update-env.sh
```

Or manually:

```bash
gcloud run services update nri-wealth-partners \
    --region us-east1 \
    --set-env-vars="KEY1=value1,KEY2=value2"
```

### Important Variables

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-url.run.app
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
CONTACT_EMAIL=support@nriwealthpartners.com
```

---

## 📊 Monitoring

### View Logs

```bash
./view-logs.sh
```

Or manually:

```bash
gcloud run services logs read nri-wealth-partners \
    --region us-east1 \
    --limit 100
```

### View in Console

Open in browser:
```
https://console.cloud.google.com/run
```

---

## 🌐 Custom Domain Setup

### Step 1: Map Domain

```bash
gcloud run domain-mappings create \
    --service nri-wealth-partners \
    --domain www.nriwealthpartners.com \
    --region us-east1
```

### Step 2: Update DNS

Add these records to your domain DNS:

```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

### Step 3: Verify

Wait 5-15 minutes for DNS propagation, then visit:
```
https://www.nriwealthpartners.com
```

---

## 🔧 Useful Commands

### Service Management

```bash
# Describe service
gcloud run services describe nri-wealth-partners --region us-east1

# List all services
gcloud run services list

# Delete service
gcloud run services delete nri-wealth-partners --region us-east1

# Update traffic
gcloud run services update-traffic nri-wealth-partners --region us-east1 --to-latest
```

### Scaling Configuration

```bash
# Update scaling
gcloud run services update nri-wealth-partners \
    --region us-east1 \
    --min-instances 0 \
    --max-instances 10

# Update memory
gcloud run services update nri-wealth-partners \
    --region us-east1 \
    --memory 1Gi

# Update CPU
gcloud run services update nri-wealth-partners \
    --region us-east1 \
    --cpu 2
```

### Rollback

```bash
# List revisions
gcloud run revisions list --service nri-wealth-partners --region us-east1

# Rollback to previous revision
gcloud run services update-traffic nri-wealth-partners \
    --region us-east1 \
    --to-revisions REVISION_NAME=100
```

---

## 💰 Cost Management

### Free Tier Limits

- **Requests:** 2 million/month
- **Compute:** 360,000 GB-seconds/month
- **Bandwidth:** 1 GB/month (outbound to North America)

### Monitor Usage

```bash
# View billing
gcloud billing accounts list

# Check quotas
gcloud compute project-info describe --project YOUR_PROJECT_ID
```

### Cost Optimization Tips

1. **Use min-instances: 0** - Only pay when traffic comes
2. **Right-size memory** - Start with 512Mi, increase if needed
3. **Use CDN** - Reduce bandwidth costs
4. **Monitor logs** - Identify expensive operations

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds log $(gcloud builds list --limit 1 --format='value(id)')

# Manual Docker build
docker build -t test-image .
```

### Service Not Starting

```bash
# Check service logs
./view-logs.sh

# Check service status
gcloud run services describe nri-wealth-partners --region us-east1
```

### Can't Access Service

```bash
# Verify service is public
gcloud run services add-iam-policy-binding nri-wealth-partners \
    --region us-east1 \
    --member="allUsers" \
    --role="roles/run.invoker"
```

### Environment Variables Not Working

```bash
# List all env vars
gcloud run services describe nri-wealth-partners \
    --region us-east1 \
    --format='yaml(spec.template.spec.containers[0].env)'

# Update and redeploy
./quick-deploy.sh
```

---

## 🔒 Security Best Practices

1. **Use Secret Manager** for sensitive data:
```bash
# Create secret
echo -n "your-api-key" | gcloud secrets create resend-api-key --data-file=-

# Mount to service
gcloud run services update nri-wealth-partners \
    --region us-east1 \
    --set-secrets=RESEND_API_KEY=resend-api-key:latest
```

2. **Enable Cloud Armor** for DDoS protection
3. **Set up alerts** for unusual traffic
4. **Use service accounts** with minimal permissions

---

## 📱 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      - run: gcloud builds submit --config cloudbuild.yaml
```

---

## 📞 Support

### Google Cloud Support

- **Documentation:** https://cloud.google.com/run/docs
- **Support:** https://console.cloud.google.com/support
- **Community:** https://stackoverflow.com/questions/tagged/google-cloud-run

### Project Issues

- **GitHub:** (Add your repo URL)
- **Email:** support@nriwealthpartners.com
- **Phone:** +91 9974742626

---

## ✅ Deployment Checklist

Before going live:

- [ ] Test all pages locally
- [ ] Add team photos
- [ ] Update AMFI registration number
- [ ] Set up email API (Resend)
- [ ] Configure reCAPTCHA
- [ ] Set environment variables
- [ ] Test contact form
- [ ] Verify SEBI disclaimer
- [ ] Check mobile responsiveness
- [ ] Test all calculators
- [ ] Set up custom domain
- [ ] Configure Google Analytics
- [ ] Submit sitemap to Google
- [ ] Test from different locations
- [ ] Monitor first week traffic

---

## 🎉 Success Metrics

After deployment, monitor:

- **Uptime:** Should be 99.9%+
- **Response time:** < 500ms average
- **Error rate:** < 0.1%
- **User engagement:** Bounce rate < 50%
- **Conversions:** Form submissions

---

**Last Updated:** January 2025

For the latest updates, check: https://cloud.google.com/run/docs
