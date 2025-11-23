# Webinar Email Confirmation Setup

## Issue
Email confirmations were not being sent to registered participants for webinar registrations.

## Solution
A new API endpoint has been created at `/api/webinar-registration` that handles webinar registrations and sends automatic confirmation emails to participants.

## Configuration Required

### Option 1: Using Resend (Recommended)
1. Sign up for a Resend account at https://resend.com
2. Get your API key from the Resend dashboard
3. Add to your `.env.local` file:
```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=support@nriwealthpartners.com
```

### Option 2: Using Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password:
   - Go to Google Account Settings > Security
   - Under "2-Step Verification", select "App passwords"
   - Create a new app password for "Mail"
3. Add to your `.env.local` file:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
CONTACT_EMAIL=support@nriwealthpartners.com
```

## How It Works

### For Participants:
1. User registers for a webinar
2. Receives immediate confirmation email with:
   - Webinar title
   - Date and time
   - Confirmation that webinar link will be sent 24 hours before

### For Admin:
1. Admin receives notification email with:
   - Participant details (name, email, phone, country)
   - Webinar details (title, date, time)

## Migrating from Google Forms

The webinars page currently uses Google Forms for registration. To enable email confirmations:

### Update the Webinar Registration Links
Replace the Google Forms URLs in `/app/webinars/page.tsx` with the new registration system.

**Before:**
```typescript
registrationLink: "https://forms.gle/FufBjAnxLsURB8h98"
```

**After:**
```typescript
registrationLink: "#register" // Internal registration modal
```

Then implement a registration modal/form that calls the `/api/webinar-registration` endpoint.

## Testing

1. Ensure environment variables are configured
2. Register for a test webinar
3. Check that:
   - Participant receives confirmation email
   - Admin receives notification email
   - Email contains correct webinar details

## Email Template Customization

Email templates can be customized in `/app/api/webinar-registration/route.ts`:
- Participant confirmation email (lines 48-70)
- Admin notification email (lines 73-86)

## Troubleshooting

### Emails not being sent
1. Verify environment variables are set correctly
2. Check server logs for error messages
3. Ensure Gmail app password has no spaces
4. For Resend: verify domain is verified in dashboard

### Emails going to spam
1. Configure SPF, DKIM, and DMARC records for your domain
2. Use a verified domain with Resend
3. Ensure "from" email matches your domain

## Future Enhancements

Consider adding:
1. Calendar invite (.ics file) attachment
2. Reminder emails (24 hours before, 1 hour before)
3. Webinar link delivery email
4. Post-webinar follow-up email with recording link
5. Database storage of registrations for analytics
