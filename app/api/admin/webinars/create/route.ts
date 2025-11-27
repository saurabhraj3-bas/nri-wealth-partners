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

    const db = getFirestoreDb()

    // Create webinar document
    const webinarRef = db.collection('webinars').doc()

    const webinar = {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      time: data.time,
      timezone: data.timezone,
      duration: data.duration,
      speaker: data.speaker,
      speakerTitle: data.speakerTitle,
      maxAttendees: data.maxAttendees || null,
      registrationCount: 0,
      tags: data.tags || [],
      status: data.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email,
    }

    await webinarRef.set(webinar)

    console.log(`✅ Webinar created: ${webinarRef.id}`)

    return NextResponse.json({
      success: true,
      webinar: {
        id: webinarRef.id,
        ...webinar,
        date: webinar.date.toISOString(),
        createdAt: webinar.createdAt.toISOString(),
        updatedAt: webinar.updatedAt.toISOString(),
      }
    })

  } catch (error: any) {
    console.error('Create webinar error:', error)
    return NextResponse.json(
      { error: 'Failed to create webinar', details: error.message },
      { status: 500 }
    )
  }
}
