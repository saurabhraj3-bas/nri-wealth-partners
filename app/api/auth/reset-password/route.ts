import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordWithToken, verifyPasswordResetToken } from '@/lib/firebase-admin'

/**
 * Reset Password API
 *
 * Resets password using a valid reset token
 */
export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword } = await req.json()

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: 'Email, token, and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
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

    // Verify token is valid
    const isValidToken = await verifyPasswordResetToken(email, token)

    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Reset password
    const success = await resetPasswordWithToken(email, token, newPassword)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to reset password. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`✅ Password successfully reset for ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    })

  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password', details: error.message },
      { status: 500 }
    )
  }
}
