import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'
import { getStorage } from 'firebase-admin/storage'

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
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    const resourceRef = db.collection('resources').doc(id)
    const resourceDoc = await resourceRef.get()

    if (!resourceDoc.exists) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    const resourceData = resourceDoc.data()

    // Delete file from Firebase Storage if it exists
    if (resourceData?.fileUrl) {
      try {
        const storage = getStorage()
        const bucket = storage.bucket()

        // Extract file path from URL
        const urlParts = resourceData.fileUrl.split(`${bucket.name}/`)
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          const fileRef = bucket.file(filePath)

          // Check if file exists before deleting
          const [exists] = await fileRef.exists()
          if (exists) {
            await fileRef.delete()
            console.log(`✅ Deleted file from storage: ${filePath}`)
          }
        }
      } catch (storageError: any) {
        console.warn(`⚠️ Failed to delete file from storage:`, storageError.message)
        // Continue with resource deletion even if file deletion fails
      }
    }

    // Delete resource document
    await resourceRef.delete()

    console.log(`✅ Resource deleted: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete resource error:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource', details: error.message },
      { status: 500 }
    )
  }
}
