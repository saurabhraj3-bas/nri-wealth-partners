import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getStorage } from 'firebase-admin/storage'
import { getFirebaseAuth } from '@/lib/firebase-admin'

/**
 * Upload PDF to Firebase Storage
 *
 * Handles file upload with:
 * - File type validation (PDF only)
 * - Size limit enforcement (10MB)
 * - Automatic file naming with timestamp
 * - Secure storage with public read access
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'guides'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Initialize Firebase Storage
    const storage = getStorage()
    const bucket = storage.bucket()

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `resources/${category}/${timestamp}_${sanitizedName}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Firebase Storage
    const fileRef = bucket.file(fileName)
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedBy: session.user.email,
          uploadedAt: new Date().toISOString(),
          category: category,
        }
      }
    })

    // Make file publicly accessible
    await fileRef.makePublic()

    // Get public URL
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    console.log(`✅ File uploaded successfully: ${fileName}`)

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: sanitizedName,
      fileSize: file.size,
      message: 'File uploaded successfully'
    })

  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error.message
      },
      { status: 500 }
    )
  }
}
