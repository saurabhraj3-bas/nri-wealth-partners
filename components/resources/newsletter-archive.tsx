import { Suspense } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  getPublishedNewsletters,
  formatNewsletterDate,
  getCategoryDisplayName,
  getCategoryColor
} from '@/lib/newsletter-helpers'
import type { Newsletter } from '@/lib/newsletter-helpers'

async function NewsletterList() {
  try {
    const newsletters = await getPublishedNewsletters(12)

    if (newsletters.length === 0) {
      return (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">
            No newsletters published yet. Check back soon!
          </p>
        </div>
      )
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsletters.map((newsletter: Newsletter) => (
          <Card key={newsletter.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-navy">
            <CardContent className="p-6">
              {/* Issue Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Issue #{newsletter.issueNumber}
                </span>
                <span className="text-xs text-gray-500">
                  {formatNewsletterDate(newsletter.sentAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                {newsletter.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {newsletter.previewText}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{(newsletter.content?.sections?.success?.articles?.length || 0) +
                       (newsletter.content?.sections?.regulatory?.articles?.length || 0) +
                       (newsletter.content?.sections?.financial?.articles?.length || 0) +
                       (newsletter.content?.sections?.community?.articles?.length || 0)} articles</span>
              </div>

              {/* CTA */}
              <Link href={`/insights/${newsletter.id}`}>
                <Button variant="outline" className="w-full group-hover:bg-navy group-hover:text-white transition-all">
                  Read Newsletter
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading newsletters:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load newsletters. Please try again later.</p>
      </div>
    )
  }
}

export default function NewsletterArchive() {
  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-navy mb-4">Newsletter Archive</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our AI-curated weekly newsletters featuring success stories, regulatory updates,
          and financial insights tailored for NRIs.
        </p>
      </div>

      {/* Newsletter List */}
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
        </div>
      }>
        <NewsletterList />
      </Suspense>

      {/* Subscribe CTA */}
      <div id="newsletter-subscribe" className="mt-16 bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-8 md:p-12 text-white text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-gold" />
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Never Miss an Issue
        </h3>
        <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
          Get our AI-curated weekly newsletter delivered to your inbox every Monday.
          Expert insights, market updates, and success stories - all in one place.
        </p>
        <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-semibold" asChild>
          <Link href="/insights#subscribe">
            Subscribe for Free
          </Link>
        </Button>
      </div>
    </div>
  )
}
