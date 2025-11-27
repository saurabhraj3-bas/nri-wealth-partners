import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase-admin'

/**
 * News Aggregation API
 *
 * Fetches latest news from the last N days from Firestore.
 * News is populated by Cloud Functions that collect from RSS feeds.
 */

// Sample news for when Firebase isn't configured
const SAMPLE_NEWS = [
  {
    id: 'sample-1',
    title: 'Tax Planning Guide for NRIs - 2025 Edition',
    description: 'Complete guide to tax planning strategies for Non-Resident Indians including DTAA benefits, TDS rates, and filing requirements.',
    category: 'tax',
    source: 'NRI Wealth Partners',
    url: '/resources',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
    tags: ['tax', 'planning', 'compliance'],
  },
  {
    id: 'sample-2',
    title: 'Latest Immigration Updates for Indian Citizens',
    description: 'Recent changes in visa regulations, OCI card updates, and PIO status guidelines affecting NRIs worldwide.',
    category: 'immigration',
    source: 'NRI Wealth Partners',
    url: '/resources',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
    tags: ['immigration', 'visa', 'oci'],
  },
  {
    id: 'sample-3',
    title: 'Investment Strategies for Repatriable Accounts',
    description: 'Learn about NRE and NRO account differences, best investment options, and repatriation rules for NRIs.',
    category: 'investment',
    source: 'NRI Wealth Partners',
    url: '/resources',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
    tags: ['investment', 'nre', 'nro'],
  },
]

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')

    // Check if Firebase is configured
    const firebaseConfigured = process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== ''

    let articles = []

    if (firebaseConfigured) {
      try {
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

        articles = newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }))
      } catch (fbError) {
        console.error('Firebase error, falling back to sample news:', fbError)
        articles = SAMPLE_NEWS
      }
    } else {
      // Firebase not configured - return sample news
      console.log('ℹ️ Firebase not configured, returning sample news')
      articles = SAMPLE_NEWS
    }

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
      daysRange: days,
      isLiveData: firebaseConfigured && articles.length > 0 && articles !== SAMPLE_NEWS,
    })

  } catch (error: any) {
    console.error('Fetch news error:', error)
    // Return sample news instead of error
    return NextResponse.json({
      success: true,
      articles: SAMPLE_NEWS,
      count: SAMPLE_NEWS.length,
      daysRange: 7,
      isLiveData: false,
    })
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
