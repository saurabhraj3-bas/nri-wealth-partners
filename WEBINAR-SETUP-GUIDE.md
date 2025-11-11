# 🎓 NRI Wealth Partners - Webinar System Setup Guide

Complete guide to set up and manage webinars using Google Workspace integration.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Google Forms Setup](#google-forms-setup)
3. [Google Sheets Configuration](#google-sheets-configuration)
4. [Google Apps Script - Email Automation](#google-apps-script---email-automation)
5. [Google Calendar Integration](#google-calendar-integration)
6. [Google Meet Setup](#google-meet-setup)
7. [Complete Workflow](#complete-workflow)
8. [Updating Website with New Webinars](#updating-website-with-new-webinars)
9. [Best Practices](#best-practices)

---

## 🎯 Overview

Your webinar system consists of:
- **Website**: `/webinars` page for promotion and registration
- **Google Forms**: Collect registrations
- **Google Sheets**: Store and manage registrant data
- **Google Apps Script**: Automate emails (confirmation, reminders)
- **Google Calendar**: Schedule events
- **Google Meet**: Host webinars
- **Gmail**: Send automated communications

---

## 📝 Google Forms Setup

### Step 1: Create Registration Form

1. Go to **https://forms.google.com**
2. Click **"Blank"** to create a new form
3. Title: `Webinar Registration - [Topic Name]`

### Step 2: Add Form Questions

Copy this structure for your registration form:

**Section 1: Personal Information**

1. **Full Name**
   - Type: Short answer
   - Required: Yes

2. **Email Address**
   - Type: Short answer
   - Required: Yes
   - Validation: Response validation > Text > Email

3. **Phone Number (with country code)**
   - Type: Short answer
   - Required: No
   - Description: "E.g., +1-234-567-8900"

4. **Current Country of Residence**
   - Type: Dropdown
   - Options:
     - United States
     - United Kingdom
     - United Arab Emirates
     - Saudi Arabia
     - Singapore
     - Australia
     - Canada
     - Other
   - Required: Yes

**Section 2: Professional Background**

5. **Occupation**
   - Type: Short answer
   - Required: No

6. **Current Investment Experience**
   - Type: Multiple choice
   - Options:
     - Beginner (0-2 years)
     - Intermediate (2-5 years)
     - Advanced (5+ years)
   - Required: No

**Section 3: Webinar-Specific**

7. **What do you hope to learn from this webinar?**
   - Type: Paragraph
   - Required: No

8. **Do you have any specific questions you'd like addressed?**
   - Type: Paragraph
   - Required: No

**Section 4: Communication Preferences**

9. **Preferred Timezone**
   - Type: Dropdown
   - Options:
     - EST (USA East Coast)
     - PST (USA West Coast)
     - GMT (UK)
     - GST (UAE/Middle East)
     - SGT (Singapore)
     - AEDT (Australia)
     - IST (India)
   - Required: Yes

10. **Subscribe to future webinar updates?**
    - Type: Multiple choice
    - Options:
      - Yes, keep me informed
      - No thanks
    - Required: Yes

### Step 3: Configure Form Settings

1. Click **Settings** (gear icon)
2. **General Tab**:
   - ☑ Limit to 1 response (requires login)
   - ☑ Collect email addresses
3. **Presentation Tab**:
   - ☑ Show progress bar
   - Confirmation message:
     ```
     Thank you for registering!

     You'll receive a confirmation email shortly with the webinar details
     and Google Meet link.

     See you soon!
     - NRI Wealth Partners Team
     ```
4. Click **"Responses"** tab
5. Click **green Sheets icon** to create linked spreadsheet
6. Name it: `Webinar Registrations - [Topic Name]`

### Step 4: Get Form Link

1. Click **"Send"** button (top right)
2. Click **Link icon** (chain)
3. Click **"Shorten URL"** checkbox
4. Copy the link
5. **Paste this link** in your `app/webinars/page.tsx` file in the `registrationLink` field

**Example:**
```typescript
registrationLink: "https://forms.gle/abc123xyz",
```

---

## 📊 Google Sheets Configuration

### Sheet Structure

Your linked Google Sheet should have these columns (automatically created by form):

| Column | Description |
|--------|-------------|
| A: Timestamp | Auto-generated |
| B: Email Address | From form |
| C: Full Name | From form |
| D: Phone Number | From form |
| E: Country | From form |
| F: Occupation | From form |
| G: Investment Experience | From form |
| H: Learning Goals | From form |
| I: Questions | From form |
| J: Timezone | From form |
| K: Subscribe to Updates | From form |

### Add Additional Columns for Tracking

Add these columns manually after column K:

| Column | Purpose | Formula/Value |
|--------|---------|---------------|
| L: Status | Track registration status | Default: "Registered" |
| M: Confirmation Sent | Track email sent | Populated by script |
| N: Attended | Mark attendance | Fill after webinar |
| O: Feedback Submitted | Track feedback | Fill after feedback |

---

## 🤖 Google Apps Script - Email Automation

### Step 1: Open Script Editor

1. Open your Google Sheet (Webinar Registrations)
2. Click **Extensions** > **Apps Script**
3. Delete default code
4. Name project: `Webinar Email Automation`

### Step 2: Create Email Templates

**Script 1: Confirmation Email (onFormSubmit.gs)**

```javascript
/**
 * Webinar Registration Confirmation Email Automation
 * Triggers: On Form Submit
 */

// Configuration
const WEBINAR_CONFIG = {
  title: "Year-End Tax Planning for NRIs - FY 2024-25",
  date: "Saturday, December 15, 2024",
  time: "7:00 PM EST / 5:30 AM IST",
  duration: "60 minutes",
  meetLink: "https://meet.google.com/xxx-yyyy-zzz", // Replace with actual Meet link
  speaker: "CA Anil Parekh",
  calendarLink: "https://calendar.google.com/calendar/event?action=TEMPLATE&...", // Add to calendar link
  companyEmail: "contact@nriwealthpartners.com"
};

/**
 * Main function - triggers on form submission
 */
function onFormSubmit(e) {
  try {
    // Get form response
    const responses = e.values;
    const timestamp = responses[0];
    const email = responses[1];
    const fullName = responses[2];
    const phone = responses[3];
    const country = responses[4];
    const timezone = responses[9];

    // Send confirmation email
    sendConfirmationEmail(email, fullName, timezone);

    // Log in sheet
    logEmailSent(email, "Confirmation");

  } catch (error) {
    console.error("Error in onFormSubmit:", error);
    // Notify admin of error
    MailApp.sendEmail({
      to: WEBINAR_CONFIG.companyEmail,
      subject: "Webinar Registration Error",
      body: `Error processing registration: ${error.message}\nTimestamp: ${new Date()}`
    });
  }
}

/**
 * Send confirmation email to registrant
 */
function sendConfirmationEmail(email, name, timezone) {
  const subject = `✅ You're Registered! ${WEBINAR_CONFIG.title}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 15px 30px; background: #f97316; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 Registration Confirmed!</h1>
    </div>

    <div class="content">
      <p>Dear ${name},</p>

      <p>Thank you for registering for our upcoming webinar! We're excited to have you join us.</p>

      <div class="details">
        <h2 style="color: #1e3a5f; margin-top: 0;">📅 Webinar Details</h2>
        <p><strong>Topic:</strong> ${WEBINAR_CONFIG.title}</p>
        <p><strong>Date:</strong> ${WEBINAR_CONFIG.date}</p>
        <p><strong>Time:</strong> ${WEBINAR_CONFIG.time}</p>
        <p><strong>Duration:</strong> ${WEBINAR_CONFIG.duration}</p>
        <p><strong>Speaker:</strong> ${WEBINAR_CONFIG.speaker}</p>
        <p><strong>Your Timezone:</strong> ${timezone}</p>
      </div>

      <div style="text-align: center;">
        <a href="${WEBINAR_CONFIG.meetLink}" class="button">Join Webinar (Save this link!)</a>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${WEBINAR_CONFIG.calendarLink}" style="color: #2563eb; text-decoration: none;">📆 Add to Calendar</a>
      </div>

      <h3 style="color: #1e3a5f;">What to Expect:</h3>
      <ul>
        <li>Expert insights from ${WEBINAR_CONFIG.speaker}</li>
        <li>Live Q&A session</li>
        <li>Downloadable resources and slides</li>
        <li>Practical, actionable strategies</li>
      </ul>

      <h3 style="color: #1e3a5f;">Before the Webinar:</h3>
      <ul>
        <li>Test your Google Meet connection 5 minutes before</li>
        <li>Prepare your questions for the Q&A</li>
        <li>Have a notepad ready for key takeaways</li>
      </ul>

      <p><strong>Reminders:</strong> We'll send you reminder emails 24 hours and 1 hour before the webinar.</p>

      <p>If you have any questions, reply to this email or contact us at ${WEBINAR_CONFIG.companyEmail}.</p>

      <p>Looking forward to seeing you!</p>

      <p>Best regards,<br>
      <strong>NRI Wealth Partners Team</strong></p>
    </div>

    <div class="footer">
      <p>NRI Wealth Partners | Expert Wealth Management for Non-Resident Indians</p>
      <p><a href="https://nriwealthpartners.com" style="color: #2563eb;">www.nriwealthpartners.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "NRI Wealth Partners"
  });
}

/**
 * Log email sent status in sheet
 */
function logEmailSent(email, emailType) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // Column B (email)

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === email) {
      const row = i + 2;
      sheet.getRange(row, 12).setValue(`${emailType} - ${new Date()}`); // Column L
      break;
    }
  }
}

/**
 * Set up form submit trigger (Run this once manually)
 */
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Create new trigger for form submissions
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();

  console.log("Trigger set up successfully!");
}
```

**Script 2: Reminder Emails (reminders.gs)**

```javascript
/**
 * Send reminder emails before webinar
 * Run these manually or set up time-based triggers
 */

// Use same CONFIG from onFormSubmit.gs
const WEBINAR_CONFIG = {
  title: "Year-End Tax Planning for NRIs - FY 2024-25",
  date: "Saturday, December 15, 2024",
  time: "7:00 PM EST / 5:30 AM IST",
  duration: "60 minutes",
  meetLink: "https://meet.google.com/xxx-yyyy-zzz",
  speaker: "CA Anil Parekh",
  companyEmail: "contact@nriwealthpartners.com"
};

/**
 * Send 24-hour reminder to all registrants
 */
function send24HourReminder() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    console.log("No registrants found");
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 12).getValues();

  data.forEach((row, index) => {
    const email = row[1]; // Column B
    const name = row[2];  // Column C
    const status = row[11]; // Column L

    if (email && status === "Registered") {
      send24HourReminderEmail(email, name);
      Utilities.sleep(1000); // Prevent rate limiting
    }
  });

  console.log("24-hour reminders sent!");
}

/**
 * Send 1-hour reminder to all registrants
 */
function send1HourReminder() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  const data = sheet.getRange(2, 1, lastRow - 1, 12).getValues();

  data.forEach((row, index) => {
    const email = row[1];
    const name = row[2];
    const status = row[11];

    if (email && status === "Registered") {
      send1HourReminderEmail(email, name);
      Utilities.sleep(1000);
    }
  });

  console.log("1-hour reminders sent!");
}

/**
 * 24-hour reminder email template
 */
function send24HourReminderEmail(email, name) {
  const subject = `⏰ Tomorrow! ${WEBINAR_CONFIG.title}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f97316; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 15px 30px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .countdown { background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #f59e0b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⏰ Webinar Tomorrow!</h1>
    </div>

    <div class="content">
      <p>Dear ${name},</p>

      <div class="countdown">
        <h2 style="color: #92400e; margin: 0;">Less than 24 hours to go!</h2>
      </div>

      <p>This is a friendly reminder that our webinar is happening tomorrow:</p>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>📚 Topic:</strong> ${WEBINAR_CONFIG.title}</p>
        <p><strong>📅 Date:</strong> ${WEBINAR_CONFIG.date}</p>
        <p><strong>🕐 Time:</strong> ${WEBINAR_CONFIG.time}</p>
        <p><strong>👨‍💼 Speaker:</strong> ${WEBINAR_CONFIG.speaker}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${WEBINAR_CONFIG.meetLink}" class="button">Join Webinar</a>
      </div>

      <h3 style="color: #1e3a5f;">Quick Preparation Tips:</h3>
      <ul>
        <li>✅ Test your audio and video settings</li>
        <li>✅ Prepare your questions</li>
        <li>✅ Join 5 minutes early</li>
        <li>✅ Have a notepad ready</li>
      </ul>

      <p>We'll send you one more reminder 1 hour before the session starts.</p>

      <p>See you tomorrow!<br>
      <strong>NRI Wealth Partners Team</strong></p>
    </div>
  </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "NRI Wealth Partners"
  });
}

/**
 * 1-hour reminder email template
 */
function send1HourReminderEmail(email, name) {
  const subject = `🚀 Starting in 1 Hour! ${WEBINAR_CONFIG.title}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 20px 40px; background: #16a34a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
    .urgent { background: #fee2e2; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #dc2626; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🚀 Starting in 1 Hour!</h1>
    </div>

    <div class="content">
      <p>Dear ${name},</p>

      <div class="urgent">
        <h2 style="color: #991b1b; margin: 0;">The webinar starts in just 1 hour!</h2>
      </div>

      <div style="background: #1e3a5f; color: white; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h2 style="margin: 0 0 15px 0;">${WEBINAR_CONFIG.title}</h2>
        <p style="font-size: 18px; margin: 0;"><strong>Starting at ${WEBINAR_CONFIG.time}</strong></p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${WEBINAR_CONFIG.meetLink}" class="button">🎥 JOIN NOW</a>
      </div>

      <p style="text-align: center; color: #6b7280;">Click the button above to join when the session starts</p>

      <h3 style="color: #1e3a5f;">Last Minute Checklist:</h3>
      <ul>
        <li>🎧 Audio working?</li>
        <li>📹 Video ready?</li>
        <li>❓ Questions prepared?</li>
        <li>📝 Notepad handy?</li>
      </ul>

      <p><strong>Pro Tip:</strong> Join 5 minutes early to test your connection!</p>

      <p>See you very soon!<br>
      <strong>NRI Wealth Partners Team</strong></p>
    </div>
  </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "NRI Wealth Partners"
  });
}

/**
 * Set up time-based triggers for reminders
 * Modify the dates/times for your specific webinar
 */
function setupReminderTriggers() {
  // 24-hour reminder - Run at specific date/time
  const reminder24h = new Date('2024-12-14T19:00:00'); // 24 hours before webinar
  ScriptApp.newTrigger('send24HourReminder')
    .timeBased()
    .at(reminder24h)
    .create();

  // 1-hour reminder
  const reminder1h = new Date('2024-12-15T18:00:00'); // 1 hour before webinar
  ScriptApp.newTrigger('send1HourReminder')
    .timeBased()
    .at(reminder1h)
    .create();

  console.log("Reminder triggers set up!");
}
```

**Script 3: Post-Webinar Follow-up (followup.gs)**

```javascript
/**
 * Send thank you email with recording link after webinar
 */

const WEBINAR_CONFIG = {
  title: "Year-End Tax Planning for NRIs - FY 2024-25",
  recordingLink: "https://youtube.com/watch/your-recording-id",
  slidesLink: "https://drive.google.com/file/d/your-slides-id",
  feedbackFormLink: "https://forms.gle/your-feedback-form",
  companyEmail: "contact@nriwealthpartners.com"
};

/**
 * Send post-webinar thank you and recording
 */
function sendPostWebinarEmail() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  const data = sheet.getRange(2, 1, lastRow - 1, 12).getValues();

  data.forEach((row, index) => {
    const email = row[1];
    const name = row[2];

    if (email) {
      sendThankYouEmail(email, name);
      Utilities.sleep(1000);
    }
  });

  console.log("Post-webinar emails sent!");
}

/**
 * Thank you email template
 */
function sendThankYouEmail(email, name) {
  const subject = `🎉 Thank You! Recording & Slides from ${WEBINAR_CONFIG.title}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 Thank You for Attending!</h1>
    </div>

    <div class="content">
      <p>Dear ${name},</p>

      <p>Thank you for joining our webinar on <strong>${WEBINAR_CONFIG.title}</strong>! We hope you found it valuable and insightful.</p>

      <h3 style="color: #1e3a5f;">📥 Your Webinar Resources:</h3>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${WEBINAR_CONFIG.recordingLink}" class="button">📹 Watch Recording</a>
        <a href="${WEBINAR_CONFIG.slidesLink}" class="button">📄 Download Slides</a>
      </div>

      <h3 style="color: #1e3a5f;">📝 We'd Love Your Feedback!</h3>
      <p>Your feedback helps us improve future webinars. Please take 2 minutes to share your thoughts:</p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${WEBINAR_CONFIG.feedbackFormLink}" class="button" style="background: #f97316;">Share Feedback</a>
      </div>

      <h3 style="color: #1e3a5f;">📅 What's Next?</h3>
      <ul>
        <li>Check our <a href="https://nriwealthpartners.com/webinars">Webinars Page</a> for upcoming sessions</li>
        <li>Explore our <a href="https://nriwealthpartners.com/resources">Resources Library</a></li>
        <li>Schedule a <a href="https://nriwealthpartners.com/contact">Personal Consultation</a></li>
      </ul>

      <p>If you have any questions about the content covered, feel free to reply to this email.</p>

      <p>Thank you again for your participation!</p>

      <p>Best regards,<br>
      <strong>NRI Wealth Partners Team</strong></p>
    </div>
  </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "NRI Wealth Partners"
  });
}
```

### Step 3: Deploy Scripts

1. **Save all three script files** in your Apps Script project
2. **Run `setupTriggers()`** function once (from onFormSubmit.gs):
   - Click Run button
   - Grant permissions when prompted
   - Review and allow access
3. **For reminder emails**, either:
   - Run `setupReminderTriggers()` with your webinar dates
   - OR manually run `send24HourReminder()` and `send1HourReminder()` at appropriate times
4. **For post-webinar email**, manually run `sendPostWebinarEmail()` after webinar concludes

---

## 📅 Google Calendar Integration

### Create Webinar Event

1. Open **Google Calendar**
2. Click **"Create"**
3. Fill details:
   - **Title**: [Same as webinar title]
   - **Date & Time**: [Your webinar date/time]
   - **Duration**: [e.g., 60 minutes]
   - **Add Google Meet**: Click "Add Google Meet video conferencing"
   - **Description**: Add webinar description, agenda, speaker bio
   - **Guests**: You can add registrants here (or send invite links)

### Get "Add to Calendar" Link

1. Click the event in Calendar
2. Click **"More options"**
3. Copy the event URL
4. Or use this template format:
   ```
   https://calendar.google.com/calendar/render?action=TEMPLATE&text=[Event Title]&dates=[Start]/[End]&details=[Description]&location=[Google Meet Link]
   ```

Example:
```
https://calendar.google.com/calendar/render?action=TEMPLATE&text=Year-End+Tax+Planning+for+NRIs&dates=20241215T190000/20241215T200000&details=Join+CA+Anil+Parekh+for+expert+tax+strategies&location=https://meet.google.com/xxx-yyyy-zzz
```

Add this link to your `WEBINAR_CONFIG.calendarLink` in the script.

---

## 🎥 Google Meet Setup

### Create Meet Link

**Option 1: Via Calendar Event**
1. Create calendar event (as above)
2. Add Google Meet video conferencing
3. Copy the Meet link (e.g., meet.google.com/xxx-yyyy-zzz)

**Option 2: Direct Meet Link**
1. Go to **https://meet.google.com**
2. Click **"New meeting"** > **"Create a meeting for later"**
3. Copy the meeting link
4. Share link in confirmation emails

### Meet Settings

1. In the calendar event, click **"Change conference settings"**
2. Configure:
   - Host controls: Mute all, Remove participants
   - Join settings: Host approval required
   - Recording: Enable if needed (Workspace Business/Enterprise required)

---

## 🔄 Complete Workflow

### Before Webinar (1-2 Weeks)

1. ✅ Create webinar topic and prepare content
2. ✅ Create Google Form (use template above)
3. ✅ Link form to Google Sheet
4. ✅ Set up Apps Script and triggers
5. ✅ Create Google Calendar event with Meet link
6. ✅ Update website `/app/webinars/page.tsx` with webinar details
7. ✅ Test registration flow yourself
8. ✅ Promote webinar (email list, social media)

### During Registration Period

1. ✅ Monitor registrations in Google Sheet
2. ✅ Confirmation emails sent automatically on registration
3. ✅ Track registration numbers
4. ✅ Respond to any questions from registrants

### 24 Hours Before

1. ✅ Send 24-hour reminder (automatically via trigger OR run manually)
2. ✅ Prepare presentation slides
3. ✅ Test Google Meet setup

### 1 Hour Before

1. ✅ Send 1-hour reminder (automatically via trigger OR run manually)
2. ✅ Join Meet room 15 minutes early
3. ✅ Test audio, video, screen sharing

### During Webinar

1. ✅ Record session (if enabled in Meet settings)
2. ✅ Note attendees vs. registrants
3. ✅ Save Q&A questions for follow-up
4. ✅ Save chat if needed

### After Webinar

1. ✅ Upload recording to YouTube (unlisted)
2. ✅ Upload slides to Google Drive (set to "Anyone with link can view")
3. ✅ Create feedback form (Google Forms)
4. ✅ Update `pastWebinars` array in `/app/webinars/page.tsx`
5. ✅ Run `sendPostWebinarEmail()` script
6. ✅ Update registrant sheet with attendance data
7. ✅ Review feedback and improve for next webinar

---

## 🔄 Updating Website with New Webinars

### Add Upcoming Webinar

Edit `/app/webinars/page.tsx`:

```typescript
const upcomingWebinars = [
  {
    id: "unique-webinar-id",
    title: "Your Webinar Title",
    description: "Webinar description...",
    speaker: "Speaker Name",
    speakerTitle: "Speaker Title",
    speakerImage: "/images/team/speaker-photo.jpg",
    date: "2025-01-15", // YYYY-MM-DD
    time: "19:00",
    timezone: "EST",
    duration: "60 mins",
    registrationLink: "https://forms.gle/your-form-link", // Your Google Form
    topics: [
      "Topic 1",
      "Topic 2",
      "Topic 3",
      "Topic 4"
    ],
    audience: "NRIs in USA, Canada",
    seats: 100,
    registered: 0 // Update manually or connect to Sheets
  },
  // ... other webinars
]
```

### Move to Past Webinars

After webinar concludes:

1. Remove from `upcomingWebinars` array
2. Add to `pastWebinars` array:

```typescript
const pastWebinars = [
  {
    id: "your-webinar-id",
    title: "Your Webinar Title",
    description: "Webinar description...",
    speaker: "Speaker Name",
    date: "2025-01-15",
    duration: "60 mins",
    views: 0, // Track manually or via YouTube API
    recordingLink: "https://youtube.com/watch/your-recording-id",
    slidesLink: "https://drive.google.com/file/d/your-slides-id",
    topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
  },
  // ... other past webinars
]
```

---

## ✅ Best Practices

### Registration

- ✅ Keep form short (10 questions max)
- ✅ Only mark essential fields as required
- ✅ Send confirmation within 1 minute
- ✅ Include "Add to Calendar" in confirmation
- ✅ Set realistic seat limits

### Communication

- ✅ Send 3 emails: Confirmation, 24h reminder, 1h reminder
- ✅ Use clear, professional email templates
- ✅ Include Meet link in every email
- ✅ Test emails before sending to all

### Timing

- ✅ Schedule for NRI-friendly timezones
- ✅ Weekend mornings work best for USA/Canada NRIs
- ✅ Weekday evenings for UK/Europe NRIs
- ✅ Consider holidays in target countries

### Content

- ✅ Limit to 45-60 minutes + Q&A
- ✅ Keep slides visual and concise
- ✅ Practice presentation beforehand
- ✅ Prepare for common questions
- ✅ Record every session

### Follow-up

- ✅ Send recording within 24 hours
- ✅ Request feedback
- ✅ Offer 1-on-1 consultation
- ✅ Promote next webinar
- ✅ Build email list for future events

---

## 🆘 Troubleshooting

### Confirmation Emails Not Sending

1. Check Apps Script execution logs
2. Verify trigger is set up: `Resources > Current project's triggers`
3. Check Gmail quota limits (500 emails/day for free Gmail)
4. Run `onFormSubmit()` manually for testing

### Meet Link Not Working

1. Ensure Meet link is from same Google account
2. Check calendar event privacy settings
3. Verify Meet isn't restricted by Workspace admin

### Registrations Not Appearing in Sheet

1. Verify form is linked to Sheet
2. Check "Responses" tab in form
3. Re-link if needed: Form > Responses > Create Spreadsheet

---

## 📞 Support

For questions about this setup:
- Email: contact@nriwealthpartners.com
- Review Google Workspace documentation: https://workspace.google.com/resources

---

**Happy Webinar Hosting! 🎉**

*Last Updated: November 2024*
