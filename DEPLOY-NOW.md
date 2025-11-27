# 🚀 Quick Deployment Commands

## Step 1: Authenticate (One-time setup)

```bash
# Login to Google Cloud
gcloud auth login

# Set the correct project
gcloud config set project nriwealthpartners

# Verify you're authenticated
gcloud config get-value project
```

---

## Step 2: Deploy to Production

```bash
# Navigate to project directory
cd /Users/jyotikumari/Projects/NRIWealthPartners

# Run the deployment script
./deploy-production.sh
```

**When prompted, type `y` to confirm deployment**

---

## Step 3: Set Environment Variables

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

**Copy the output** - you'll need it in the next step.

### Add Variables in Cloud Run Console

1. **Go to Cloud Run Console:**
   ```
   https://console.cloud.google.com/run/detail/us-central1/nriwealthpartners
   ```

2. **Click:** Edit & Deploy New Revision

3. **Go to:** Variables & Secrets tab

4. **Add these variables:**

```
GMAIL_USER=saurabh@nriwealthpartners.com
GMAIL_APP_PASSWORD=qmoowbypzhirolve
CONTACT_EMAIL=saurabh@nriwealthpartners.com
GOOGLE_AI_API_KEY=AIzaSyB2-kHpGgtNBOKl8nhhGfsRHdhKdVX2Yjc
GOOGLE_SHEETS_ID=1DoxCClgmqk9gTqRus0mAireUy1OsMvOVQaPG-v72o9M
GOOGLE_SHEETS_API_KEY=AIzaSyATn5vVDTqO24JFZ3IFU2xoT27BL_58hLs
NEXTAUTH_SECRET=<paste-generated-secret-from-above>
NEXTAUTH_URL=https://nriwealthpartners-<hash>.run.app
ADMIN_PASSWORD=<create-strong-password>
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

5. **Click:** Deploy

---

## Step 4: Get Your Production URL

```bash
gcloud run services describe nriwealthpartners \
  --region=us-central1 \
  --format='value(status.url)'
```

**Copy this URL** and update `NEXTAUTH_URL` in Cloud Run variables.

---

## Step 5: Test Your Deployment

Replace `<YOUR-URL>` with your Cloud Run URL from Step 4:

```bash
# Test homepage
curl -I <YOUR-URL>/

# Test admin login page
curl -I <YOUR-URL>/admin/login

# Open in browser
open <YOUR-URL>/
open <YOUR-URL>/admin
```

### Manual Testing Checklist

- [ ] Homepage loads
- [ ] Services page works
- [ ] Resources page works
- [ ] Newsletter page works
- [ ] News Feed page works
- [ ] Admin login page loads
- [ ] Can login to admin with password
- [ ] Admin dashboard shows all cards
- [ ] Content Generator loads
- [ ] Can generate content with AI
- [ ] Chatbot works on homepage

---

## Step 6: Monitor Deployment

```bash
# Watch logs in real-time
gcloud run services logs tail nriwealthpartners --region=us-central1

# Or view in console
# https://console.cloud.google.com/logs/query
```

---

## 🔧 Troubleshooting

### If deployment fails:

```bash
# Check build locally first
npm run build

# If build succeeds locally, try deployment again
./deploy-production.sh
```

### If admin pages show 500 error:

**Missing environment variables!**

Go to Cloud Run console → Edit & Deploy → Variables & Secrets → Add all variables from Step 3

### If AI Content Generator doesn't work:

Check logs for errors:
```bash
gcloud run services logs tail nriwealthpartners --region=us-central1 | grep -i "error"
```

Verify `GOOGLE_AI_API_KEY` is set in Cloud Run.

### Get service details:

```bash
gcloud run services describe nriwealthpartners --region=us-central1
```

---

## 📊 Monitor Your Service

```bash
# Get service URL
gcloud run services describe nriwealthpartners --region=us-central1 --format='value(status.url)'

# View metrics
# https://console.cloud.google.com/run/detail/us-central1/nriwealthpartners/metrics

# Stream logs
gcloud run services logs tail nriwealthpartners --region=us-central1

# Check recent errors
gcloud run services logs read nriwealthpartners --region=us-central1 --limit=50 | grep ERROR
```

---

## 🎯 Quick Admin Access

After deployment is complete:

1. **Get your URL:** Run the command from Step 4
2. **Visit:** `https://<your-url>/admin/login`
3. **Login with:** Password you set in `ADMIN_PASSWORD`
4. **Start using:**
   - Team Management
   - Webinar Management
   - Resource Management
   - AI Content Generator

---

## ✅ That's It!

Your admin system with AI Content Generator is now live in production!

**Features deployed:**
- ✅ Complete admin dashboard
- ✅ Team management (super admin)
- ✅ Webinar management
- ✅ Resource management
- ✅ AI Content Generator (20+ topics, Google Gemini powered)
- ✅ All public pages (homepage, services, resources, newsletter, news)
- ✅ AI Chatbot

**Next steps:**
1. Login to admin
2. Test AI Content Generator
3. Generate your first PDF guide
4. Use for digital marketing strategy execution

---

## 📞 Need Help?

Check full documentation: `PRODUCTION_DEPLOYMENT_GUIDE.md`

Common issues:
- Auth errors → Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
- 500 errors → Set all environment variables
- AI not working → Verify `GOOGLE_AI_API_KEY`
