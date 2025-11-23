# Email Configuration - Complete Step-by-Step Guide

## What This Enables

After completing this setup, your website will automatically send:
- ✅ Contact form confirmation emails to visitors
- ✅ Notification emails to your team when someone contacts you
- ✅ Webinar registration confirmation emails
- ✅ Webinar registration notifications to admin

---

## Option 1: Gmail (Quickest - 10 minutes)

Use this if you want to get started quickly.

### Step 1: Enable 2-Factor Authentication (3 minutes)

1. Open your browser
2. Go to: https://myaccount.google.com/
3. Sign in with the Gmail account you want to use (e.g., support@nriwealthpartners.com)
4. Click **Security** in the left sidebar
5. Scroll to "How you sign in to Google"
6. Click **2-Step Verification**
7. Click **Get Started**
8. Follow the prompts:
   - Enter your password
   - Add your phone number
   - Choose text message or phone call
   - Enter verification code
   - Click **Turn On**

### Step 2: Create App Password (3 minutes)

1. Stay on the Google Account page
2. Click **Security** (if not already there)
3. Under "How you sign in to Google", find **App passwords**
   - If you don't see it, make sure 2-Step Verification is ON
4. Click **App passwords**
5. You may need to sign in again
6. At the bottom dropdown:
   - **Select app**: Choose "Mail"
   - **Select device**: Choose "Other (Custom name)"
   - Type: `NRI Wealth Partners Website`
7. Click **Generate**
8. **IMPORTANT**: You'll see a 16-character password like:
   ```
   abcd efgh ijkl mnop
   ```
9. **Copy this password** (you won't see it again!)
10. Remove the spaces, so it becomes:
   ```
   abcdefghijklmnop
   ```
11. Save this somewhere safe temporarily

### Step 3: Configure Your Website (2 minutes)

1. Open your project folder on your computer
2. Look for a file called `.env.local` in the root folder
   - If it doesn't exist, create a new file named exactly: `.env.local`
3. Open `.env.local` in a text editor
4. Add these lines (replace with your actual values):

```env
# Gmail Email Configuration
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Where you want to receive contact form submissions
CONTACT_EMAIL=support@nriwealthpartners.com
```

**Important Notes:**
- Replace `support@nriwealthpartners.com` with your actual Gmail address
- Replace `abcdefghijklmnop` with your actual app password (no spaces!)
- Make sure there are no extra spaces before or after the `=` sign
- Make sure the file is named `.env.local` (starts with a dot)

5. Save the file

### Step 4: Restart Your Server (1 minute)

1. If your development server is running, stop it:
   - Press `Ctrl+C` in the terminal
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 5: Test Email Functionality (2 minutes)

1. Open your browser
2. Go to: http://localhost:3000/contact
3. Fill out the contact form with:
   - Your real email address
   - Test name and message
4. Click Submit
5. Check TWO places:
   - ✅ Your personal email (should receive "Thank you for contacting us")
   - ✅ Your support email (should receive "New Contact Form Submission")

**If emails arrive**: ✅ Success! You're done with Gmail setup!

**If emails don't arrive**: See Troubleshooting section below

---

## Option 2: Resend (Better for Production - 20 minutes)

Use this for better deliverability and professional setup.

### Step 1: Create Resend Account (3 minutes)

1. Go to: https://resend.com
2. Click **Sign Up** (top right)
3. Fill in:
   - Your name
   - Email: support@nriwealthpartners.com
   - Password (create a strong one)
4. Click **Create Account**
5. Check your email for verification link
6. Click the verification link

### Step 2: Add Your Domain (5 minutes)

1. Log in to Resend dashboard: https://resend.com/domains
2. Click **Add Domain**
3. Enter: `nriwealthpartners.com`
4. Click **Add**
5. You'll see a screen with DNS records to add

### Step 3: Configure DNS Records (7 minutes)

You need to add these records to your domain. You'll do this in **Google Cloud DNS** (since you're using Google Cloud):

#### A. Open Google Cloud DNS:
1. Go to: https://console.cloud.google.com/net-services/dns
2. Select your project
3. Find your domain zone: `nriwealthpartners.com`
4. Click on it

#### B. Add SPF Record:
1. Click **Add Record Set**
2. Fill in:
   - **DNS Name**: Leave blank (or `@`)
   - **Resource Record Type**: `TXT`
   - **TTL**: `300`
   - **TTL Unit**: `seconds`
   - **TXT data**: `v=spf1 include:_spf.resend.com ~all`
3. Click **Create**

#### C. Add DKIM Records:
Resend will show you DKIM records (usually 3 of them). For each one:

1. Click **Add Record Set**
2. Fill in:
   - **DNS Name**: (copy from Resend, e.g., `resend._domainkey`)
   - **Resource Record Type**: `TXT`
   - **TTL**: `300`
   - **TXT data**: (copy the long value from Resend)
3. Click **Create**
4. Repeat for each DKIM record

#### D. Add DMARC Record:
1. Click **Add Record Set**
2. Fill in:
   - **DNS Name**: `_dmarc`
   - **Resource Record Type**: `TXT`
   - **TTL**: `300`
   - **TXT data**: `v=DMARC1; p=none; rua=mailto:dmarc@nriwealthpartners.com`
3. Click **Create**

#### E. Wait for DNS Propagation (5-30 minutes):
1. Go back to Resend dashboard
2. It should show "Verifying..." on your domain
3. Wait 5-30 minutes for DNS to propagate
4. Refresh the page
5. It should show ✅ **Verified**

### Step 4: Get API Key (2 minutes)

1. In Resend dashboard, click **API Keys** (left sidebar)
2. Click **Create API Key**
3. Fill in:
   - **Name**: `NRI Wealth Partners Website`
   - **Permission**: Full Access (default)
4. Click **Add**
5. **IMPORTANT**: Copy the API key (starts with `re_`)
   - You'll only see this once!
   - Example: `re_123abc456def789ghi`
6. Save it somewhere safe

### Step 5: Configure Your Website (2 minutes)

1. Open `.env.local` file in your project
2. Add these lines:

```env
# Resend Email Configuration
RESEND_API_KEY=re_123abc456def789ghi

# Gmail (Backup - Optional but recommended)
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Contact Email
CONTACT_EMAIL=support@nriwealthpartners.com
```

3. Save the file

### Step 6: Update Email Sender (1 minute)

Once your domain is verified, update the "from" email in the code:

**File: `/app/api/contact/route.ts`**
- Find line that says: `from: "NRI Wealth Partners <noreply@nriwealthpartners.com>"`
- Make sure it uses your verified domain

**File: `/app/api/webinar-registration/route.ts`**
- Same change

(The code already uses this, so you might not need to change anything!)

### Step 7: Test (2 minutes)

1. Restart your server
2. Go to: http://localhost:3000/contact
3. Submit a test form
4. Check emails arrive

---

## Production Deployment

### For Google Cloud Run:

#### Option A: Using Command Line
```bash
gcloud run services update nriwealthpartners \
  --update-env-vars GMAIL_USER=support@nriwealthpartners.com,GMAIL_APP_PASSWORD=your-app-password,CONTACT_EMAIL=support@nriwealthpartners.com
```

For Resend:
```bash
gcloud run services update nriwealthpartners \
  --update-env-vars RESEND_API_KEY=re_your_api_key,CONTACT_EMAIL=support@nriwealthpartners.com
```

#### Option B: Using Google Cloud Console

1. Go to: https://console.cloud.google.com/run
2. Click on your service: `nriwealthpartners`
3. Click **Edit & Deploy New Revision** (top)
4. Click **Variables & Secrets** tab
5. Under "Environment variables", click **Add Variable** for each:
   - Name: `GMAIL_USER`, Value: `support@nriwealthpartners.com`
   - Name: `GMAIL_APP_PASSWORD`, Value: `your-app-password`
   - Name: `CONTACT_EMAIL`, Value: `support@nriwealthpartners.com`
6. Click **Deploy** (bottom)
7. Wait for deployment to complete (~2 minutes)

---

## Testing Checklist

### Contact Form Test:
- [ ] Go to `/contact` page
- [ ] Fill out form with your email
- [ ] Submit form
- [ ] Check for success message
- [ ] Check your inbox for confirmation email
- [ ] Check support email for notification
- [ ] Verify emails are not in spam

### Webinar Registration Test:
- [ ] Go to `/webinars` page
- [ ] Click "Register Now"
- [ ] Complete registration
- [ ] Check for confirmation email
- [ ] Verify webinar details are correct

---

## Troubleshooting

### Problem: "Failed to send email" error

**Solutions:**
1. Check `.env.local` file:
   - ✅ File name is exactly `.env.local` (with the dot)
   - ✅ No extra spaces in the values
   - ✅ Gmail password has no spaces (remove all spaces)
   - ✅ File is in the project root folder (same level as `package.json`)

2. Restart your server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

3. Check Gmail app password:
   - Go back to https://myaccount.google.com/apppasswords
   - Delete the old app password
   - Create a new one
   - Update `.env.local` with new password

4. Verify 2FA is enabled:
   - Go to https://myaccount.google.com/security
   - Ensure "2-Step Verification" is ON

### Problem: Emails go to spam folder

**Solutions:**
1. Use Resend instead of Gmail (better deliverability)
2. Configure SPF, DKIM, DMARC records
3. Ask recipients to mark as "Not Spam"
4. Use a "from" email that matches your domain

### Problem: Can't create Gmail app password

**Possible causes:**
1. 2-Factor Authentication not enabled → Enable it first
2. Using workspace account → May need admin approval
3. Wrong Google account → Make sure you're signed in to the right account

### Problem: Environment variables not loading

**Solutions:**
1. Ensure file is named `.env.local` (not `.env` or `env.local`)
2. File must be in project root (same folder as `package.json`)
3. Restart server after making changes
4. Check for typos in variable names

### Problem: Resend domain not verifying

**Solutions:**
1. Wait 30 minutes for DNS propagation
2. Check DNS records in Google Cloud DNS
3. Verify you copied the exact values from Resend
4. Use DNS checker: https://dnschecker.org
5. Remove and re-add DNS records if needed

---

## Security Best Practices

### ✅ DO:
- Keep `.env.local` file secret
- Use different passwords for dev/production
- Rotate app passwords every 6 months
- Monitor email sending logs
- Use Resend for production (better security)

### ❌ DON'T:
- Commit `.env.local` to git (it's already in .gitignore)
- Share app passwords
- Use your personal Gmail password
- Store credentials in code files

---

## Email Template Customization

### Contact Form Emails

**File**: `/app/api/contact/route.ts`

**User Confirmation Email** (around line 48):
```typescript
html: `
  <div style="font-family: Arial, sans-serif;">
    <h2>Your custom message here</h2>
    <p>Dear ${data.name},</p>
    ...
  </div>
`
```

**Admin Notification Email** (around line 83):
```typescript
html: `
  <h2>Customize admin notification</h2>
  ...
`
```

### Webinar Registration Emails

**File**: `/app/api/webinar-registration/route.ts`

Similar structure - customize the HTML content.

---

## Monitoring & Limits

### Gmail Limits:
- **500 emails per day** (free Gmail)
- **2,000 emails per day** (Google Workspace)

### Resend Limits:
- **3,000 emails per month** (free tier)
- **50,000 emails per month** ($20/month)
- **100,000 emails per month** ($50/month)

### Set Alerts:
For Resend:
1. Go to Settings → Billing
2. Set usage alerts

For Gmail:
- Monitor manually or use workspace reports

---

## Support

**Gmail Issues:**
- Google Help: https://support.google.com/mail

**Resend Issues:**
- Documentation: https://resend.com/docs
- Support: support@resend.com

**Website Issues:**
- Check server logs for error messages
- Contact your development team

---

## Quick Reference

### Gmail Setup:
```env
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=your16digitpassword
CONTACT_EMAIL=support@nriwealthpartners.com
```

### Resend Setup:
```env
RESEND_API_KEY=re_your_api_key
CONTACT_EMAIL=support@nriwealthpartners.com
```

### Both (Recommended):
```env
RESEND_API_KEY=re_your_api_key
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=your16digitpassword
CONTACT_EMAIL=support@nriwealthpartners.com
```

---

You're all set! Choose Gmail for quick setup or Resend for production-grade email delivery. 📧
