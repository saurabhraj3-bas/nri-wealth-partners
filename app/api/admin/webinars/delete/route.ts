import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.deleteContent) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Webinar ID is required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    const webinarRef = db.collection('webinars').doc(id)
    const webinarDoc = await webinarRef.get()

    if (!webinarDoc.exists) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 })
    }

    await webinarRef.delete()

    console.log(`✅ Webinar deleted: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Webinar deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete webinar error:', error)
    return NextResponse.json(
      { error: 'Failed to delete webinar', details: error.message },
      { status: 500 }
    )
  }
}
