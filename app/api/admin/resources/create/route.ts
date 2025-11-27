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

    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, fileUrl' },
        { status: 400 }
      )
    }

    const db = getFirestoreDb()

    // Create resource document
    const resourceRef = db.collection('resources').doc()

    const resource = {
      title: data.title,
      description: data.description,
      category: data.category,
      type: data.type || 'PDF Guide',
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize || 0,
      downloadCount: 0,
      status: data.status || 'draft',
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email,
    }

    await resourceRef.set(resource)

    console.log(`✅ Resource created: ${resourceRef.id}`)

    return NextResponse.json({
      success: true,
      resource: {
        id: resourceRef.id,
        ...resource,
        createdAt: resource.createdAt.toISOString(),
        updatedAt: resource.updatedAt.toISOString(),
      }
    })

  } catch (error: any) {
    console.error('Create resource error:', error)
    return NextResponse.json(
      { error: 'Failed to create resource', details: error.message },
      { status: 500 }
    )
  }
}
