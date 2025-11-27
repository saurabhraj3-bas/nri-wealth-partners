# Production Deployment Guide - Admin System

## ✅ Status: Code Pushed to GitHub

Your latest changes have been successfully pushed to `main` branch, including:
- AI Content Generator with Google Gemini support
- Complete admin system (Team Management, Webinars, Resources, Content Generator)
- Updated navigation and content strategy
- All environment configurations

---

## 🚀 Deployment Options

### Option 1: Automatic Deployment (Cloud Build Trigger)

If you already have a Cloud Build trigger set up (from previous "Test: Cloud Build automatic deployment" commit):

1. **Check Cloud Build Status**
   ```bash
   # Re-authenticate if needed
   gcloud auth login

   # Set correct project
   gcloud config set project nriwealthpartners

   # Check recent builds
   gcloud builds list --limit=5
   ```

2. **If Build is Running**
   - Monitor progress: https://console.cloud.google.com/cloud-build/builds
   - Deployment should complete automatically in ~5-10 minutes

3. **If No Build Triggered**
   - Go to: https://console.cloud.google.com/cloud-build/triggers
   - Click "RUN" on your trigger
   - Or proceed to Option 2 (Manual Deployment)

---

### Option 2: Manual Deployment (Recommended)

Use the deployment script included in your project:

```bash
# Run the production deployment script
./deploy-production.sh
```

This script will:
- ✅ Build the application
- ✅ Deploy to Google Cloud Run
- ✅ Configure service settings (512Mi memory, 0-10 instances)
- ⚠️ You'll need to set environment variables afterward

**Prerequisites:**
- `gcloud` CLI authenticated
- Access to `nriwealthpartners` GCP project
- Build passes locally (`npm run build`)

---

### Option 3: Cloud Build Manual Trigger

If you have Cloud Build configured but no automatic trigger:

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project nriwealthpartners

# Submit build using cloudbuild.yaml
gcloud builds submit --config=cloudbuild.yaml
```

---

## 🔐 Environment Variables for Production

After deployment, set these environment variables in Cloud Run:

### Required Variables

```bash
# Navigate to Cloud Run console
# https://console.cloud.google.com/run

# Select service: nriwealthpartners
# Click: Edit & Deploy New Revision
# Go to: Variables & Secrets tab
```

**Add these variables:**

```env
# Gmail SMTP
GMAIL_USER=saurabh@nriwealthpartners.com
GMAIL_APP_PASSWORD=qmoowbypzhirolve
CONTACT_EMAIL=saurabh@nriwealthpartners.com

# Google AI (for Chatbot + Content Generator)
GOOGLE_AI_API_KEY=AIzaSyB2-kHpGgtNBOKl8nhhGfsRHdhKdVX2Yjc

# Google Sheets (Optional)
GOOGLE_SHEETS_ID=1DoxCClgmqk9gTqRus0mAireUy1OsMvOVQaPG-v72o9M
GOOGLE_SHEETS_API_KEY=AIzaSyATn5vVDTqO24JFZ3IFU2xoT27BL_58hLs

# NextAuth (for Admin Authentication)
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-cloud-run-url.run.app

# Admin Password (Simple MVP auth)
ADMIN_PASSWORD=<your-secure-password>

# Firebase Admin (for Newsletter system - if using)
FIREBASE_ADMIN_KEY=<your-firebase-service-account-json>

# Production settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## 🔑 Generate NextAuth Secret

If you don't have a `NEXTAUTH_SECRET` yet:

```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET` in Cloud Run.

---

## 📋 Post-Deployment Checklist

After deployment completes:

### 1. Verify Deployment
```bash
# Get service URL
gcloud run services describe nriwealthpartners --region=us-central1 --format='value(status.url)'

# Or visit
https://console.cloud.google.com/run/detail/us-central1/nriwealthpartners
```

### 2. Test Public Pages
- [ ] Homepage: `https://your-url.run.app/`
- [ ] Services page: `https://your-url.run.app/services`
- [ ] Resources page: `https://your-url.run.app/resources`
- [ ] Newsletter page: `https://your-url.run.app/insights`
- [ ] News Feed page: `https://your-url.run.app/news`

### 3. Test Admin System
- [ ] Login page: `https://your-url.run.app/admin/login`
- [ ] Admin dashboard: `https://your-url.run.app/admin`
- [ ] Team management: `https://your-url.run.app/admin/team` (super admin only)
- [ ] Webinars: `https://your-url.run.app/admin/webinars`
- [ ] Resources: `https://your-url.run.app/admin/resources`
- [ ] **Content Generator**: `https://your-url.run.app/admin/content-generator`

### 4. Test AI Content Generator
1. Login to admin
2. Navigate to Content Generator
3. Select a topic (e.g., "NRI Tax Filing Guide 2025")
4. Customize options
5. Click "Generate Content"
6. Verify Google Gemini API is working
7. Download and review generated content

### 5. Monitor Logs
```bash
# Stream logs
gcloud run services logs tail nriwealthpartners --region=us-central1

# Or view in console
https://console.cloud.google.com/logs/query
```

### 6. Check for Errors
- [ ] No 500 errors in logs
- [ ] Environment variables loaded correctly
- [ ] API keys working (Google AI, Gmail)
- [ ] Authentication working
- [ ] AI generation working

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Check:**
- Run `npm run build` locally first
- Fix any TypeScript errors
- Ensure all dependencies are in `package.json`

### Issue: 500 Error on Admin Pages

**Likely cause:** Missing environment variables

**Fix:**
1. Go to Cloud Run console
2. Edit service → Variables & Secrets
3. Add all required variables listed above
4. Deploy new revision

### Issue: AI Content Generator Not Working

**Check:**
1. `GOOGLE_AI_API_KEY` is set in Cloud Run
2. API key is valid: https://aistudio.google.com/app/apikey
3. Check logs for API errors:
   ```bash
   gcloud run services logs tail nriwealthpartners --region=us-central1 | grep "Content generation"
   ```

### Issue: Authentication Fails

**Check:**
1. `NEXTAUTH_SECRET` is set
2. `NEXTAUTH_URL` matches your Cloud Run URL
3. `ADMIN_PASSWORD` is set
4. Clear browser cookies and try again

### Issue: Emails Not Sending

**Check:**
1. `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set
2. Gmail App Password is valid
3. Check logs for SMTP errors

---

## 🔄 Updating Production

For future updates:

1. **Make changes locally**
2. **Test thoroughly**: `npm run build && npm run dev`
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```
4. **Deploy** (choose one):
   - Wait for automatic Cloud Build trigger
   - Or run `./deploy-production.sh`
   - Or manually trigger Cloud Build

---

## 🌐 Custom Domain Setup (Optional)

To use a custom domain instead of `.run.app`:

1. **Verify domain ownership**
   ```bash
   gcloud domains verify nriwealthpartners.com
   ```

2. **Map domain to Cloud Run**
   ```bash
   gcloud run domain-mappings create \
     --service=nriwealthpartners \
     --domain=nriwealthpartners.com \
     --region=us-central1
   ```

3. **Update DNS records** (as shown in console)

4. **Update `NEXTAUTH_URL`** to use custom domain

---

## 📊 Monitoring & Analytics

### Cloud Run Metrics
- CPU utilization
- Memory usage
- Request count
- Latency
- Error rate

**View at:** https://console.cloud.google.com/run/detail/us-central1/nriwealthpartners/metrics

### Application Logs
```bash
# Recent errors
gcloud run services logs tail nriwealthpartners --region=us-central1 | grep ERROR

# AI generation activity
gcloud run services logs tail nriwealthpartners --region=us-central1 | grep "Content generation"

# Authentication attempts
gcloud run services logs tail nriwealthpartners --region=us-central1 | grep "auth"
```

---

## 💰 Cost Optimization

Current configuration:
- **Memory**: 512Mi
- **CPU**: 1
- **Min instances**: 0 (scales to zero when idle)
- **Max instances**: 10
- **Timeout**: 300s

**Expected costs:**
- Idle (no traffic): $0/month (scales to zero)
- Light usage: ~$5-10/month
- Moderate usage: ~$20-30/month

**Cost tips:**
- Keep min-instances at 0
- Monitor with budget alerts
- Use caching where possible

---

## 🎯 Next Steps

1. **Deploy to production** using one of the methods above
2. **Set environment variables** in Cloud Run
3. **Test all features** using the checklist
4. **Monitor logs** for any issues
5. **Set up custom domain** (optional)
6. **Configure Firebase** for newsletter system (if needed)
7. **Test AI Content Generator** thoroughly

---

## 📞 Support

If you encounter issues:

1. **Check logs**: `gcloud run services logs tail nriwealthpartners --region=us-central1`
2. **Review environment variables**: Cloud Run console → Variables & Secrets
3. **Test locally first**: `npm run build && npm run dev`
4. **Check service status**: https://console.cloud.google.com/run

---

## ✅ Pre-Deployment Verification

Before deploying, verify:

- [x] Code pushed to GitHub main branch
- [x] Local build successful (`npm run build`)
- [x] All features tested locally
- [x] Environment variables documented
- [ ] gcloud authenticated
- [ ] Correct GCP project selected
- [ ] Environment variables ready to set in Cloud Run

**You're ready to deploy!** 🚀

Choose your deployment method above and proceed.
