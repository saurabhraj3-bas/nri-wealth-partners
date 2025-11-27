import Link from 'next/link'
import {
  Newspaper,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  getRecentArticles,
  getCategoryDisplayName,
  getCategoryColor,
  generateArticleSlug
} from '@/lib/newsletter-helpers'
import type { CuratedArticle } from '@/lib/newsletter-helpers'

export async function NewsletterWidget() {
  try {
    const articles = await getRecentArticles(6)

    if (articles.length === 0) {
      return null
    }

    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-navy/10 px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-5 w-5 text-navy" />
                <span className="text-sm font-semibold text-navy">AI-CURATED INSIGHTS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Latest Wealth Insights for NRIs
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Stay ahead with our weekly newsletter featuring curated insights on wealth management,
                tax planning, and success stories from the NRI community
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="cta" size="lg">
                  <Link href="/insights/subscribe">
                    <Mail className="mr-2 h-5 w-5" />
                    Subscribe to Newsletter
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/insights">
                    <Newspaper className="mr-2 h-5 w-5" />
                    Browse Archive
                  </Link>
                </Button>
              </div>
            </div>

            {/* Article Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article: CuratedArticle) => (
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-navy">
                  <CardContent className="p-6">
                    {/* Category Badge */}
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${getCategoryColor(article.category)}`}>
                      {getCategoryDisplayName(article.category)}
                    </span>

                    {/* Headline */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-navy transition-colors">
                      {article.headline}
                    </h3>

                    {/* Summary Preview */}
                    <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {article.keyTakeaway}
                    </div>

                    {/* Relevance Score */}
                    {article.aiMetadata && (
                      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>{article.aiMetadata.relevanceScore}/10 Relevance</span>
                      </div>
                    )}

                    {/* Read More Link */}
                    <Button asChild variant="ghost" size="sm" className="w-full group-hover:bg-navy group-hover:text-white">
                      <Link
                        href={`/insights/${article.category}/${generateArticleSlug(article.headline)}`}
                      >
                        Read Full Summary
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white rounded-xl p-8">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { label: 'Issues Published', value: '25+', icon: Newspaper },
                  { label: 'Articles Curated', value: '500+', icon: Sparkles },
                  { label: 'Active Subscribers', value: '2,000+', icon: Mail },
                  { label: 'Avg Open Rate', value: '45%', icon: TrendingUp }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index}>
                      <Icon className="h-8 w-8 mx-auto mb-2 text-gold" />
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading newsletter widget:', error)
    // Fail silently - don't break the homepage
    return null
  }
}

export default NewsletterWidget
