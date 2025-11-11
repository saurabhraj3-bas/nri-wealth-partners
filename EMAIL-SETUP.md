# Email Setup Guide - Resend Integration

Complete guide to set up email functionality for the contact form using Resend.

## 📧 Current Status

✅ **API Route Created:** `/app/api/contact/route.ts`
✅ **Form Integration:** Contact form now calls the API
⚠️ **Email Service:** Needs Resend API key configuration

**Development Mode:** Currently emails are logged to console (check terminal)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" (it's FREE)
3. Verify your email
4. Go to "API Keys" section
5. Click "Create API Key"
6. Copy the API key (starts with `re_...`)

### Step 2: Add to Environment Variables

```bash
cd ~/Projects/NRIWealthPartners

# Create or edit .env.local file
echo 'RESEND_API_KEY=re_your_actual_api_key_here' >> .env.local
echo 'RESEND_FROM_EMAIL=onboarding@resend.dev' >> .env.local
echo 'CONTACT_EMAIL=support@nriwealthpartners.com' >> .env.local
```

### Step 3: Restart Server

```bash
# Kill current server
lsof -ti:3001 | xargs kill

# Restart with new env vars
npm run dev
```

### Step 4: Test the Form

1. Go to: http://localhost:3001/contact
2. Fill out and submit the form
3. Check your email (support@nriwealthpartners.com)

**Done! 🎉**

---

## 📝 Detailed Setup

### Free Tier Limits

Resend Free Plan includes:
- ✅ **3,000 emails/month** (plenty for contact forms)
- ✅ **100 emails/day**
- ✅ **1 domain** verification
- ✅ **Unlimited** API keys

### Environment Variables Explained

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx
# Your Resend API key from dashboard

# Sender Email (for development)
RESEND_FROM_EMAIL=onboarding@resend.dev
# Use this for testing, or verify your domain (see below)

# Where form submissions are sent
CONTACT_EMAIL=support@nriwealthpartners.com
# Change to your actual email address
```

### Verify Your Domain (Optional but Recommended)

To send from your own domain (e.g., hello@nriwealthpartners.com):

1. **In Resend Dashboard:**
   - Go to "Domains"
   - Click "Add Domain"
   - Enter: `nriwealthpartners.com`

2. **Add DNS Records:**
   Add these records to your domain DNS:

   ```
   Type: TXT
   Name: @
   Value: [provided by Resend]

   Type: MX
   Name: @
   Value: [provided by Resend]
   ```

3. **Wait for Verification:** (5-30 minutes)

4. **Update Environment Variable:**
   ```bash
   RESEND_FROM_EMAIL=hello@nriwealthpartners.com
   ```

---

## 🧪 Testing

### Current Behavior (Without Resend Key)

**What happens:**
- Form submission succeeds
- Email details logged to terminal console
- No actual email sent
- User sees success message

**Check Terminal Output:**
```bash
# You'll see this in your terminal:
================================================================================
📧 NEW CONTACT FORM SUBMISSION (Resend not configured)
================================================================================
From: John Doe <john@example.com>
Phone: +91 9999999999
Country: USA
Inquiry: Investment Advisory
...
```

### With Resend Configured

**What happens:**
- Form submission succeeds
- Email sent to support@nriwealthpartners.com
- Auto-reply sent to user
- User redirected to thank you page

**Verify in Resend Dashboard:**
1. Go to resend.com dashboard
2. Click "Logs"
3. See all sent emails with status

---

## 📧 Email Templates

### Email to Support Team

**Subject:** New Contact Inquiry: [Subject]

**Content:**
- Professionally formatted HTML email
- All form data included
- Styled with your brand colors (Navy, Gold)
- Reply-to set to user's email
- Timestamp in IST

### Auto-Reply to User

**Subject:** Thank you for contacting NRI Wealth Partners

**Content:**
- Thank you message
- What happens next (3 steps)
- Contact information
- WhatsApp link
- Business hours
- SEBI disclaimer

---

## 🔧 Troubleshooting

### Problem: "Failed to send message"

**Check:**
1. Is RESEND_API_KEY set correctly?
   ```bash
   cat .env.local | grep RESEND
   ```

2. Is the API key valid?
   - Go to resend.com dashboard
   - Check if key is active

3. Check terminal for errors:
   ```bash
   # Look for red error messages in terminal
   ```

### Problem: Email not received

**Check:**
1. **Spam folder** - Check junk/spam
2. **Email address** - Verify CONTACT_EMAIL is correct
3. **Resend logs** - Check resend.com dashboard → Logs
4. **Rate limits** - Free tier: 100 emails/day

### Problem: "Invalid from address"

**Solution:**
Use verified sender or `onboarding@resend.dev`:
```bash
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Problem: Server doesn't pick up new env vars

**Solution:**
Restart the dev server:
```bash
lsof -ti:3001 | xargs kill
npm run dev
```

---

## 🎨 Customization

### Change Email Templates

Edit: `/app/api/contact/route.ts`

**Support Email Template:**
```typescript
const emailHtml = `
  <!DOCTYPE html>
  <html>
    // Your custom HTML here
  </html>
`
```

**Auto-Reply Template:**
```typescript
const autoReplyHtml = `
  // Your custom HTML here
`
```

### Change Recipient Email

```bash
# In .env.local
CONTACT_EMAIL=your-email@example.com
```

Or edit directly in code:
```typescript
// In app/api/contact/route.ts
const contactEmail = 'your-email@example.com'
```

---

## 🌐 Production Deployment

### For Google Cloud Run

Add environment variables during deployment:

```bash
gcloud run services update nri-wealth-partners \
  --region us-east1 \
  --set-env-vars="RESEND_API_KEY=re_xxxxx,RESEND_FROM_EMAIL=hello@nriwealthpartners.com,CONTACT_EMAIL=support@nriwealthpartners.com"
```

Or use the deployment script:
```bash
./deploy.sh
# It will prompt for environment variables
```

### Security Best Practices

1. **Never commit API keys to Git**
   - `.env.local` is in `.gitignore` ✅
   - Never hardcode keys in code ✅

2. **Use separate keys for dev/prod**
   - Create separate API keys in Resend
   - Label them: "Development" and "Production"

3. **Monitor usage**
   - Check Resend dashboard regularly
   - Set up email alerts for high usage

---

## 📊 Email Analytics

### Track in Resend Dashboard

View:
- Total emails sent
- Delivery rate
- Bounce rate
- Open rate (if enabled)
- Click rate (if tracking links)

### Custom Tracking

Add to your emails:
```html
<img src="https://yourdomain.com/track?email_id=123" width="1" height="1" />
```

---

## 💡 Advanced Features

### 1. Email Attachments

```typescript
await resend.emails.send({
  from: 'hello@nriwealthpartners.com',
  to: 'support@nriwealthpartners.com',
  subject: 'New Inquiry',
  html: emailHtml,
  attachments: [
    {
      filename: 'document.pdf',
      content: fileBuffer,
    },
  ],
})
```

### 2. CC/BCC

```typescript
await resend.emails.send({
  from: 'hello@nriwealthpartners.com',
  to: 'support@nriwealthpartners.com',
  cc: 'team@nriwealthpartners.com',
  bcc: 'archive@nriwealthpartners.com',
  subject: 'New Inquiry',
  html: emailHtml,
})
```

### 3. Email Scheduling

```typescript
await resend.emails.send({
  from: 'hello@nriwealthpartners.com',
  to: 'client@example.com',
  subject: 'Follow-up',
  html: emailHtml,
  scheduledAt: '2024-01-15T09:00:00Z',
})
```

### 4. Tags for Organization

```typescript
await resend.emails.send({
  from: 'hello@nriwealthpartners.com',
  to: 'support@nriwealthpartners.com',
  subject: 'New Inquiry',
  html: emailHtml,
  tags: [
    {
      name: 'category',
      value: 'contact-form',
    },
    {
      name: 'inquiry-type',
      value: 'investment',
    },
  ],
})
```

---

## ✅ Pre-Launch Checklist

Before going live:

- [ ] Get Resend API key
- [ ] Add to environment variables
- [ ] Test form submission locally
- [ ] Verify email received at CONTACT_EMAIL
- [ ] Check auto-reply works
- [ ] Test from different devices
- [ ] Verify email lands in inbox (not spam)
- [ ] Set up domain verification (optional)
- [ ] Add production API key to Cloud Run
- [ ] Test in production
- [ ] Set up email monitoring
- [ ] Create backup contact method (phone)

---

## 📞 Support

### Resend Support
- Documentation: https://resend.com/docs
- Support: support@resend.com
- Status: https://status.resend.com

### Project Issues
- Email: support@nriwealthpartners.com
- Phone: +91 9974742626

---

## 🎯 Quick Commands

```bash
# View current env vars
cat .env.local

# Test API endpoint
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","phone":"9999999999","countryCode":"+91","country":"India","inquiryType":"General Inquiry","message":"Test message","contactMethod":"Email","privacyConsent":true}'

# Watch terminal logs
tail -f /dev/stdout

# Restart server
lsof -ti:3001 | xargs kill && npm run dev
```

---

**Status:** ✅ Email system ready - just add Resend API key!

**Next Steps:** Get your free Resend API key and add to `.env.local`
