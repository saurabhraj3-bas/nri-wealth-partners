import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  TrendingUp,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SocialShare } from '@/components/social-share'
import {
  getArticlesByCategory,
  getCategoryDisplayName,
  getCategoryColor,
  getCategoryIcon,
  formatNewsletterDate,
  generateArticleSlug
} from '@/lib/newsletter-helpers'
import type { CuratedArticle } from '@/lib/newsletter-helpers'

export async function generateMetadata({
  params
}: {
  params: { category: string; slug: string }
}) {
  try {
    // Validate category
    if (!['success', 'regulatory', 'financial', 'community'].includes(params.category)) {
      return { title: 'Article Not Found' }
    }

    const articles = await getArticlesByCategory(
      params.category as 'success' | 'regulatory' | 'financial' | 'community',
      50
    )

    const article = articles.find(a => generateArticleSlug(a.headline) === params.slug)

    if (!article) {
      return { title: 'Article Not Found' }
    }

    // Strip HTML from summary for meta description
    const plainTextSummary = article.summary.replace(/<[^>]*>/g, '')

    return {
      title: article.headline,
      description: plainTextSummary.substring(0, 160),
      keywords: [
        'NRI',
        params.category,
        article.originalArticle.source,
        'wealth management',
        'financial insights'
      ],
      openGraph: {
        title: article.headline,
        description: plainTextSummary.substring(0, 160),
        type: 'article',
        publishedTime: article.originalArticle.publishedAt?.toDate?.()?.toISOString(),
      }
    }
  } catch (error) {
    return { title: 'Article' }
  }
}

async function ArticleContent({
  category,
  slug
}: {
  category: string
  slug: string
}) {
  try {
    // Validate category
    if (!['success', 'regulatory', 'financial', 'community'].includes(category)) {
      notFound()
    }

    const categoryTyped = category as 'success' | 'regulatory' | 'financial' | 'community'

    // Fetch articles from this category
    const articles = await getArticlesByCategory(categoryTyped, 50)

    // Find the article by slug
    const article = articles.find(a => generateArticleSlug(a.headline) === slug)

    if (!article) {
      notFound()
    }

    // Get related articles (same category, excluding current)
    const relatedArticles = articles
      .filter(a => a.id !== article.id)
      .slice(0, 3)

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/insights">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Insights
              </Link>
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <section className="bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{getCategoryIcon(categoryTyped)}</span>
                <span className="px-4 py-2 bg-gold text-navy text-sm font-bold rounded-full">
                  {getCategoryDisplayName(categoryTyped).toUpperCase()}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {article.headline}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {article.originalArticle.source && (
                  <span className="font-semibold">
                    Source: {article.originalArticle.source}
                  </span>
                )}
                {article.originalArticle.publishedAt && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatNewsletterDate(article.originalArticle.publishedAt)}
                  </span>
                )}
                {article.aiMetadata && (
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    {article.aiMetadata.relevanceScore}/10 Relevance Score
                  </span>
                )}
              </div>

              {/* Share Button */}
              <div className="mt-6">
                <SocialShare
                  url={`/insights/${categoryTyped}/${slug}`}
                  title={article.headline}
                  description={article.keyTakeaway}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

              {/* Key Takeaway (Highlighted) */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-8 mb-8 rounded-r-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-900 mb-2">
                      Key Takeaway
                    </h3>
                    <p className="text-yellow-900 font-medium text-lg leading-relaxed">
                      {article.keyTakeaway}
                    </p>
                  </div>
                </div>
              </div>

              {/* Article Summary */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-navy mb-6">
                    Article Summary
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: article.summary }}
                  />
                </CardContent>
              </Card>

              {/* Original Article Link */}
              {article.originalArticle.url && (
                <Card className="mb-8 bg-gradient-to-br from-navy to-blue-900 text-white">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4">
                      Read the Full Article
                    </h3>
                    <p className="text-gray-200 mb-6">
                      This summary was curated from the original article published by{' '}
                      <strong>{article.originalArticle.source}</strong>
                      {article.originalArticle.title && (
                        <>: "{article.originalArticle.title}"</>
                      )}
                    </p>
                    <Button asChild variant="cta" size="lg">
                      <a
                        href={article.originalArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read Original Article
                        <ExternalLink className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* AI Metadata (Optional - for transparency) */}
              {article.aiMetadata && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">
                    About This Curation
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                    <div>
                      <span className="font-semibold">Relevance Score:</span>{' '}
                      {article.aiMetadata.relevanceScore}/10
                    </div>
                    <div>
                      <span className="font-semibold">AI Model:</span>{' '}
                      {article.aiMetadata.model}
                    </div>
                    <div>
                      <span className="font-semibold">Curated:</span>{' '}
                      {formatNewsletterDate(article.aiMetadata.generatedAt)}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-navy mb-6">
                    Related Articles from {getCategoryDisplayName(categoryTyped)}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedArticles.map((relatedArticle: CuratedArticle) => (
                      <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${getCategoryColor(categoryTyped)}`}>
                            {getCategoryDisplayName(categoryTyped)}
                          </span>
                          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {relatedArticle.headline}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {relatedArticle.keyTakeaway}
                          </p>
                          <Button asChild variant="ghost" size="sm" className="w-full">
                            <Link
                              href={`/insights/${categoryTyped}/${generateArticleSlug(relatedArticle.headline)}`}
                            >
                              Read More
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribe CTA */}
              <div className="mt-12 bg-gradient-to-br from-gold/10 to-yellow-50 rounded-lg p-8 text-center border-2 border-gold/30">
                <h3 className="text-2xl font-bold text-navy mb-3">
                  Get More Insights Like This
                </h3>
                <p className="text-gray-700 mb-6">
                  Subscribe to receive 12 curated articles every week, delivered to your inbox
                </p>
                <Button asChild variant="cta" size="lg">
                  <Link href="/insights/subscribe">
                    <Mail className="mr-2 h-5 w-5" />
                    Subscribe to Newsletter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading article:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Article
          </h1>
          <p className="text-gray-600 mb-6">
            We're having trouble loading this article. Please try again later.
          </p>
          <Button asChild>
            <Link href="/insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Insights
            </Link>
          </Button>
        </div>
      </div>
    )
  }
}

export default function ArticlePage({
  params
}: {
  params: { category: string; slug: string }
}) {
  return <ArticleContent category={params.category} slug={params.slug} />
}
