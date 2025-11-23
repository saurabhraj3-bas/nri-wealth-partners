# Google Workspace Email Setup Guide

## Why Google Workspace is Perfect for You ✅

### Advantages:

1. **Professional Email** 📧
   - Email: support@nriwealthpartners.com
   - Looks more professional than Gmail
   - Builds trust with clients

2. **Better Integration** 🔗
   - Already using Google Cloud
   - Same ecosystem, same billing
   - Unified admin console

3. **Higher Limits** 📊
   - **2,000 emails per day** (vs 500 with free Gmail)
   - Perfect for growing business
   - Room for newsletters, marketing

4. **Team Collaboration** 👥
   - Multiple email addresses
   - Shared calendars
   - Google Drive with more storage

5. **Enhanced Security** 🔒
   - Advanced security features
   - Admin controls
   - Data loss prevention

### Cost:
- **Business Starter**: $6/user/month
- **Business Standard**: $12/user/month (recommended)
- **Business Plus**: $18/user/month

**Recommended**: Start with Business Starter ($6/month for 1 user)

---

## Setup Process (30 minutes)

### Step 1: Purchase Google Workspace (10 minutes)

1. Go to: https://workspace.google.com
2. Click **Get Started**
3. Enter your business details:
   - Business name: NRI Wealth Partners
   - Number of employees: 1-2 (to start)
   - Country: Your country
4. Enter your domain: **nriwealthpartners.com**
5. Choose plan: **Business Starter** ($6/month)
6. Create admin email:
   - Username: admin (or your name)
   - Creates: admin@nriwealthpartners.com
7. Complete payment setup

### Step 2: Verify Domain Ownership (15 minutes)

Google will ask you to verify you own the domain.

#### Option A: DNS TXT Record (Recommended)

1. Google will provide a TXT record like:
   ```
   google-site-verification=abc123def456...
   ```

2. Add to Google Cloud DNS:
   - Go to: https://console.cloud.google.com/net-services/dns
   - Select your domain zone
   - Click **Add Record Set**
   - Type: TXT
   - Name: @ (or leave blank)
   - Value: (paste the verification code)
   - TTL: 300
   - Click **Create**

3. Go back to Google Workspace
4. Click **Verify**
5. Wait 5-15 minutes for DNS propagation

### Step 3: Configure MX Records (10 minutes)

MX records tell the internet where to deliver your email.

1. Google Workspace will provide MX records:
   ```
   Priority 1:  ASPMX.L.GOOGLE.COM
   Priority 5:  ALT1.ASPMX.L.GOOGLE.COM
   Priority 5:  ALT2.ASPMX.L.GOOGLE.COM
   Priority 10: ALT3.ASPMX.L.GOOGLE.COM
   Priority 10: ALT4.ASPMX.L.GOOGLE.COM
   ```

2. Add each to Google Cloud DNS:
   - Click **Add Record Set**
   - Type: MX
   - Name: @ (or leave blank)
   - Priority: (as shown above)
   - Value: (the server address)
   - TTL: 3600
   - Click **Create**
   - Repeat for all 5 MX records

3. **Important**: Remove any old MX records

4. Wait 15-30 minutes for DNS propagation

### Step 4: Create Email Addresses (5 minutes)

1. Go to Google Workspace Admin Console
2. Click **Users**
3. Click **Add New User**

Create these emails:
- support@nriwealthpartners.com (for customer inquiries)
- info@nriwealthpartners.com (general contact)
- noreply@nriwealthpartners.com (for automated emails)

4. Set passwords for each
5. Share credentials securely with team

---

## Configuration for Website

### Step 1: Create App Password

Even with Google Workspace, you'll use app passwords for the website:

1. Go to: https://myaccount.google.com
2. Sign in with **support@nriwealthpartners.com**
3. **Security** → **2-Step Verification** (enable if not already)
4. **App passwords** → **Generate**
5. Select:
   - App: Mail
   - Device: NRI Wealth Partners Website
6. Copy the 16-character password

### Step 2: Update .env.local

```env
# Google Workspace Email
GMAIL_USER=support@nriwealthpartners.com
GMAIL_APP_PASSWORD=abcdefghijklmnop  # Your 16-digit app password

CONTACT_EMAIL=support@nriwealthpartners.com
```

### Step 3: Test

1. Restart your dev server
2. Submit contact form
3. Check support@nriwealthpartners.com inbox
4. Verify emails arrive

---

## Email Addresses to Create

Recommended email addresses:

| Email | Purpose |
|-------|---------|
| **support@nriwealthpartners.com** | Customer support, contact form |
| **info@nriwealthpartners.com** | General inquiries |
| **admin@nriwealthpartners.com** | Admin access |
| **noreply@nriwealthpartners.com** | Automated emails (confirmations) |
| **webinars@nriwealthpartners.com** | Webinar registrations |
| **anil@nriwealthpartners.com** | Personal email for Anil Parekh |
| **avani@nriwealthpartners.com** | Personal email for Avani Parekh |

---

## Using noreply@ for Automated Emails

For better email deliverability, use noreply@ for automated messages:

### Update API Routes

**File: `/app/api/contact/route.ts`**

Change:
```typescript
from: `"NRI Wealth Partners" <${gmailUser}>`
```

To:
```typescript
from: `"NRI Wealth Partners" <noreply@nriwealthpartners.com>`
```

**File: `/app/api/webinar-registration/route.ts`**

Same change.

### Configure noreply@ Email

1. Create noreply@nriwealthpartners.com in Workspace
2. Enable 2FA
3. Create app password
4. Use in .env.local:
   ```env
   GMAIL_USER=noreply@nriwealthpartners.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

---

## Email Forwarding & Aliases

### Setup Forwarding

Forward all emails from info@ to support@:

1. Admin Console → **Apps** → **Google Workspace** → **Gmail**
2. Click **Default routing**
3. Add routing rule:
   - From: info@nriwealthpartners.com
   - To: support@nriwealthpartners.com

### Create Aliases

Create aliases (alternate addresses that go to same inbox):

1. Admin Console → **Users**
2. Select user (e.g., support@)
3. Click **User information** → **Email aliases**
4. Add aliases:
   - contact@nriwealthpartners.com
   - hello@nriwealthpartners.com

---

## Migration from Existing Email

If you have existing emails on another service:

### Option 1: Gmail Migration Tool
1. Admin Console → **Data migration**
2. Select source (Gmail, Outlook, etc.)
3. Follow migration wizard
4. Migrates emails, contacts, calendars

### Option 2: Email Forwarding
1. Set up forwarding from old email to new
2. Gradually transition
3. Keep both active during transition

---

## Best Practices

### Security
- ✅ Enable 2FA on all accounts
- ✅ Use strong passwords
- ✅ Regular security checkups
- ✅ Review admin activity logs

### Organization
- ✅ Create groups (e.g., team@nriwealthpartners.com)
- ✅ Set up email signatures
- ✅ Configure out-of-office replies
- ✅ Set up labels/filters

### Email Signatures

Create professional signatures for all emails:

```
--
Anil Parekh, CA
Founder & Chief Investment Advisor
NRI Wealth Partners

📞 +91 9974742626
📧 anil@nriwealthpartners.com
🌐 www.nriwealthpartners.com

SEBI Registered Investment Advisor | 18+ Years Experience
```

Add in: Gmail Settings → Signature

---

## Troubleshooting

### Emails not arriving
1. Check MX records are correct
2. Wait 30 minutes for DNS propagation
3. Check spam folder
4. Verify domain is verified

### Can't send from website
1. Verify app password is correct (no spaces)
2. Check 2FA is enabled
3. Restart server after .env.local changes
4. Check Gmail account has SMTP enabled

### DNS propagation slow
- Can take up to 48 hours (usually 15-30 mins)
- Check status: https://dnschecker.org
- Test with: `dig nriwealthpartners.com MX`

---

## Comparison: Free Gmail vs Google Workspace

| Feature | Free Gmail | Google Workspace |
|---------|------------|------------------|
| **Email Address** | yourname@gmail.com | support@nriwealthpartners.com |
| **Daily Send Limit** | 500 emails | 2,000 emails |
| **Professional** | ⚠️ Less professional | ✅ Professional |
| **Team Features** | ❌ Limited | ✅ Full collaboration |
| **Storage** | 15 GB (shared) | 30 GB - 5 TB per user |
| **Support** | Community | 24/7 support |
| **Cost** | Free | $6-18/month |
| **Custom Domain** | ❌ No | ✅ Yes |

---

## My Recommendation

**For NRI Wealth Partners:**

✅ **Use Google Workspace Business Starter ($6/month)**

**Why:**
1. Professional email (@nriwealthpartners.com)
2. Higher send limits (2,000/day)
3. Better for business growth
4. Unified Google Cloud ecosystem
5. Team collaboration features
6. Only $6/month - worth it!

**Setup:**
1. Create support@nriwealthpartners.com (main contact)
2. Create noreply@nriwealthpartners.com (automated emails)
3. Create personal emails for team members
4. Use app passwords for website integration
5. Same process as free Gmail, just better!

---

## Quick Setup Checklist

- [ ] Purchase Google Workspace
- [ ] Verify domain ownership (TXT record)
- [ ] Configure MX records
- [ ] Create email addresses
- [ ] Enable 2FA on email accounts
- [ ] Create app passwords
- [ ] Update .env.local with credentials
- [ ] Test sending emails from website
- [ ] Configure email signatures
- [ ] Set up email forwarding/aliases

---

## Support Resources

- Google Workspace Help: https://support.google.com/a
- Setup Guides: https://support.google.com/a/answer/9476983
- DNS Configuration: https://support.google.com/a/answer/140034
- 24/7 Support: Available with all plans

---

## Cost Breakdown

**Monthly:**
- Google Workspace: $6/user
- 2 users (you + team): $12/month
- Total: **$12/month**

**Yearly:**
- $144/year (can pay annually for discount)

**vs Free Gmail:**
- $0/month
- But: Unprofessional, limited features, not suitable for business

**Worth it?** Absolutely yes! 🎯

---

You're ready to set up Google Workspace for professional email! 📧
