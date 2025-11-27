import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase-admin'

/**
 * News Aggregation API
 *
 * Fetches latest news from the last N days from Firestore.
 * News is populated by Cloud Functions that collect from RSS feeds.
 */

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')

    // Calculate date threshold
    const dateThreshold = new Date()
    dateThreshold.setDate(dateThreshold.getDate() - days)

    const db = getFirestoreDb()

    // Fetch news articles from the last N days
    const newsSnapshot = await db
      .collection('news')
      .where('publishedAt', '>=', dateThreshold)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(100)
      .get()

    const articles = newsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
      daysRange: days,
    })

  } catch (error: any) {
    console.error('Fetch news error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch news',
        details: error.message,
        articles: [],
      },
      { status: 500 }
    )
  }
}

/**
 * Manual news aggregation (for testing without Cloud Functions)
 *
 * This endpoint can be called manually to populate news from curated sources.
 * In production, Cloud Functions should handle this automatically.
 */
export async function POST(req: NextRequest) {
  try {
    const { category, manualEntry } = await req.json()

    if (!manualEntry) {
      return NextResponse.json(
        { error: 'Manual entry data is required' },
        { status: 400 }
      )
    }

    const db = getFirestoreDb()

    // Create news article
    const newsRef = db.collection('news').doc()

    const article = {
      title: manualEntry.title,
      description: manualEntry.description,
      category: category || 'general',
      source: manualEntry.source || 'NRI Wealth Partners',
      url: manualEntry.url || '',
      publishedAt: manualEntry.publishedAt ? new Date(manualEntry.publishedAt) : new Date(),
      imageUrl: manualEntry.imageUrl || null,
      tags: manualEntry.tags || [],
      status: 'published',
      createdAt: new Date(),
      createdBy: 'manual',
    }

    await newsRef.set(article)

    console.log(`✅ News article created manually: ${newsRef.id}`)

    return NextResponse.json({
      success: true,
      article: {
        id: newsRef.id,
        ...article,
        publishedAt: article.publishedAt.toISOString(),
        createdAt: article.createdAt.toISOString(),
      }
    })

  } catch (error: any) {
    console.error('Create news error:', error)
    return NextResponse.json(
      { error: 'Failed to create news article', details: error.message },
      { status: 500 }
    )
  }
}
