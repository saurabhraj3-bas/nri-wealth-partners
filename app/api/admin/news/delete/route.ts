import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'

/**
 * Delete News API
 *
 * Allows admins to delete unwanted news articles
 */
export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // Check if user has deleteContent permission
    if (!session.user.permissions.deleteContent) {
      return NextResponse.json(
        { error: 'You do not have permission to delete news articles.' },
        { status: 403 }
      )
    }

    const { newsId } = await req.json()

    if (!newsId) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      )
    }

    // Check if Firebase is configured
    const firebaseConfigured = process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== ''

    if (!firebaseConfigured) {
      return NextResponse.json(
        { error: 'Firebase is not configured. Cannot delete news articles.' },
        { status: 503 }
      )
    }

    // Delete the news article
    const db = getFirestoreDb()
    await db.collection('news').doc(newsId).delete()

    console.log(`✅ News article deleted: ${newsId} by ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: 'News article deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete news error:', error)
    return NextResponse.json(
      { error: 'Failed to delete news article', details: error.message },
      { status: 500 }
    )
  }
}
