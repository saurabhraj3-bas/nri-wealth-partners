import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only super admins can update status
    if (session.user.role !== 'super_admin' && !session.user.permissions.manageAdmins) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { email, status } = await req.json()

    if (!email || !status) {
      return NextResponse.json(
        { error: 'Email and status are required' },
        { status: 400 }
      )
    }

    if (!['active', 'pending', 'suspended'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const db = getFirestoreDb()

    // Check if user exists
    const userDoc = await db.collection('admins').doc(email).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update status
    await db.collection('admins').doc(email).update({ status })

    console.log(`✅ Status updated for ${email}: ${status}`)

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    })

  } catch (error: any) {
    console.error('Update status error:', error)
    return NextResponse.json(
      { error: 'Failed to update status', details: error.message },
      { status: 500 }
    )
  }
}
