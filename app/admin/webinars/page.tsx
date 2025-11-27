/**
 * Webinar Management Page
 *
 * Intuitive interface for managing webinars - add, edit, delete with live preview.
 */

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getFirestoreDb } from "@/lib/firebase-admin"
import { WebinarManagementClient } from "@/components/admin/webinar-management-client"

export interface Webinar {
  id: string
  title: string
  description: string
  date: string
  time: string
  timezone: string
  duration: number // minutes
  speaker: string
  speakerTitle: string
  maxAttendees?: number
  registrationCount: number
  tags: string[]
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default async function WebinarManagementPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/auth/admin")
    }

    // Check permissions
    if (!session.user.permissions.manageWebinars) {
      redirect("/admin")
    }

    // Check if Firebase is configured
    const firebaseConfigured = process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== ''

    let webinars: Webinar[] = []

    if (firebaseConfigured) {
      try {
        // Fetch webinars from Firestore
        const db = getFirestoreDb()
        const webinarsSnapshot = await db
          .collection('webinars')
          .orderBy('date', 'desc')
          .get()

        webinars = webinarsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Webinar[]
      } catch (fbError) {
        console.error("❌ Firebase error in webinar management:", fbError)
        // Fall through to show empty webinars with setup message
      }
    }

    return (
      <WebinarManagementClient
        webinars={webinars}
        currentUser={session.user}
        firebaseConfigured={firebaseConfigured}
      />
    )

  } catch (error: any) {
    console.error("❌ Webinar management error:", error)

    // Show graceful error message
    const { DatabaseErrorMessage } = await import('@/components/error-message')

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Webinar Management</h1>
          <p className="text-gray-600">Create and manage webinars</p>
        </div>
        <DatabaseErrorMessage />
      </div>
    )
  }
}
