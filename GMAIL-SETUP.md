# Email Setup Guide - Gmail SMTP

Complete guide to set up email functionality for the contact form using Gmail (FREE).

## 📧 Current Status

✅ **API Route Created:** `/app/api/contact/route.ts`
✅ **Form Integration:** Contact form calls the API
✅ **Gmail Support:** Now supports Gmail SMTP (FREE)
⚠️ **Email Service:** Needs Gmail configuration

**Development Mode:** Currently emails are logged to console (check terminal)

---

## 🚀 Quick Setup (3 minutes) - Gmail

### Step 1: Get Gmail App Password

1. **Use your existing Gmail account** (e.g., support@nriwealthpartners.com)
2. **Enable 2-Step Verification** (required for App Passwords):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Type: "NRI Wealth Website"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Add to Environment Variables

```bash
cd ~/Projects/NRIWealthPartners

# Create or edit .env.local file
cat > .env.local << 'EOF'
# Gmail Configuration (FREE - No signup needed!)
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Where to send contact form submissions
CONTACT_EMAIL=support@nriwealthpartners.com
EOF
```

**Important:**
- Replace `support@nriwealthpartners.com` with your actual Gmail address
- Replace `abcdefghijklmnop` with your actual App Password (remove spaces)
- The App Password is the 16-character code, not your Gmail password

### Step 3: Restart Server

```bash
# Kill current server (if running)
lsof -ti:3001 | xargs kill

# Restart with new env vars
npm run dev
```

### Step 4: Test the Form

1. Go to: http://localhost:3001/contact
2. Fill out and submit the form
3. Check your Gmail inbox (support@nriwealthpartners.com)
4. Check the user's email for auto-reply

**Done! 🎉**

---

## 🆚 Gmail vs Resend Comparison

| Feature | Gmail SMTP (FREE) | Resend |
|---------|------------------|--------|
| **Cost** | FREE | FREE (3,000 emails/month) |
| **Setup Time** | 3 minutes | 5 minutes (signup required) |
| **Daily Limit** | 500 emails/day | 100 emails/day (free tier) |
| **Monthly Limit** | ~15,000 emails | 3,000 emails/month |
| **Signup Required** | No (use existing Gmail) | Yes (new account) |
| **Best For** | Small businesses | Startups, better analytics |
| **Domain** | Sends from your Gmail | Can verify custom domain |

**Recommendation:** Start with Gmail (easier setup), switch to Resend later if you need custom domain or analytics.

---

## 📊 Gmail Sending Limits

**Gmail Free Account:**
- ✅ **500 emails per day**
- ✅ **~15,000 emails per month**
- ✅ **100 recipients per email**
- ⚠️ If you exceed limits, Google temporarily blocks sending (24 hours)

**Google Workspace Account:**
- ✅ **2,000 emails per day**
- ✅ **~60,000 emails per month**
- ✅ Better deliverability

---

## 🔧 Troubleshooting

### Problem: "Invalid login credentials"

**Check:**
1. Did you enable 2-Step Verification?
   - Go to: https://myaccount.google.com/security
   - Ensure "2-Step Verification" is ON

2. Are you using an App Password (not your Gmail password)?
   - Generate new one: https://myaccount.google.com/apppasswords
   - Copy the 16-character code
   - Remove all spaces before adding to .env.local

3. Is the Gmail address correct in GMAIL_USER?
   ```bash
   cat .env.local | grep GMAIL_USER
   # Should show: GMAIL_USER=support@nriwealthpartners.com
   ```

### Problem: "Less secure app access"

**Solution:**
Gmail no longer supports "Less Secure Apps". You MUST use App Passwords (see Step 1 above).

### Problem: Email not received

**Check:**
1. **Spam folder** - Check junk/spam in recipient inbox
2. **Gmail Sent folder** - Verify email was sent from your Gmail
3. **Email address** - Verify CONTACT_EMAIL is correct
4. **Terminal logs** - Check for error messages

### Problem: Server doesn't pick up new env vars

**Solution:**
Restart the dev server:
```bash
lsof -ti:3001 | xargs kill
npm run dev
```

### Problem: "Daily sending quota exceeded"

**Solution:**
Gmail free accounts have 500 emails/day limit. If you hit this:
- Wait 24 hours for quota to reset
- Upgrade to Google Workspace (2,000/day limit)
- Or switch to Resend (see EMAIL-SETUP.md)

---

## 🎨 Email Templates

Your contact form sends two professionally designed emails:

### 1. Email to Support Team
- **To:** support@nriwealthpartners.com
- **From:** Your Gmail (support@nriwealthpartners.com)
- **Subject:** New Contact Inquiry: [Subject]
- **Content:**
  - Professional HTML with brand colors (Navy, Gold)
  - All form data formatted beautifully
  - Reply-to set to user's email (just hit reply!)
  - Timestamp in IST

### 2. Auto-Reply to User
- **To:** User's email
- **From:** Your Gmail (support@nriwealthpartners.com)
- **Subject:** Thank you for contacting NRI Wealth Partners
- **Content:**
  - Thank you message
  - What happens next (3 steps)
  - Contact information
  - WhatsApp CTA button
  - Business hours
  - SEBI disclaimer

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git**
   - `.env.local` is in `.gitignore` ✅
   - Never hardcode passwords in code ✅

2. **App Password vs Gmail Password**
   - NEVER use your actual Gmail password in code
   - ALWAYS use App Password (can be revoked anytime)

3. **Revoke App Passwords**
   - If compromised, go to https://myaccount.google.com/apppasswords
   - Delete the "NRI Wealth Website" app password
   - Generate a new one

4. **Use separate Gmail for production**
   - Development: support@nriwealthpartners.com
   - Production: Same or different Gmail account

---

## 🌐 Production Deployment

### For Google Cloud Run

Add environment variables during deployment:

```bash
gcloud run services update nri-wealth-partners \
  --region us-east1 \
  --set-env-vars="GMAIL_USER=support@nriwealthpartners.com,GMAIL_APP_PASSWORD=your_app_password,CONTACT_EMAIL=support@nriwealthpartners.com"
```

Or use the deployment script:
```bash
./deploy.sh
# It will prompt for environment variables
```

---

## 📧 Testing Emails

### Test via Form
1. Go to: http://localhost:3001/contact
2. Fill in the form
3. Submit
4. Check:
   - Support Gmail inbox
   - User's email inbox (for auto-reply)
   - Terminal for success/error logs

### Test via API
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "countryCode": "+91",
    "country": "India",
    "inquiryType": "General Inquiry",
    "message": "This is a test message to verify email functionality works correctly.",
    "contactMethod": "Email",
    "privacyConsent": true
  }'
```

---

## 🔄 Switching to Resend Later

If you want to switch to Resend later (for custom domain or analytics):

1. Sign up at resend.com
2. Get API key
3. Add to .env.local:
   ```bash
   RESEND_API_KEY=re_your_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```
4. Remove Gmail variables (or keep both - Gmail takes priority)
5. Restart server

The code supports both services automatically!

---

## 🎯 Quick Commands

```bash
# View current env vars
cat .env.local

# Test API endpoint (see above)

# Watch Gmail sent folder
# Open Gmail → Sent folder

# Restart server
lsof -ti:3001 | xargs kill && npm run dev

# Check if 2-Step Verification is enabled
# Visit: https://myaccount.google.com/security
```

---

## ✅ Pre-Launch Checklist

Before going live:

- [ ] Gmail 2-Step Verification enabled
- [ ] Gmail App Password generated
- [ ] Environment variables added to .env.local
- [ ] Dev server restarted
- [ ] Test form submission locally
- [ ] Verify email received at CONTACT_EMAIL
- [ ] Check auto-reply works
- [ ] Test from different devices
- [ ] Verify email lands in inbox (not spam)
- [ ] Add production Gmail credentials to Cloud Run
- [ ] Test in production
- [ ] Set up email forwarding (optional)
- [ ] Create backup contact method (phone)

---

## 💡 Tips

### Improve Deliverability

1. **Use Gmail with your domain**
   - Instead of "gmail.com", use Google Workspace
   - Example: support@nriwealthpartners.com (custom domain)
   - Better deliverability, looks more professional

2. **Set up SPF/DKIM**
   - Automatic if using Google Workspace
   - Improves spam score

3. **Warm up your account**
   - Don't send 500 emails on day 1
   - Start with 10-20/day, gradually increase

### Monitor Usage

1. **Check Gmail Sent folder regularly**
2. **Watch for bounce messages**
3. **Monitor spam complaints**
4. **Keep track of daily send count** (max 500)

---

## 📞 Support

### Gmail Issues
- Help Center: https://support.google.com/mail
- App Passwords: https://support.google.com/accounts/answer/185833

### Project Issues
- Email: support@nriwealthpartners.com
- Phone: +91 9974742626

---

## 🎯 What You Get

With this setup, every contact form submission will:

1. ✅ Send detailed email to your Gmail (support@nriwealthpartners.com)
2. ✅ Send professional auto-reply to the user
3. ✅ Include all form data beautifully formatted
4. ✅ Allow you to reply directly (reply-to set to user's email)
5. ✅ Log success/errors to terminal for debugging
6. ✅ Work on both development and production

All for **FREE** using your existing Gmail! 🎉

---

**Status:** ✅ Gmail SMTP ready - just add credentials!

**Next Steps:** Enable 2-Step Verification → Generate App Password → Add to `.env.local` → Restart server → Test!
