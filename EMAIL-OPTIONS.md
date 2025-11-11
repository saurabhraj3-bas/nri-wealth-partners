# Email Service Options - Quick Comparison

## 📧 Choose Your Email Service

Your contact form now supports **both Gmail and Resend**. Choose the one that works best for you!

---

## 🆚 Quick Comparison

| | **Gmail SMTP** ⭐ RECOMMENDED | **Resend** |
|---|---|---|
| **Cost** | FREE | FREE (up to 3,000/month) |
| **Setup Time** | **3 minutes** | 5 minutes |
| **Signup Required** | **No** (use existing Gmail) | Yes (new account) |
| **Daily Limit** | **500 emails/day** | 100 emails/day |
| **Monthly Limit** | **~15,000 emails** | 3,000 emails/month |
| **Best For** | **Small businesses** | Startups with analytics needs |
| **Domain** | Your Gmail address | Can verify custom domain |
| **Deliverability** | Excellent (Google's reputation) | Excellent |
| **Setup Complexity** | Simple (just App Password) | Requires API key |

---

## 🎯 Recommendation

### Start with Gmail if:
- ✅ You want to get started **immediately** (3 minutes)
- ✅ You already have a Gmail/Google Workspace account
- ✅ You want **FREE** unlimited emails (within 500/day limit)
- ✅ You don't want to sign up for another service
- ✅ You're okay with emails coming from your Gmail address

### Choose Resend if:
- ✅ You need custom domain email (hello@nriwealthpartners.com)
- ✅ You want detailed analytics and tracking
- ✅ You need webhook support
- ✅ You prefer a dedicated email API service

---

## 🚀 Quick Setup Links

### Gmail SMTP (3 minutes)
📖 **Full Guide:** [GMAIL-SETUP.md](./GMAIL-SETUP.md)

**Quick Steps:**
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```bash
   GMAIL_USER=support@nriwealthpartners.com
   GMAIL_APP_PASSWORD=your_16_char_password
   CONTACT_EMAIL=support@nriwealthpartners.com
   ```
4. Restart server: `npm run dev`

---

### Resend (5 minutes)
📖 **Full Guide:** [EMAIL-SETUP.md](./EMAIL-SETUP.md)

**Quick Steps:**
1. Sign up: https://resend.com
2. Get API key from dashboard
3. Add to `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=onboarding@resend.dev
   CONTACT_EMAIL=support@nriwealthpartners.com
   ```
4. Restart server: `npm run dev`

---

## 💡 Can I Use Both?

**Yes!** The system automatically uses whichever service you configure:
- If **Gmail** is configured → Uses Gmail SMTP
- If **Resend** is configured → Uses Resend API
- If **both** are configured → **Gmail takes priority**
- If **neither** is configured → Logs to console (dev mode)

---

## 🎯 My Recommendation

**Start with Gmail** because:
1. **Faster setup** (you already have Gmail)
2. **Higher limits** (500/day vs 100/day)
3. **No signup needed**
4. **More emails per month** (15,000 vs 3,000)

You can always **switch to Resend later** if you need:
- Custom domain (hello@nriwealthpartners.com instead of Gmail)
- Advanced analytics
- Webhook notifications

---

## 📊 Detailed Limits

### Gmail Free Account
- **Daily:** 500 emails
- **Monthly:** ~15,000 emails
- **Per email:** 100 recipients
- **Cost:** FREE
- **Overage:** Temporary 24-hour block

### Gmail Workspace (Paid)
- **Daily:** 2,000 emails
- **Monthly:** ~60,000 emails
- **Cost:** ₹125/user/month (Basic)
- **Benefits:** Custom domain, better deliverability

### Resend Free Tier
- **Daily:** 100 emails
- **Monthly:** 3,000 emails
- **Cost:** FREE
- **Overage:** Emails rejected

### Resend Paid Plans
- **Pro:** $20/month → 50,000 emails/month
- **Business:** $80/month → 100,000 emails/month

---

## ✅ What You Get (Both Services)

Every contact form submission automatically:

1. ✅ Sends email to support team (support@nriwealthpartners.com)
2. ✅ Sends auto-reply to user
3. ✅ Professional HTML templates with brand colors
4. ✅ All form data beautifully formatted
5. ✅ Reply-to set to user's email
6. ✅ Timestamp in IST
7. ✅ SEBI disclaimer in footer
8. ✅ WhatsApp button in auto-reply
9. ✅ Business hours information
10. ✅ Error handling and logging

---

## 🔧 Technical Details

### How It Works

**Your code automatically detects which service is configured:**

```typescript
// Priority order:
1. Gmail configured? → Use Gmail SMTP
2. Resend configured? → Use Resend API
3. Neither configured? → Log to console (dev mode)
```

**Both services send the same professional emails:**
- Same HTML templates
- Same branding
- Same auto-reply
- Same functionality

---

## 🌐 Production Deployment

### Gmail
```bash
gcloud run services update nri-wealth-partners \
  --set-env-vars="GMAIL_USER=support@nriwealthpartners.com,GMAIL_APP_PASSWORD=xxx,CONTACT_EMAIL=support@nriwealthpartners.com"
```

### Resend
```bash
gcloud run services update nri-wealth-partners \
  --set-env-vars="RESEND_API_KEY=re_xxx,RESEND_FROM_EMAIL=hello@nriwealthpartners.com,CONTACT_EMAIL=support@nriwealthpartners.com"
```

---

## 📞 Need Help?

- **Gmail Setup:** See [GMAIL-SETUP.md](./GMAIL-SETUP.md)
- **Resend Setup:** See [EMAIL-SETUP.md](./EMAIL-SETUP.md)
- **Support:** support@nriwealthpartners.com

---

## 🎯 Bottom Line

**Just want emails to work ASAP?**
→ Use Gmail (3 minutes, no signup)

**Want professional custom domain later?**
→ Start with Gmail now, add Resend later when you verify domain

**Want analytics and webhooks?**
→ Use Resend

**Not sure?**
→ Start with Gmail, it's easier! 🚀

---

**Status:** ✅ Both services ready - choose one and configure!
