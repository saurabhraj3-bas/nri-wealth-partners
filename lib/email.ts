/**
 * Email Service
 *
 * Reusable email sending functionality using Gmail
 */

import nodemailer from 'nodemailer'

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

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

/**
 * Send an email using Gmail
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!gmailTransporter) {
      console.error('❌ Gmail transporter not configured')
      return false
    }

    const { to, subject, html, from } = options

    // Send email
    const mailOptions = {
      from: from || `NRI Wealth Partners <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    }

    await gmailTransporter.sendMail(mailOptions)
    console.log(`✅ Email sent successfully to ${to}`)
    return true

  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return false
  }
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!gmailTransporter
}
