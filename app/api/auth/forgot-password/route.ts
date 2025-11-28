import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, generatePasswordResetToken } from '@/lib/firebase-admin'
import { sendEmail } from '@/lib/email'

/**
 * Forgot Password API
 *
 * Generates a password reset token and sends it via email
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    const firebaseConfigured = process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== ''

    if (!firebaseConfigured) {
      return NextResponse.json(
        { error: 'Password reset is not available. Firebase is not configured.' },
        { status: 503 }
      )
    }

    // Check if admin exists
    const admin = await getAdminUser(email)

    if (!admin) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const token = await generatePasswordResetToken(email)

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    // Send email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Reset Your Admin Password - NRI Wealth Partners',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #003366; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">NRI Wealth Partners</h1>
            </div>

            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #003366;">Reset Your Password</h2>

              <p>Hello ${admin.name},</p>

              <p>We received a request to reset your admin password. Click the button below to create a new password:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="display: inline-block; padding: 15px 30px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #fff; padding: 10px; border-left: 3px solid #d4af37;">
                ${resetUrl}
              </p>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Important:</strong> This link will expire in 1 hour.
              </p>

              <p style="color: #666; font-size: 14px;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </div>

            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px; background-color: #f0f0f0;">
              <p>NRI Wealth Partners Admin Portal</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </body>
        </html>
      `
    })

    if (!emailSent) {
      console.error('Failed to send password reset email')
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    console.log(`✅ Password reset email sent to ${email}`)

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request', details: error.message },
      { status: 500 }
    )
  }
}
