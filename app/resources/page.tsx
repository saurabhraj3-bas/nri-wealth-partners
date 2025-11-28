/**
 * Consolidated Resources Hub
 *
 * Unified access point for:
 * - Newsletter Archive
 * - Latest News & Updates
 * - Resource Library (Guides, PDFs, Webinars)
 *
 * Server component that fetches data and passes it to client components
 */

import ResourcesHubClient from "@/components/resources/resources-hub-client"
import NewsletterArchive from "@/components/resources/newsletter-archive"
import NewsUpdates from "@/components/resources/news-updates"
import ResourceLibrary from "@/components/resources/resource-library"

export default function ResourcesHubPage() {
  return (
    <ResourcesHubClient
      newsletterContent={<NewsletterArchive />}
      newsContent={<NewsUpdates />}
      libraryContent={<ResourceLibrary />}
    />
  )
}
