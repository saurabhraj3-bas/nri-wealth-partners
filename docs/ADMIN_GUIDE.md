# Admin User Guide - NRI Wealth Partners

## Overview
As an **Admin**, you have access to content management features including newsletter creation, news moderation, and subscriber management. This guide will help you navigate the admin portal and perform your daily tasks effectively.

---

## Table of Contents
1. [Logging In](#logging-in)
2. [Dashboard Overview](#dashboard-overview)
3. [Newsletter Management](#newsletter-management)
4. [News Moderation](#news-moderation)
5. [Subscriber Insights](#subscriber-insights)
6. [Analytics Access](#analytics-access)
7. [Account Management](#account-management)

---

## Logging In

### Access URL
**Production**: https://nri-wealth-partners-979245985437.us-central1.run.app/auth/admin

### First-Time Login
1. Check your email for the invitation from NRI Wealth Partners
2. Click the link in the email
3. Enter the temporary password provided
4. You'll be prompted to create a new password
5. Follow password requirements (12+ characters, mixed case, numbers, special chars)
6. Click "Set New Password"
7. You'll be redirected to the Admin Dashboard

### Subsequent Logins
1. Navigate to the admin portal URL
2. Enter your email and password
3. Click "Sign In"

---

## Dashboard Overview

### Your Main Navigation
After logging in, you'll see these sections (based on your permissions):

- **Dashboard** - Overview of your content metrics
- **Newsletter** - Create and manage newsletters
- **News** - Moderate news articles
- **Subscribers** - View subscriber data
- **Analytics** - View engagement metrics
- **My Account** - Manage your profile and password

### Dashboard Widgets
- Newsletter drafts and status
- Recent news articles
- Subscriber count and trends
- Your recent activity

---

## Newsletter Management

### Your Newsletter Workflow

As an Admin, you can draft and (depending on permissions) publish newsletters. Here's the complete workflow:

### Step 1: Create a New Newsletter

1. **Navigate to Newsletter Section**
   - Click "Newsletter" in the sidebar
   - Click "+ Create New Issue" button

2. **Set Basic Information**
   ```
   Issue Number: 26 (auto-incremented)
   Week Range: Nov 18-24, 2025
   Subject Line: "Your Weekly NRI Wealth Brief - Issue #26"
   Preview Text: "This week: Tax planning updates, UAE investment opportunities, and success stories"
   ```

### Step 2: Curate Articles Using AI

1. **Run AI Curation**
   - Click "AI Curate Articles" button
   - System will analyze 19+ trusted sources
   - Articles are ranked by relevance score (0-10)

2. **Review AI Suggestions**
   - Each article shows:
     - Headline and summary
     - Source and publish date
     - Relevance score (aim for 8+)
     - Key takeaways

3. **Select Articles**
   - Click "Add to Newsletter" on relevant articles
   - Assign to appropriate section:
     - 🏆 **Success Stories**: NRI investment wins
     - 📋 **Regulatory Updates**: Tax, FEMA, compliance
     - 💰 **Financial Insights**: Market analysis, strategies
     - 👥 **Community News**: Events, meetups

### Step 3: Add Manual Articles (Optional)

If you have a specific article to include:

1. Click "+ Add Article Manually"
2. Enter or paste article URL
3. OR manually enter details:
   - Title
   - Summary
   - Source
   - URL
4. AI will auto-generate key takeaways
5. Review and edit as needed
6. Assign to section

### Step 4: Write Commentary

1. **Opening Message**
   - Greet subscribers
   - Preview this week's highlights
   - Keep it warm and personal

2. **Admin Commentary** (Optional)
   - Add your expert insights
   - Explain why certain news matters
   - Connect dots between stories

3. **Closing Message**
   - Summary of key actions
   - Reminder of next issue
   - Call to action if needed

### Step 5: Preview & Test

1. **Preview Newsletter**
   - Click "Preview" button
   - Review on desktop view
   - Check mobile responsiveness
   - Verify all links work

2. **Send Test Email**
   - Enter your email
   - Click "Send Test"
   - Check your inbox
   - Review formatting and rendering

### Step 6: Publishing (Based on Permissions)

**If you have "Draft Newsletter" permission only**:
1. Click "Save as Draft"
2. Click "Submit for Review"
3. Notify Super Admin for approval

**If you have "Publish Newsletter" permission**:
1. Review all content one final time
2. Click "Approve & Schedule"
3. Select send time (recommended: Monday 9:00 AM IST)
4. Click "Schedule Send"
5. System will send automatically at scheduled time

### Newsletter Best Practices

✅ **Content Quality**
- Aim for 12-15 articles total
- Only include articles with relevance score 8+
- Ensure good mix across all 4 sections
- Verify all links before publishing

✅ **Tone & Voice**
- Professional but friendly
- Use "you" to address readers
- Avoid jargon or explain terms
- Keep paragraphs short for readability

✅ **Timing**
- Publish on Mondays (highest open rates)
- Send at 9:00 AM IST
- Avoid holidays and weekends

✅ **Testing**
- ALWAYS send test email to yourself
- Check on both desktop and mobile
- Click all links to verify
- Review spelling and grammar

❌ **Common Mistakes to Avoid**
- Don't include too many articles (15 max)
- Don't use generic subject lines
- Don't forget to add commentary
- Don't skip the preview step

---

## News Moderation

### Managing the News Feed

The news feed on `/resources` shows real-time news articles. As an Admin, you can moderate this content:

### View All News Articles

1. Navigate to "News" → "Manage Articles"
2. You'll see a list of all published articles with:
   - Title and description
   - Category (Immigration, Tax, Investment, Market)
   - Source and publish date
   - View count

### Delete Inappropriate Content

**When to Delete**:
- Outdated information (>90 days old)
- Duplicate articles
- Incorrect or misleading information
- Off-topic content not relevant to NRIs
- Broken links

**How to Delete**:
1. Find the article in the list
2. Click the trash icon
3. Confirm deletion
4. Article is immediately removed from public view

### Add Manual News Entry

If you find an important article that wasn't auto-aggregated:

1. Click "+ Add News Article"
2. Fill in details:
   ```
   Title: New FEMA Guidelines for NRE Accounts
   Description: RBI announces updated guidelines for NRE account holders...
   Category: Tax & Compliance
   Source: Reserve Bank of India
   URL: https://rbi.org.in/...
   Tags: fema, nre, accounts, rbi
   ```
3. Click "Publish"
4. Article appears immediately on the news feed

### News Categories Explained

- **Immigration**: Visa updates, OCI/PIO changes, passport services
- **Tax & Compliance**: DTAA, TDS rates, ITR filing, FEMA rules
- **Investment**: NRE/NRO accounts, mutual funds, stocks, real estate
- **Market Updates**: Exchange rates, stock indices, commodity prices

---

## Subscriber Insights

### View Subscriber Data

1. Navigate to "Subscribers"
2. See total subscriber count
3. Filter by:
   - Country of residence
   - Subscription date
   - Status (active/unsubscribed)
   - Interests selected

### Understanding Subscriber Metrics

- **Growth Rate**: New subscribers per week
- **Top Countries**: USA, UAE, UK, Canada typically lead
- **Interests**: What topics subscribers care about
- **Unsubscribe Rate**: Target <2% per campaign

### Export Subscriber List (if permitted)

1. Click "Export" button
2. Select date range
3. Choose format (CSV or Excel)
4. Click "Download"

**Note**: Use exported data responsibly and never share externally.

---

## Analytics Access

### Newsletter Performance Metrics

1. Navigate to "Analytics" → "Newsletter"
2. View metrics for each issue:
   - **Open Rate**: % of subscribers who opened (target: 40%+)
   - **Click Rate**: % who clicked any link (target: 10%+)
   - **Unsubscribe Rate**: % who unsubscribed (target: <2%)
   - **Bounce Rate**: Invalid/inactive emails

### Engagement Insights

**Top Performing Articles**:
- See which articles get most clicks
- Learn what topics resonate
- Inform future curation

**Geographic Distribution**:
- Which countries engage most
- Time zone considerations
- Regional content preferences

**Device Breakdown**:
- Desktop vs. mobile opens
- Optimize formatting accordingly

### Using Analytics to Improve

✅ **Low Open Rate (<30%)**:
- Test different subject lines
- Experiment with send times
- Segment audience by interests

✅ **High Unsubscribe Rate (>3%)**:
- Review content relevance
- Check email frequency
- Survey unsubscribers for feedback

✅ **Low Click Rate (<5%)**:
- Improve article headlines
- Add stronger calls-to-action
- Feature more engaging content

---

## Account Management

### Change Your Password

1. Click your name/email in top-right corner
2. Select "Change Password"
3. Enter your current password
4. Enter new password
5. Confirm new password
6. Click "Update Password"

### Password Requirements
- ✅ Minimum 12 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)
- ✅ At least 1 special character (!@#$%^&*)

**Example Strong Passwords**:
- `MyNRI@Pass2025!`
- `Wealth$Partner#123`
- `Admin!NewDelhi456`

### Forgot Password

1. On login page, click "Forgot Password?"
2. Enter your admin email
3. Check email for reset link
4. Link is valid for 1 hour
5. Click link and create new password

### Update Profile Information

1. Navigate to "My Account"
2. Update:
   - Display name
   - Contact email (different from login email)
   - Notification preferences
3. Click "Save Changes"

---

## Permission Levels

As an Admin, your specific permissions may vary. Here's what each permission allows:

| Permission | What It Allows |
|------------|----------------|
| **Draft Newsletter** | Create and save newsletter drafts; submit for review |
| **Publish Newsletter** | Approve and schedule newsletter sending (full control) |
| **Manage Subscribers** | View subscriber data, export lists |
| **View Analytics** | Access all performance metrics and reports |
| **Export Data** | Download subscriber lists and analytics reports |
| **Manage Webinars** | Create and manage webinar listings (future feature) |
| **Delete Content** | Remove news articles and old newsletters (Super Admin only) |
| **Manage Admins** | Create/edit/delete admin users (Super Admin only) |

**To Request Additional Permissions**:
Contact your Super Admin at admin@nriwealthpartners.com

---

## Troubleshooting

### Common Issues & Solutions

**Q: I can't access a certain feature**
- **A**: Check your permission level. Contact Super Admin if you need additional access.

**Q: Newsletter preview looks broken**
- **A**: Clear your browser cache. Try a different browser. Ensure all articles have been saved.

**Q: AI curation is slow or failing**
- **A**: This may be due to API limits. Wait 5 minutes and try again. If persists, contact tech support.

**Q: Test email not arriving**
- **A**: Check spam folder. Verify email address is correct. Try different email provider.

**Q: Can't delete a news article**
- **A**: Ensure you have delete permissions. Refresh the page and try again.

---

## Getting Help

### Support Channels

**Technical Support**:
- Email: support@nriwealthpartners.com
- Response time: Within 24 hours

**Super Admin Contact**:
- Email: admin@nriwealthpartners.com
- For permission requests, account issues

**Documentation**:
- This guide: `/docs/ADMIN_GUIDE.md`
- Super Admin guide: `/docs/SUPER_ADMIN_GUIDE.md` (view only)
- Technical docs: `/docs/` folder

---

## Quick Reference

### Recommended Schedule

**Monday Morning**:
- Draft newsletter for the week
- Review AI-curated articles
- Write commentary

**Monday Afternoon**:
- Preview and test newsletter
- Submit for review OR publish (based on permissions)

**Tuesday-Friday**:
- Moderate news articles
- Delete outdated/duplicate content
- Monitor subscriber feedback

**Friday**:
- Review weekly analytics
- Note topics that performed well
- Plan next week's focus

### Keyboard Shortcuts

- `Ctrl+S` or `Cmd+S`: Save draft
- `Ctrl+P` or `Cmd+P`: Preview newsletter
- `Esc`: Close modal/dialog

### Important Links

- **Admin Portal**: https://nri-wealth-partners-979245985437.us-central1.run.app/auth/admin
- **Public Site**: https://nri-wealth-partners-979245985437.us-central1.run.app
- **Resources Page**: https://nri-wealth-partners-979245985437.us-central1.run.app/resources

---

## Best Practices Summary

✅ **Content Management**
- Quality over quantity
- Verify all sources
- Keep content timely and relevant
- Proofread before publishing

✅ **Security**
- Change password every 90 days
- Never share login credentials
- Log out when done
- Don't access from public computers

✅ **Communication**
- Respond to subscriber emails within 48 hours
- Maintain professional tone
- Be helpful and informative

---

*Last Updated: November 28, 2025*
*Version: 1.0*

*For questions or updates to this guide, contact: admin@nriwealthpartners.com*
