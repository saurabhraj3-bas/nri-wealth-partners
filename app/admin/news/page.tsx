/**
 * Admin News Management Page
 *
 * Moderate and delete news articles from the feed
 */

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getFirestoreDb } from "@/lib/firebase-admin"
import { NewsManagementClient } from "@/components/admin/news-management-client"

export interface NewsArticle {
  id: string
  title: string
  description: string
  category: string
  source: string
  url: string
  publishedAt: string
  createdAt: string
  tags: string[]
  status?: string
}

export default async function NewsManagementPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/auth/admin")
    }

    // Check permissions - only users with deleteContent can manage news
    if (!session.user.permissions.deleteContent) {
      redirect("/admin")
    }

    // Check if Firebase is configured
    const firebaseConfigured = !!(process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== '')

    let newsArticles: NewsArticle[] = []

    if (firebaseConfigured) {
      try {
        // Fetch news from Firestore
        const db = getFirestoreDb()
        const newsSnapshot = await db
          .collection('news')
          .orderBy('publishedAt', 'desc')
          .limit(100)
          .get()

        newsArticles = newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as NewsArticle[]
      } catch (fbError) {
        console.error("❌ Firebase error in news management:", fbError)
        // Fall through to show empty news with setup message
      }
    }

    return (
      <NewsManagementClient
        newsArticles={newsArticles}
        currentUser={session.user}
        firebaseConfigured={firebaseConfigured}
      />
    )

  } catch (error: any) {
    console.error("❌ News management error:", error)

    // Show graceful error message
    const { DatabaseErrorMessage } = await import('@/components/error-message')

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">News Management</h1>
          <p className="text-gray-600">Moderate and delete news articles</p>
        </div>
        <DatabaseErrorMessage />
      </div>
    )
  }
}
