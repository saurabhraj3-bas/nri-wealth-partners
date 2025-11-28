import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { verifyAdminPassword, setAdminPassword } from '@/lib/firebase-admin'

/**
 * Change Password API
 *
 * Allows logged-in admin users to change their password
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    const firebaseConfigured = process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== ''

    if (!firebaseConfigured) {
      return NextResponse.json(
        { error: 'Password change is not available. Firebase is not configured.' },
        { status: 503 }
      )
    }

    // Verify current password
    const isValidPassword = await verifyAdminPassword(session.user.email, currentPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Set new password
    await setAdminPassword(session.user.email, newPassword)

    console.log(`✅ Password changed successfully for ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Password has been changed successfully'
    })

  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password', details: error.message },
      { status: 500 }
    )
  }
}
