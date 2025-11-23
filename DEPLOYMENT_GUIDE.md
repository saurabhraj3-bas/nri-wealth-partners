# Deployment Guide - Local & Production

This guide will help you deploy the NRI Wealth Partners website for testing (locally) and production (Google Cloud Run).

---

## Quick Start

### Local Deployment (For Testing)
```bash
chmod +x deploy-local.sh
./deploy-local.sh
```

### Production Deployment (Live Site)
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

---

## Part 1: Local Deployment (30 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Terminal/Command Prompt access

### Step 1: Setup Environment Variables (10 minutes)

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your actual values:
   ```bash
   # Use any text editor
   nano .env.local
   # or
   code .env.local  # If using VS Code
   ```

3. **Minimum configuration for testing** (without email):
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   CONTACT_EMAIL=test@example.com
   ```

4. **With email enabled** (recommended):
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development

   # Gmail Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-password
   CONTACT_EMAIL=your-email@gmail.com
   ```

### Step 2: Install Dependencies (5 minutes)

```bash
npm install
```

If you see any errors, try:
```bash
npm install --legacy-peer-deps
```

### Step 3: Build the Application (5 minutes)

```bash
npm run build
```

This checks for any errors before running.

### Step 4: Start Development Server (2 minutes)

**Option A: Using the deployment script (recommended):**
```bash
chmod +x deploy-local.sh
./deploy-local.sh
```

**Option B: Manual start:**
```bash
npm run dev
```

### Step 5: Access Your Local Site

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the website!

### Step 6: Test Features

Test these features:
- ✅ Homepage loads
- ✅ All sections display correctly
- ✅ Navigation works
- ✅ Contact form (if email configured)
- ✅ Webinars page
- ✅ Services page
- ✅ About Us page
- ✅ WhatsApp button appears
- ✅ Chatbot widget (if Dialogflow configured)

### Sharing with Team for Testing

**Option 1: Local Network Access**

Your team on the same network can access via your IP:

1. Find your local IP:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet "

   # On Windows
   ipconfig
   ```

2. Look for something like: `192.168.1.100`

3. Share with team: `http://192.168.1.100:3000`

**Option 2: Ngrok (Internet Access)**

1. Install ngrok: https://ngrok.com/download

2. Run:
   ```bash
   ngrok http 3000
   ```

3. Share the URL it provides (e.g., `https://abc123.ngrok.io`)

**Option 3: Deploy to Cloud Run (Next section)**

---

## Part 2: Production Deployment (30 minutes)

### Prerequisites
- Google Cloud account
- gcloud CLI installed
- Project access to NRIWealthPartners

### Step 1: Install Google Cloud SDK (if not already installed)

**Mac/Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**Verify installation:**
```bash
gcloud --version
```

### Step 2: Authenticate and Setup Project (5 minutes)

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project nriwealthpartners

# Verify
gcloud config list
```

### Step 3: Configure Environment Variables for Production (10 minutes)

You have two options:

#### Option A: Using gcloud CLI

```bash
gcloud run services update nriwealthpartners \
  --region us-central1 \
  --update-env-vars \
GMAIL_USER=support@nriwealthpartners.com,\
GMAIL_APP_PASSWORD=your-app-password,\
CONTACT_EMAIL=support@nriwealthpartners.com,\
NEXT_PUBLIC_APP_URL=https://nriwealthpartners.com
```

#### Option B: Using Google Cloud Console (Easier)

1. Go to: https://console.cloud.google.com/run
2. Select project: **nriwealthpartners**
3. Click on service: **nriwealthpartners**
4. Click **Edit & Deploy New Revision** (top)
5. Go to **Variables & Secrets** tab
6. Click **Add Variable** for each:

   | Name | Value |
   |------|-------|
   | `GMAIL_USER` | `support@nriwealthpartners.com` |
   | `GMAIL_APP_PASSWORD` | `your-16-digit-password` |
   | `CONTACT_EMAIL` | `support@nriwealthpartners.com` |
   | `NEXT_PUBLIC_APP_URL` | `https://nriwealthpartners.com` |
   | `NEXT_PUBLIC_DIALOGFLOW_AGENT_ID` | `your-agent-id` (optional) |

7. Click **Deploy** (bottom)
8. Wait for deployment (~3 minutes)

### Step 4: Deploy Using Script (10 minutes)

**Make script executable:**
```bash
chmod +x deploy-production.sh
```

**Run deployment:**
```bash
./deploy-production.sh
```

**Or deploy manually:**
```bash
# Build
npm run build

# Deploy
gcloud run deploy nriwealthpartners \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi
```

### Step 5: Verify Deployment (5 minutes)

1. **Get your URL:**
   ```bash
   gcloud run services describe nriwealthpartners \
     --region us-central1 \
     --format 'value(status.url)'
   ```

2. **Open in browser** and test:
   - ✅ Site loads
   - ✅ All pages work
   - ✅ Contact form works
   - ✅ Images display
   - ✅ No console errors

3. **Check logs:**
   ```bash
   gcloud run services logs read nriwealthpartners \
     --region us-central1 \
     --limit 50
   ```

### Step 6: Update DNS (if needed)

If you want to use your custom domain (nriwealthpartners.com):

1. Go to Cloud Run console
2. Click on your service
3. Click **Manage Custom Domains**
4. Follow the prompts to add your domain
5. Update DNS records as instructed

---

## Part 3: Post-Deployment Testing

### Testing Checklist

**On Local (http://localhost:3000):**
- [ ] Homepage loads correctly
- [ ] All new sections appear (compliance, family office, products, success stories)
- [ ] Services page shows new services (Moving Back, AIFs, Family Office)
- [ ] About Us page shows Vision before Mission
- [ ] Team section has updated description
- [ ] Resources page shows NRI Tax Guide
- [ ] Contact form submits (check for emails)
- [ ] Webinar registration works
- [ ] WhatsApp button appears and links work
- [ ] Navigation menu works
- [ ] Footer links work
- [ ] Mobile responsive design works

**On Production (your live URL):**
- [ ] Repeat all tests above
- [ ] Check that environment variables are set
- [ ] Verify emails are being sent
- [ ] Test from different devices
- [ ] Test from different browsers
- [ ] Check page load speed
- [ ] Verify SSL certificate works (https)

### Team Testing Instructions

Share these with your team:

**Local Testing URL:**
```
http://localhost:3000
or
http://YOUR-IP-ADDRESS:3000
or
https://your-ngrok-url.ngrok.io (if using ngrok)
```

**Production Testing URL:**
```
https://nriwealthpartners.com
or
https://nriwealthpartners-xxxxx-uc.a.run.app (Cloud Run URL)
```

**What to Test:**
1. Browse all pages
2. Submit contact form
3. Register for a webinar
4. Click WhatsApp button
5. Try chatbot (if configured)
6. Test on mobile phone
7. Report any issues

---

## Troubleshooting

### Local Deployment Issues

**Problem: "npm install" fails**
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or clear cache
npm cache clean --force
npm install
```

**Problem: "Port 3000 already in use"**
```bash
# Kill process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

**Problem: Build fails**
```bash
# Check for TypeScript errors
npm run build

# Check the error message and fix the issue
# Then rebuild
```

**Problem: Environment variables not loading**
- Ensure file is named `.env.local` (with the dot)
- File must be in project root
- Restart server after changes
- Check for typos in variable names

### Production Deployment Issues

**Problem: "gcloud: command not found"**
- Install Google Cloud SDK
- Restart terminal after installation
- Verify: `gcloud --version`

**Problem: "Permission denied"**
```bash
# Login again
gcloud auth login

# Check you have correct permissions
gcloud projects get-iam-policy nriwealthpartners
```

**Problem: "Deployment failed"**
- Check build succeeded locally first
- Review error message carefully
- Check Cloud Run quotas
- Verify project billing is enabled

**Problem: "Site loads but emails don't work"**
- Check environment variables are set in Cloud Run
- View logs: `gcloud run services logs read nriwealthpartners`
- Verify email credentials are correct
- Check spam folder

**Problem: "404 errors on some pages"**
- Ensure build completed successfully
- Check Next.js configuration
- Verify all page files are committed to git
- Redeploy

### Getting Help

**Check Logs:**
```bash
# Local logs
Check terminal output

# Production logs
gcloud run services logs read nriwealthpartners --limit 100
```

**Common Log Locations:**
- Browser Console: F12 → Console tab
- Server logs: Terminal output
- Cloud Run logs: Google Cloud Console → Cloud Run → Logs

---

## Environment Variables Reference

### Required for Basic Functionality
```env
CONTACT_EMAIL=support@nriwealthpartners.com
```

### For Email Functionality
```env
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### For Chatbot
```env
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=your-agent-id
```

### For Analytics
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### All Together (Production)
```env
# Email
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
CONTACT_EMAIL=support@nriwealthpartners.com

# Chatbot (optional)
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=your-agent-id

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App URL
NEXT_PUBLIC_APP_URL=https://nriwealthpartners.com
```

---

## Quick Commands Reference

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start
```

### Production Deployment
```bash
# Deploy to Cloud Run
gcloud run deploy nriwealthpartners --source .

# View logs
gcloud run services logs read nriwealthpartners

# Describe service
gcloud run services describe nriwealthpartners

# List all services
gcloud run services list

# Update environment variables
gcloud run services update nriwealthpartners \
  --update-env-vars KEY=VALUE
```

---

## Maintenance

### Updating the Site

1. Make changes locally
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `./deploy-production.sh`

### Monitoring

**Check site health:**
- https://console.cloud.google.com/run
- View metrics, logs, and errors

**Set up alerts:**
- Cloud Monitoring → Alerting
- Create alerts for errors, downtime, etc.

### Backups

Your code is backed up in git. For database (if added later):
- Set up automated backups
- Export data regularly

---

## Success Criteria

✅ **Local deployment successful when:**
- Server starts without errors
- All pages load correctly
- New features visible
- No console errors

✅ **Production deployment successful when:**
- Build completes without errors
- Site accessible at production URL
- All features work
- Emails being sent (if configured)
- Team can access and test

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Configure email (if not done)
3. ✅ Set up Dialogflow chatbot (optional)
4. ✅ Enable Google Analytics (optional)
5. ✅ Monitor logs for first 24 hours
6. ✅ Get team feedback
7. ✅ Make any necessary adjustments

---

You're ready to deploy! Start with local deployment to test, then deploy to production when ready. 🚀
