# 🚀 Webinar System - Quick Start Guide

## ✅ What's Been Created

### 1. **Webinar Website Page** (/webinars)
   - Professional webinar listing page with timezone support
   - Upcoming webinars section with registration CTAs
   - Past webinars section with recordings
   - Recurring series information
   - Mobile-responsive design

### 2. **Navigation Update**
   - "Webinars" link added to main navigation menu
   - Accessible from all pages

### 3. **Complete Google Workspace Integration Guide**
   - Google Forms template structure
   - Google Sheets tracking setup
   - Google Apps Script for email automation (3 scripts)
   - Google Calendar integration
   - Google Meet configuration
   - Complete workflow documentation

---

## 🎯 Next Steps to Launch Your First Webinar

### Step 1: Create Google Form (5 minutes)
1. Go to https://forms.google.com
2. Follow the template in `WEBINAR-SETUP-GUIDE.md` (lines 37-107)
3. Copy the form link

### Step 2: Set Up Google Sheet (2 minutes)
1. In your form, click "Responses" > Create Spreadsheet
2. Add tracking columns (Status, Confirmation Sent, Attended, Feedback)

### Step 3: Add Email Automation (10 minutes)
1. Open Sheet > Extensions > Apps Script
2. Copy-paste the 3 scripts from `WEBINAR-SETUP-GUIDE.md`:
   - onFormSubmit.gs (confirmation emails)
   - reminders.gs (24h and 1h reminders)
   - followup.gs (post-webinar thank you)
3. Update `WEBINAR_CONFIG` with your webinar details
4. Run `setupTriggers()` once

### Step 4: Create Google Meet Event (3 minutes)
1. Google Calendar > Create Event
2. Add Google Meet
3. Copy Meet link and Calendar link

### Step 5: Update Website (5 minutes)
1. Edit `app/webinars/page.tsx`
2. Update the `upcomingWebinars` array (line 26+):
   - Change webinar details
   - Add your Google Form link
   - Update date, time, timezone
   - Update speaker info

### Step 6: Test Everything (5 minutes)
1. Visit http://localhost:3001/webinars
2. Click "Register Now" button
3. Fill out your own form
4. Check if confirmation email arrives
5. Verify registrant appears in Google Sheet

---

## 📊 Sample Webinar Configuration

Here's how to configure your first webinar in the website:

```typescript
// In app/webinars/page.tsx, upcomingWebinars array:

{
  id: "year-end-tax-2024",
  title: "Year-End Tax Planning for NRIs - FY 2024-25",
  description: "Comprehensive guide to maximize tax savings before financial year end.",
  speaker: "Anil Parekh",
  speakerTitle: "Chartered Accountant",
  speakerImage: "/images/team/anil-parekh.jpg",
  date: "2024-12-15", // YYYY-MM-DD format
  time: "19:00", // 24-hour format
  timezone: "EST",
  duration: "60 mins",
  registrationLink: "https://forms.gle/YOUR-FORM-LINK-HERE", // ← Add your Google Form link
  topics: [
    "Section 80C to 80U deductions",
    "Old vs New tax regime comparison",
    "TDS and advance tax planning",
    "Last-minute investment options"
  ],
  audience: "NRIs in USA, Canada",
  seats: 100,
  registered: 0 // Update manually or automate later
}
```

---

## 🎬 Complete Workflow

### **Before Webinar** (1-2 weeks ahead)
✅ Create Google Form
✅ Link to Google Sheet
✅ Set up Apps Script
✅ Create Calendar event + Meet link
✅ Update website with details
✅ Test registration flow
✅ Promote on email/social media

### **24 Hours Before**
✅ Run `send24HourReminder()` script (or set up trigger)
✅ Prepare slides
✅ Test Meet connection

### **1 Hour Before**
✅ Run `send1HourReminder()` script
✅ Join Meet 15 min early
✅ Test audio/video

### **During Webinar**
✅ Record session
✅ Note attendees
✅ Save Q&A

### **After Webinar**
✅ Upload recording to YouTube (unlisted)
✅ Upload slides to Google Drive
✅ Run `sendPostWebinarEmail()` script
✅ Update website - move to Past Webinars
✅ Collect feedback

---

## 📁 File Locations

| File | Purpose | Location |
|------|---------|----------|
| Webinar Page | Main webinar listing | `app/webinars/page.tsx` |
| Setup Guide | Complete documentation | `WEBINAR-SETUP-GUIDE.md` |
| Header Nav | Navigation menu | `components/navigation/header.tsx` |
| Quick Start | This guide | `WEBINAR-QUICK-START.md` |

---

## 🔗 Important Links

**Local Website:**
- Webinars Page: http://localhost:3001/webinars
- Full Site: http://localhost:3001

**Public URL (for partners):**
- https://nriwealthpartners.loca.lt/webinars
- (Password: Click "Submit" or enter "127.0.0.1:3001")

**Google Workspace:**
- Forms: https://forms.google.com
- Sheets: https://sheets.google.com
- Calendar: https://calendar.google.com
- Meet: https://meet.google.com

---

## 💡 Pro Tips

1. **Schedule Wisely**: Best times for NRI webinars:
   - USA/Canada: 7-8 PM EST on weekends
   - UK/Europe: 7-8 PM GMT on weekdays
   - Middle East: 8 PM GST on weekdays

2. **Email Templates**: Personalize the email scripts with your branding

3. **Timezone Converter**: Website has built-in timezone selector

4. **Recording Quality**: Use good lighting and microphone

5. **Engagement**: Enable Q&A and chat in Meet settings

6. **Follow-up**: Send recording within 24 hours for max engagement

---

## 🆘 Need Help?

1. **Full Documentation**: See `WEBINAR-SETUP-GUIDE.md` for detailed instructions
2. **Google Apps Script Issues**: Check execution logs in Apps Script editor
3. **Email Not Sending**: Verify Gmail quota (500/day for free accounts)
4. **Website Updates**: Edit `app/webinars/page.tsx` and save

---

## ✨ Features Included

✅ Professional webinar landing page
✅ Timezone support for global NRIs
✅ Registration tracking
✅ Automated confirmation emails
✅ 24h and 1h reminder emails
✅ Post-webinar thank you emails
✅ Recording and slides distribution
✅ Feedback collection
✅ Past webinar library
✅ Mobile-responsive design
✅ Google Workspace integration
✅ Complete automation scripts

---

**You're all set! Ready to host your first webinar! 🎉**

Questions? Check the full guide in `WEBINAR-SETUP-GUIDE.md`
