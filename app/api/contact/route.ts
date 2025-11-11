import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// Initialize Resend (if configured)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Initialize Gmail transporter (if configured)
const gmailTransporter = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const {
      fullName,
      email,
      phone,
      countryCode,
      country,
      inquiryType,
      subject,
      message,
      contactMethod,
    } = body

    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare email content
    const contactEmail = process.env.CONTACT_EMAIL || 'support@nriwealthpartners.com'
    const fullPhone = `${countryCode} ${phone}`

    const emailSubject = subject
      ? `New Contact Inquiry: ${subject}`
      : `New Contact Inquiry from ${fullName}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #d4af37; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            .badge { display: inline-block; background: #d4af37; color: #0f172a; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">New Contact Inquiry</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">NRI Wealth Partners</p>
            </div>

            <div class="content">
              <div class="field">
                <div class="label">Full Name:</div>
                <div class="value">${fullName}</div>
              </div>

              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>

              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${fullPhone}</div>
              </div>

              <div class="field">
                <div class="label">Country:</div>
                <div class="value">${country}</div>
              </div>

              <div class="field">
                <div class="label">Inquiry Type:</div>
                <div class="value">
                  ${inquiryType}
                  <span class="badge">${inquiryType}</span>
                </div>
              </div>

              ${subject ? `
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>

              <div class="field">
                <div class="label">Preferred Contact Method:</div>
                <div class="value">${contactMethod}</div>
              </div>

              <div class="footer">
                <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
                <p>Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Contact Inquiry - NRI Wealth Partners

Full Name: ${fullName}
Email: ${email}
Phone: ${fullPhone}
Country: ${country}
Inquiry Type: ${inquiryType}
${subject ? `Subject: ${subject}\n` : ''}
Preferred Contact Method: ${contactMethod}

Message:
${message}

---
Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Please respond within 24 hours.
    `

    // Auto-reply email templates
    const autoReplyHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            .contact-info { background: white; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Thank You!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your inquiry</p>
            </div>

            <div class="content">
              <p>Dear ${fullName},</p>

              <p>Thank you for contacting <strong>NRI Wealth Partners</strong>. We have received your inquiry regarding <strong>${inquiryType}</strong> and our expert team will review it shortly.</p>

              <div class="highlight">
                <strong>📋 What happens next?</strong><br>
                1. Our team will review your inquiry<br>
                2. We'll contact you within 24 hours via ${contactMethod}<br>
                3. We'll schedule a free consultation to discuss your financial goals
              </div>

              <div class="contact-info">
                <strong>📞 Need immediate assistance?</strong><br>
                Phone: +91 9974742626<br>
                Email: support@nriwealthpartners.com<br>
                WhatsApp: +91 9974742626<br>
                <br>
                <strong>Business Hours:</strong> Mon-Fri: 9 AM - 6 PM IST | Sat: 10 AM - 2 PM IST
              </div>

              <p style="text-align: center;">
                <a href="https://wa.me/919974742626" class="button">Message us on WhatsApp</a>
              </p>

              <p style="margin-top: 30px;">
                While you wait, feel free to explore our financial calculators and resources on our website.
              </p>

              <div class="footer">
                <p><strong>NRI Wealth Partners</strong></p>
                <p>Expert Wealth Management for Non-Resident Indians</p>
                <p style="margin-top: 15px; font-size: 11px;">
                  Avani Parekh is registered with AMFI as a Mutual Fund Distributor.<br>
                  Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const autoReplyText = `
Dear ${fullName},

Thank you for contacting NRI Wealth Partners. We have received your inquiry regarding ${inquiryType} and our expert team will review it shortly.

What happens next?
1. Our team will review your inquiry
2. We'll contact you within 24 hours via ${contactMethod}
3. We'll schedule a free consultation to discuss your financial goals

Need immediate assistance?
Phone: +91 9974742626
Email: support@nriwealthpartners.com
WhatsApp: +91 9974742626

Business Hours:
Mon-Fri: 9 AM - 6 PM IST
Sat: 10 AM - 2 PM IST

---
NRI Wealth Partners
Expert Wealth Management for Non-Resident Indians

Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
    `

    // Check if any email service is configured
    const emailServiceConfigured = resend || gmailTransporter

    if (!emailServiceConfigured) {
      // Log to console if no email service is configured
      console.log('='.repeat(80))
      console.log('📧 NEW CONTACT FORM SUBMISSION (No email service configured)')
      console.log('='.repeat(80))
      console.log(`From: ${fullName} <${email}>`)
      console.log(`Phone: ${fullPhone}`)
      console.log(`Country: ${country}`)
      console.log(`Inquiry: ${inquiryType}`)
      console.log(`Subject: ${subject || 'N/A'}`)
      console.log(`Preferred Contact: ${contactMethod}`)
      console.log('-'.repeat(80))
      console.log('Message:')
      console.log(message)
      console.log('='.repeat(80))
      console.log('\n')

      // Also send auto-reply simulation
      console.log('📨 AUTO-REPLY WOULD BE SENT TO:', email)
      console.log('Subject: Thank you for contacting NRI Wealth Partners')
      console.log('\n')

      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully (development mode - check console)',
        devMode: true
      })
    }

    // Send emails using configured service
    let supportEmailId: string | undefined
    let autoReplyId: string | undefined

    if (gmailTransporter) {
      // Use Gmail SMTP
      try {
        // Send email to support team
        await gmailTransporter.sendMail({
          from: `"NRI Wealth Partners" <${process.env.GMAIL_USER}>`,
          to: contactEmail,
          replyTo: email,
          subject: emailSubject,
          html: emailHtml,
          text: emailText,
        })

        // Send auto-reply to user
        await gmailTransporter.sendMail({
          from: `"NRI Wealth Partners" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Thank you for contacting NRI Wealth Partners',
          html: autoReplyHtml,
          text: autoReplyText,
        })

        console.log('✅ Emails sent successfully via Gmail')
      } catch (error) {
        console.error('Error sending emails via Gmail:', error)
        throw error
      }
    } else if (resend) {
      // Use Resend
      const { data: supportEmail, error: supportError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: contactEmail,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
        replyTo: email,
      })

      if (supportError) {
        console.error('Error sending support email:', supportError)
        throw supportError
      }

      supportEmailId = supportEmail?.id

      // Send auto-reply to user
      const { data: autoReply, error: autoReplyError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Thank you for contacting NRI Wealth Partners',
        html: autoReplyHtml,
        text: autoReplyText,
      })

      if (autoReplyError) {
        console.error('Error sending auto-reply:', autoReplyError)
        // Don't throw - support email was sent successfully
      }

      autoReplyId = autoReply?.id
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll contact you within 24 hours.',
      supportEmailId,
      autoReplyId,
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again or contact us directly at support@nriwealthpartners.com',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
