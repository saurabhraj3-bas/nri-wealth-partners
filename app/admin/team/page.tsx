/**
 * Team Management Page
 *
 * Super admins can invite team members and assign specific permissions.
 * Intuitive interface for managing access control.
 */

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getFirestoreDb } from "@/lib/firebase-admin"
import { TeamManagementClient } from "@/components/admin/team-management-client"

export default async function TeamManagementPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/auth/admin")
    }

    // Only super admins can access team management
    if (session.user.role !== 'super_admin') {
      redirect("/admin")
    }

    // Check if Firebase is configured
    const firebaseConfigured = !!(process.env.FIREBASE_ADMIN_KEY && process.env.FIREBASE_ADMIN_KEY !== '')

    let teamMembers: any[] = []

    if (firebaseConfigured) {
      try {
        // Fetch all team members from Firestore
        const db = getFirestoreDb()
        const adminsSnapshot = await db.collection('admins').orderBy('createdAt', 'desc').get()

        teamMembers = adminsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            email: data.email || '',
            name: data.name || '',
            role: data.role || 'viewer',
            permissions: data.permissions || {},
            status: data.status || 'pending',
            invitedBy: data.invitedBy || '',
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() || null,
          }
        })
      } catch (fbError) {
        console.error("❌ Firebase error in team management:", fbError)
        // Fall through to show empty team with setup message
      }
    }

    return <TeamManagementClient
      teamMembers={teamMembers}
      currentUser={session.user}
      firebaseConfigured={firebaseConfigured}
    />

  } catch (error: any) {
    console.error("❌ Team management error:", error)

    // Show graceful error message instead of redirecting
    const { DatabaseErrorMessage } = await import('@/components/error-message')

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Team Management</h1>
          <p className="text-gray-600">Manage team members and permissions</p>
        </div>
        <DatabaseErrorMessage />
      </div>
    )
  }
}
