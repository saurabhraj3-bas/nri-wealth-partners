# Email Configuration Guide - Step by Step

This guide will help you set up email services for contact form and webinar registration confirmations.

## Option 1: Gmail SMTP (Recommended for Quick Setup)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Scroll down to "Signing in to Google"
4. Click on **2-Step Verification**
5. Follow the prompts to enable 2FA (you'll need your phone)

### Step 2: Create App Password
1. After enabling 2FA, go back to **Security**
2. Under "Signing in to Google", click **App passwords**
3. You may need to sign in again
4. At the bottom, select:
   - **App**: Choose "Mail"
   - **Device**: Choose "Other (Custom name)"
   - Type: "NRI Wealth Partners Website"
5. Click **Generate**
6. **IMPORTANT**: Copy the 16-character password that appears (it will look like: `abcd efgh ijkl mnop`)
7. Remove the spaces: `abcdefghijklmnop`

### Step 3: Configure Environment Variables
1. Open your project folder
2. Find or create the file `.env.local` in the root directory
3. Add these lines (replace with your actual values):

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Contact Email (where you want to receive notifications)
CONTACT_EMAIL=support@nriwealthpartners.com

# Optional: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Test the Configuration
1. Save the `.env.local` file
2. Restart your development server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```
3. Go to http://localhost:3000/contact
4. Fill out the contact form and submit
5. Check your email for:
   - Confirmation email at the address you entered in the form
   - Notification email at your CONTACT_EMAIL address

---

## Option 2: Resend (Recommended for Production)

Resend is a modern email API service with better deliverability and features.

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Click **Sign Up**
3. Create an account (free tier includes 3,000 emails/month)
4. Verify your email address

### Step 2: Add and Verify Your Domain
1. In Resend dashboard, click **Domains**
2. Click **Add Domain**
3. Enter your domain: `nriwealthpartners.com`
4. You'll see DNS records to add

### Step 3: Configure DNS Records
You need to add these records to your domain's DNS settings (in Google Cloud DNS or your domain registrar):

**SPF Record:**
- Type: `TXT`
- Name: `@` (or your domain)
- Value: `v=spf1 include:_spf.resend.com ~all`

**DKIM Records:**
Resend will provide you with DKIM records. Add each one:
- Type: `TXT`
- Name: (provided by Resend, e.g., `resend._domainkey`)
- Value: (provided by Resend)

**DMARC Record:**
- Type: `TXT`
- Name: `_dmarc`
- Value: `v=DMARC1; p=none; rua=mailto:dmarc@nriwealthpartners.com`

### Step 4: Get API Key
1. In Resend dashboard, click **API Keys**
2. Click **Create API Key**
3. Name it: "NRI Wealth Partners Website"
4. Copy the API key (starts with `re_`)

### Step 5: Configure Environment Variables
Add to your `.env.local` file:

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Contact Email
CONTACT_EMAIL=support@nriwealthpartners.com

# Gmail (Backup - Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Step 6: Update Email Sender
Once your domain is verified in Resend, update the API route files:

**File: `/app/api/contact/route.ts`**
```typescript
from: "NRI Wealth Partners <noreply@nriwealthpartners.com>",
```

**File: `/app/api/webinar-registration/route.ts`**
```typescript
from: "NRI Wealth Partners <noreply@nriwealthpartners.com>",
```

---

## Testing Checklist

### Contact Form Testing
- [ ] Navigate to `/contact` page
- [ ] Fill out all fields with valid data
- [ ] Use your real email address
- [ ] Submit the form
- [ ] Check for success message on website
- [ ] Check your inbox for confirmation email
- [ ] Check CONTACT_EMAIL inbox for notification
- [ ] Verify email is not in spam folder

### Webinar Registration Testing
- [ ] Navigate to `/webinars` page
- [ ] Click "Register Now" on any webinar
- [ ] Complete registration with your email
- [ ] Check for confirmation email with webinar details
- [ ] Check CONTACT_EMAIL for registration notification
- [ ] Verify all details are correct

---

## Troubleshooting

### "Failed to send email" Error
**Problem**: Email sending fails
**Solutions**:
1. Check environment variables are set correctly (no extra spaces)
2. Restart your development server after changing `.env.local`
3. For Gmail: Verify app password is correct (16 characters, no spaces)
4. For Resend: Verify API key starts with `re_`

### Emails Going to Spam
**Problem**: Emails arrive in spam folder
**Solutions**:
1. Use Resend instead of Gmail SMTP
2. Configure SPF, DKIM, and DMARC records
3. Use a "from" email that matches your domain
4. Avoid spam trigger words in email content

### Gmail App Password Not Working
**Problem**: Can't create app password or it doesn't work
**Solutions**:
1. Ensure 2FA is enabled on your Google account
2. Use the correct Google account
3. Remove all spaces from the 16-character password
4. Try generating a new app password

### Environment Variables Not Loading
**Problem**: Emails not being sent, no errors
**Solutions**:
1. Ensure file is named `.env.local` (not `.env` or `env.local`)
2. File must be in the project root directory
3. Restart development server after changes
4. Check for typos in variable names

---

## Production Deployment

### For Google Cloud Run
1. Set environment variables in Cloud Run:
   ```bash
   gcloud run services update nriwealthpartners \
     --update-env-vars GMAIL_USER=your-email@gmail.com,\
GMAIL_APP_PASSWORD=yourapppassword,\
CONTACT_EMAIL=support@nriwealthpartners.com
   ```

2. Or add them in the Google Cloud Console:
   - Go to Cloud Run
   - Select your service
   - Click **Edit & Deploy New Revision**
   - Go to **Variables & Secrets** tab
   - Add each environment variable
   - Deploy

### Security Notes
- ✅ **NEVER** commit `.env.local` to git
- ✅ `.env.local` is already in `.gitignore`
- ✅ Use different credentials for development and production
- ✅ Rotate credentials periodically
- ✅ Use Resend for production (better security and deliverability)

---

## Email Template Customization

### Contact Form Email
Edit: `/app/api/contact/route.ts`
- User confirmation email: Lines 48-80
- Admin notification email: Lines 83-115

### Webinar Registration Email
Edit: `/app/api/webinar-registration/route.ts`
- User confirmation email: Lines 48-70
- Admin notification email: Lines 73-86

---

## Support

If you encounter issues:
1. Check server logs for error messages
2. Test with a different email address
3. Verify environment variables are loaded: `console.log(process.env.GMAIL_USER)`
4. Consult Resend documentation: https://resend.com/docs
5. Contact support@nriwealthpartners.com
