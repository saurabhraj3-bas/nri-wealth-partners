import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Mail,
  ExternalLink,
  TrendingUp,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SocialShare } from '@/components/social-share'
import {
  getNewsletterById,
  getCuratedArticles,
  formatNewsletterDate,
  getCategoryDisplayName,
  getCategoryColor,
  getCategoryIcon
} from '@/lib/newsletter-helpers'
import type { Newsletter, CuratedArticle } from '@/lib/newsletter-helpers'

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const newsletter = await getNewsletterById(params.id)

    if (!newsletter) {
      return {
        title: 'Newsletter Not Found'
      }
    }

    return {
      title: `${newsletter.title} - Issue #${newsletter.issueNumber}`,
      description: newsletter.previewText,
      openGraph: {
        title: newsletter.title,
        description: newsletter.previewText,
        type: 'article',
        publishedTime: newsletter.sentAt?.toDate?.()?.toISOString(),
      }
    }
  } catch (error) {
    return {
      title: 'Newsletter'
    }
  }
}

async function NewsletterContent({ id }: { id: string }) {
  try {
    const newsletter = await getNewsletterById(id)

    if (!newsletter) {
      notFound()
    }

    // Collect all article IDs from all sections
    const allArticleIds = [
      ...newsletter.content.sections.success.articles,
      ...newsletter.content.sections.regulatory.articles,
      ...newsletter.content.sections.financial.articles,
      ...newsletter.content.sections.community.articles
    ]

    // Fetch all articles
    const articles = await getCuratedArticles(allArticleIds)

    // Group articles by category
    const articlesByCategory = {
      success: articles.filter(a => newsletter.content.sections.success.articles.includes(a.id)),
      regulatory: articles.filter(a => newsletter.content.sections.regulatory.articles.includes(a.id)),
      financial: articles.filter(a => newsletter.content.sections.financial.articles.includes(a.id)),
      community: articles.filter(a => newsletter.content.sections.community.articles.includes(a.id))
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/insights">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Archive
              </Link>
            </Button>
          </div>
        </div>

        {/* Newsletter Header */}
        <section className="bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Issue Number & Date */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-gold text-navy text-sm font-bold rounded-full">
                  ISSUE #{newsletter.issueNumber}
                </span>
                <span className="text-gray-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatNewsletterDate(newsletter.sentAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {newsletter.title}
              </h1>

              {/* Preview Text */}
              <p className="text-xl text-gray-200 mb-6">
                {newsletter.previewText}
              </p>

              {/* Stats */}
              {newsletter.stats && (
                <div className="flex items-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gold" />
                    <span>{newsletter.stats.sent.toLocaleString()} subscribers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span>{newsletter.stats.openRate}% open rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>{newsletter.stats.clickRate}% click rate</span>
                  </div>
                </div>
              )}

              {/* Share Button */}
              <div className="mt-6">
                <SocialShare
                  url={`/insights/newsletter/${newsletter.id}`}
                  title={newsletter.title}
                  description={newsletter.previewText}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

              {/* Opening Message */}
              {newsletter.content.opening && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsletter.content.opening }}
                  />
                </div>
              )}

              {/* Admin Commentary (if present) */}
              {newsletter.content.adminCommentary && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Editor's Note
                  </h3>
                  <div
                    className="prose prose-blue max-w-none text-blue-800"
                    dangerouslySetInnerHTML={{ __html: newsletter.content.adminCommentary }}
                  />
                </div>
              )}

              {/* Article Sections */}
              {(['success', 'regulatory', 'financial', 'community'] as const).map((category) => {
                const categoryArticles = articlesByCategory[category]
                if (categoryArticles.length === 0) return null

                const section = newsletter.content.sections[category]

                return (
                  <div key={category} className="mb-12">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">{getCategoryIcon(category)}</span>
                      <h2 className="text-2xl md:text-3xl font-bold text-navy">
                        {section.title || getCategoryDisplayName(category)}
                      </h2>
                    </div>

                    {/* Articles in this category */}
                    <div className="space-y-6">
                      {categoryArticles.map((article: CuratedArticle) => (
                        <Card key={article.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            {/* Category Badge */}
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${getCategoryColor(category)}`}>
                              {getCategoryDisplayName(category)}
                            </span>

                            {/* Headline */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {article.headline}
                            </h3>

                            {/* Summary */}
                            <div
                              className="prose max-w-none mb-4 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: article.summary }}
                            />

                            {/* Key Takeaway */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                              <p className="text-xs font-semibold text-yellow-900 mb-1">
                                KEY TAKEAWAY
                              </p>
                              <p className="text-sm text-yellow-900 font-medium">
                                {article.keyTakeaway}
                              </p>
                            </div>

                            {/* Original Source */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold">Source:</span> {article.originalArticle.source}
                                {article.originalArticle.publishedAt && (
                                  <span className="ml-2">
                                    • {formatNewsletterDate(article.originalArticle.publishedAt)}
                                  </span>
                                )}
                              </div>
                              {article.originalArticle.url && (
                                <Button asChild variant="ghost" size="sm">
                                  <a
                                    href={article.originalArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Read Original
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Expert Insights Section (if present) */}
              {newsletter.content.sections.expert && (
                <div className="mb-12">
                  <div className="bg-gradient-to-br from-navy to-blue-900 text-white rounded-lg p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      {newsletter.content.sections.expert.title || 'Expert Insights'}
                    </h2>
                    <div
                      className="prose prose-lg prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: newsletter.content.sections.expert.content }}
                    />
                  </div>
                </div>
              )}

              {/* Closing Message */}
              {newsletter.content.closing && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsletter.content.closing }}
                  />
                </div>
              )}

              {/* Subscribe CTA */}
              <div className="bg-gradient-to-br from-gold/10 to-yellow-50 rounded-lg p-8 text-center border-2 border-gold/30">
                <h3 className="text-2xl font-bold text-navy mb-3">
                  Enjoyed this newsletter?
                </h3>
                <p className="text-gray-700 mb-6">
                  Subscribe to receive weekly insights delivered straight to your inbox
                </p>
                <Button asChild variant="cta" size="lg">
                  <Link href="/insights/subscribe">
                    <Mail className="mr-2 h-5 w-5" />
                    Subscribe Now - It's Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading newsletter:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Newsletter
          </h1>
          <p className="text-gray-600 mb-6">
            We're having trouble loading this newsletter. Please try again later.
          </p>
          <Button asChild>
            <Link href="/insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archive
            </Link>
          </Button>
        </div>
      </div>
    )
  }
}

export default function NewsletterPage({ params }: { params: { id: string } }) {
  return <NewsletterContent id={params.id} />
}
