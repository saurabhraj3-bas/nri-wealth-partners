/**
 * Resource Management Page
 *
 * Intuitive interface for uploading and managing PDFs and resources.
 * Features drag-and-drop upload, metadata editing, and categorization.
 */

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getFirestoreDb } from "@/lib/firebase-admin"
import { ResourceManagementClient } from "@/components/admin/resource-management-client"

export interface Resource {
  id: string
  title: string
  description: string
  category: 'guides' | 'tax' | 'market' | 'videos' | 'checklists' | 'immigration'
  type: string
  fileUrl: string
  fileName: string
  fileSize: number
  downloadCount: number
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default async function ResourceManagementPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/auth/admin")
    }

    // Check permissions
    if (!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars) {
      redirect("/admin")
    }

    // Fetch resources from Firestore
    const db = getFirestoreDb()
    const resourcesSnapshot = await db
      .collection('resources')
      .orderBy('createdAt', 'desc')
      .get()

    const resources: Resource[] = resourcesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Resource[]

    return (
      <ResourceManagementClient
        resources={resources}
        currentUser={session.user}
      />
    )

  } catch (error: any) {
    console.error("❌ Resource management error:", error)

    // Show graceful error message
    const { DatabaseErrorMessage } = await import('@/components/error-message')

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Resource Management</h1>
          <p className="text-gray-600">Upload and manage resources</p>
        </div>
        <DatabaseErrorMessage />
      </div>
    )
  }
}
