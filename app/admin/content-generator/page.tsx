/**
 * AI Content Generator - Admin Page
 *
 * Aligns with Digital Marketing Strategy:
 * - Generate blog posts (3/week = 12/month)
 * - Create pillar content (4 cornerstone guides)
 * - Build resource library (5-10 PDFs initially)
 * - SEO-optimized content
 * - Support content calendar planning
 */

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ContentGenerator } from "@/components/admin/content-generator"

export const metadata = {
  title: 'AI Content Generator | Admin',
  description: 'Generate SEO-optimized blog posts, guides, and resources using AI'
}

export default async function ContentGeneratorPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/admin/login")
    }

    // Check permissions (content creation permission)
    if (!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars) {
      redirect("/admin")
    }

    return (
      <div className="space-y-8">
        <ContentGenerator />
      </div>
    )

  } catch (error: any) {
    console.error("❌ Content generator page error:", error)

    const { DatabaseErrorMessage } = await import('@/components/error-message')

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">AI Content Generator</h1>
          <p className="text-gray-600">Generate content using AI</p>
        </div>
        <DatabaseErrorMessage />
      </div>
    )
  }
}
