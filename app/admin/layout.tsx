/**
 * Admin Layout with Navigation
 *
 * Provides navigation sidebar and header for all admin pages with error handling.
 */

import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Check authentication
    const session = await auth()

    if (!session?.user) {
      redirect("/admin/login")
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <AdminHeader user={session.user} />

        <div className="flex">
          {/* Sidebar Navigation */}
          <AdminNav user={session.user} />

          {/* Main Content */}
          <main className="flex-1 p-8 ml-64">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("❌ Admin layout error:", error)

    // Redirect to login on any error
    redirect("/admin/login")
  }
}
