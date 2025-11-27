import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.manageWebinars) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await req.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Webinar ID is required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    const webinarRef = db.collection('webinars').doc(data.id)
    const webinarDoc = await webinarRef.get()

    if (!webinarDoc.exists) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 })
    }

    // Update webinar
    const updates = {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      time: data.time,
      timezone: data.timezone,
      duration: data.duration,
      speaker: data.speaker,
      speakerTitle: data.speakerTitle,
      maxAttendees: data.maxAttendees || null,
      tags: data.tags || [],
      status: data.status,
      updatedAt: new Date(),
    }

    await webinarRef.update(updates)

    console.log(`✅ Webinar updated: ${data.id}`)

    return NextResponse.json({
      success: true,
      webinar: {
        id: data.id,
        ...webinarDoc.data(),
        ...updates,
        date: updates.date.toISOString(),
        updatedAt: updates.updatedAt.toISOString(),
        createdAt: webinarDoc.data()?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }
    })

  } catch (error: any) {
    console.error('Update webinar error:', error)
    return NextResponse.json(
      { error: 'Failed to update webinar', details: error.message },
      { status: 500 }
    )
  }
}
