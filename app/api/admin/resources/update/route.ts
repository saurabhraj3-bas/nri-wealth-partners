import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const data = await req.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    const resourceRef = db.collection('resources').doc(data.id)
    const resourceDoc = await resourceRef.get()

    if (!resourceDoc.exists) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Update resource
    const updates = {
      title: data.title,
      description: data.description,
      category: data.category,
      type: data.type,
      tags: data.tags || [],
      status: data.status,
      updatedAt: new Date(),
    }

    // Only update file info if provided (allows metadata-only updates)
    if (data.fileUrl) {
      Object.assign(updates, {
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
      })
    }

    await resourceRef.update(updates)

    console.log(`✅ Resource updated: ${data.id}`)

    return NextResponse.json({
      success: true,
      resource: {
        id: data.id,
        ...resourceDoc.data(),
        ...updates,
        updatedAt: updates.updatedAt.toISOString(),
        createdAt: resourceDoc.data()?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }
    })

  } catch (error: any) {
    console.error('Update resource error:', error)
    return NextResponse.json(
      { error: 'Failed to update resource', details: error.message },
      { status: 500 }
    )
  }
}
