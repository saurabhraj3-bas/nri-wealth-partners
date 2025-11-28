# Super Admin User Guide - NRI Wealth Partners

## Overview
As a **Super Admin**, you have full access to all administrative features of the NRI Wealth Partners platform, including user management, content management, and system configuration.

---

## Table of Contents
1. [Logging In](#logging-in)
2. [Dashboard Overview](#dashboard-overview)
3. [Admin User Management](#admin-user-management)
4. [Newsletter Management](#newsletter-management)
5. [News Management](#news-management)
6. [Subscriber Management](#subscriber-management)
7. [Analytics & Reporting](#analytics--reporting)
8. [Account Management](#account-management)

---

## Logging In

### Access URL
**Production**: https://nri-wealth-partners-979245985437.us-central1.run.app/auth/admin

### Credentials
- **Email**: Your admin email address
- **Password**: Provided by the system administrator

### First-Time Login
1. Navigate to the admin login page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the Super Admin Dashboard

---

## Dashboard Overview

### Main Navigation
After logging in, you'll see the main dashboard with the following sections:

- **Dashboard** - Overview of system metrics
- **Admin Management** - Manage admin users (Super Admin only)
- **Newsletter** - Create and manage newsletters
- **News** - Moderate news articles
- **Subscribers** - View and manage email subscribers
- **Analytics** - View engagement metrics
- **Settings** - System configuration

### Key Metrics Displayed
- Total subscribers
- Newsletter open rates
- Recent admin activity
- Content moderation queue

---

## Admin User Management

### Creating New Admin Users

1. **Navigate to Admin Management**
   - Click "Admin Management" in the sidebar
   - Click "+ Create New Admin" button

2. **Fill in Admin Details**
   ```
   Full Name: John Doe
   Email: john@nriwealthpartners.com
   Role: Select from dropdown (admin or super_admin)
   Initial Password: Auto-generated or custom
   ```

3. **Set Permissions** (for regular admin role)
   - ✅ Manage Webinars
   - ✅ Draft Newsletter
   - ✅ Publish Newsletter
   - ✅ Manage Subscribers
   - ✅ View Analytics
   - ✅ Export Data
   - ❌ Manage Admins (Super Admin only)
   - ❌ Delete Content (Super Admin only)

4. **Send Invitation**
   - Click "Create Admin"
   - System will send an invitation email with temporary password
   - Admin must change password on first login

### Managing Existing Admins

**View All Admins**:
- Navigate to "Admin Management"
- View list with status, role, and last login

**Edit Admin**:
1. Click on admin name or "Edit" button
2. Modify permissions or role
3. Click "Save Changes"

**Deactivate Admin**:
1. Click "Actions" → "Deactivate"
2. Confirm action
3. Admin will no longer be able to log in

**Reactivate Admin**:
1. Filter by "Inactive" status
2. Click "Reactivate" on desired admin

**Delete Admin** (Permanent):
1. Click "Actions" → "Delete"
2. Type admin email to confirm
3. Click "Permanently Delete"

---

## Newsletter Management

### Creating a New Newsletter

1. **Start a Draft**
   - Navigate to "Newsletter" → "Create New"
   - Enter issue number and week range
   - Add subject line and preview text

2. **Curate Content**
   - **AI-Assisted Curation**:
     - Click "AI Curate Articles"
     - System will fetch and rank articles from 19+ sources
     - Review AI-suggested articles by relevance score

   - **Manual Addition**:
     - Click "Add Article Manually"
     - Paste article URL or enter details
     - AI will generate summary and key takeaways

3. **Organize Sections**
   - **Success Stories**: NRI investment wins and wealth journeys
   - **Regulatory Updates**: Tax, FEMA, compliance changes
   - **Financial Insights**: Market analysis, investment strategies
   - **Community News**: NRI community events and updates

4. **Add Commentary**
   - Write opening message
   - Add expert commentary (optional)
   - Write closing message

5. **Preview Newsletter**
   - Click "Preview" to see email rendering
   - Test on desktop and mobile views

6. **Publishing Workflow**
   - Save as Draft → Submit for Review → Approve → Schedule → Send

### Newsletter Best Practices
- **Timing**: Send on Mondays at 9:00 AM IST
- **Length**: 12-15 articles across 4 sections
- **Relevance**: Ensure 8+ relevance score for all articles
- **Testing**: Always send test email before publishing

---

## News Management

### Real-Time News Moderation

1. **Access News Dashboard**
   - Navigate to "News" → "Manage Articles"
   - View all published news articles

2. **Moderate Content**
   - **Delete Article**:
     - Click trash icon next to article
     - Confirm deletion
     - Article is immediately removed from public view

   - **Why Delete?**:
     - Outdated information
     - Incorrect or misleading content
     - Duplicate articles
     - Off-topic content

3. **Add Manual News Entry** (if needed)
   - Click "+ Add News Article"
   - Enter title, description, source URL
   - Select category (immigration, tax, investment, market)
   - Add tags for searchability
   - Set publish date
   - Click "Publish"

### News Categories
- **Immigration**: Visa updates, OCI/PIO changes
- **Tax & Compliance**: DTAA, TDS, filing deadlines
- **Investment**: NRE/NRO accounts, mutual funds, real estate
- **Market Updates**: Currency rates, stock market trends

---

## Subscriber Management

### View Subscribers
- Navigate to "Subscribers"
- View total count and growth trends
- Filter by:
  - Status (active, unsubscribed, bounced)
  - Country
  - Subscription date
  - Interests

### Export Subscriber Data
1. Click "Export" button
2. Select format (CSV, Excel)
3. Choose fields to export
4. Download file

### Handle Unsubscribes
- System automatically processes unsubscribe requests
- View unsubscribe reasons in Analytics
- Re-subscription allowed if user requests

### Manage Bounced Emails
1. Filter by "Bounced" status
2. Review bounce reasons:
   - Hard bounce (invalid email) → Auto-removed after 3 attempts
   - Soft bounce (temporary) → Retried automatically

---

## Analytics & Reporting

### Newsletter Performance
- **Open Rate**: Industry benchmark 15-25%, NRI WP target: 40%+
- **Click Rate**: Measure engagement with article links
- **Device Breakdown**: Desktop vs. mobile opens
- **Geographic Distribution**: Top countries

### Engagement Trends
- Subscriber growth over time
- Most popular article categories
- Peak engagement times
- Unsubscribe rate (target: <2%)

### Export Reports
1. Navigate to "Analytics" → "Reports"
2. Select date range
3. Choose metrics to include
4. Export as PDF or Excel

---

## Account Management

### Change Your Password
1. Click your name in top-right corner
2. Select "Change Password"
3. Enter current password
4. Enter new password (min. 12 characters)
5. Confirm new password
6. Click "Update Password"

### Password Requirements
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Forgot Password
1. On login page, click "Forgot Password?"
2. Enter your admin email
3. Check email for reset link (valid for 1 hour)
4. Click link and create new password

### Two-Factor Authentication (2FA)
Coming soon - will be mandatory for all Super Admins

---

## Super Admin Exclusive Features

### System Configuration
- Manage email templates
- Configure API integrations (Google Sheets, AI, etc.)
- Set rate limits and quotas
- View system logs and errors

### Bulk Operations
- Bulk import subscribers
- Bulk update admin permissions
- Bulk delete old content

### Data Exports
- Export all newsletters (HTML, PDF)
- Export full subscriber database
- Export system audit logs

### Emergency Actions
- **Pause Newsletter Sending**: Stop all outgoing emails
- **Rollback Newsletter**: Recall sent email (Gmail only, within 30 seconds)
- **Emergency Broadcast**: Send urgent message to all subscribers

---

## Troubleshooting

### Common Issues

**Q: Newsletter won't publish**
- Check: All sections have content
- Check: Subject line and preview text are filled
- Check: At least 8 articles added

**Q: Admin can't log in**
- Verify email is correct
- Check if admin status is "Active"
- Try password reset

**Q: AI curation not working**
- Check Google AI API quota in settings
- Verify Google Sheets connection
- Contact tech support if issue persists

### Getting Help
- **Technical Support**: support@nriwealthpartners.com
- **System Status**: https://status.nriwealthpartners.com (future)
- **Documentation**: /docs folder in project

---

## Best Practices

### Security
- ✅ Change password every 90 days
- ✅ Never share admin credentials
- ✅ Log out when leaving computer unattended
- ✅ Review admin access logs monthly
- ❌ Don't use public/shared computers for admin access

### Content Management
- ✅ Proofread all content before publishing
- ✅ Maintain consistent tone and voice
- ✅ Credit all sources properly
- ✅ Archive old newsletters for reference

### Subscriber Relations
- ✅ Respond to subscriber feedback within 24 hours
- ✅ Monitor unsubscribe reasons weekly
- ✅ A/B test subject lines for optimization

---

## Quick Reference

### Keyboard Shortcuts
- `Ctrl+S` or `Cmd+S`: Save draft
- `Ctrl+P` or `Cmd+P`: Preview
- `Ctrl+Shift+P`: Publish

### Important Links
- **Production Site**: https://nri-wealth-partners-979245985437.us-central1.run.app
- **Admin Portal**: https://nri-wealth-partners-979245985437.us-central1.run.app/auth/admin
- **Firebase Console**: https://console.firebase.google.com/project/nri-wealth-partners
- **Google Cloud Console**: https://console.cloud.google.com/run?project=nri-wealth-partners

### Support Contacts
- **Tech Support**: tech@nriwealthpartners.com
- **Super Admin Lead**: admin@nriwealthpartners.com

---

*Last Updated: November 28, 2025*
*Version: 1.0*
