import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Error severity threshold for alerts
const ALERT_SEVERITIES = ['high', 'critical']

export async function POST(req: NextRequest) {
  try {
    const errorReport = await req.json()

    // Log to console (Cloud Run logs)
    console.error('[Frontend Error]', JSON.stringify(errorReport, null, 2))

    // Send alert email for high/critical errors
    if (ALERT_SEVERITIES.includes(errorReport.severity)) {
      await sendAlert(errorReport)
    }

    // Store in database/monitoring service (optional)
    // await storeError(errorReport)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error monitoring endpoint failed:', error)
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}

async function sendAlert(errorReport: any) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Email credentials not configured for error alerts')
      return
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const severityColor = errorReport.severity === 'critical' ? '#dc2626' : '#ea580c'

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      subject: `🚨 ${errorReport.severity.toUpperCase()} Error - NRI Wealth Partners`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <div style="background: ${severityColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">⚠️ Production Error Detected</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Severity: ${errorReport.severity.toUpperCase()}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
            <h3 style="margin-top: 0;">Error Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Category:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${errorReport.category}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${errorReport.message}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>URL:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${errorReport.url}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Timestamp:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(errorReport.timestamp).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>User Agent:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; word-break: break-all;">${errorReport.userAgent}</td>
              </tr>
            </table>

            ${errorReport.stack ? `
              <h4>Stack Trace:</h4>
              <pre style="background: white; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${errorReport.stack}</pre>
            ` : ''}

            ${errorReport.metadata ? `
              <h4>Metadata:</h4>
              <pre style="background: white; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(errorReport.metadata, null, 2)}</pre>
            ` : ''}

            <div style="margin-top: 20px; padding: 15px; background: #fff; border-left: 4px solid ${severityColor}; border-radius: 4px;">
              <strong>Recommended Actions:</strong>
              <ul style="margin: 10px 0;">
                <li>Check Cloud Run logs for additional context</li>
                <li>Review recent deployments</li>
                <li>Test affected functionality</li>
                ${errorReport.category === 'api' ? '<li>Check API endpoint health</li>' : ''}
                ${errorReport.category === 'network' ? '<li>Verify external service availability</li>' : ''}
              </ul>
            </div>
          </div>
        </div>
      `,
    })

    console.log(`✅ Error alert sent for ${errorReport.severity} error`)
  } catch (error) {
    console.error('Failed to send error alert email:', error)
  }
}
