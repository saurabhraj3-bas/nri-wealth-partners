import { Suspense } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Calendar,
  TrendingUp,
  Mail,
  ArrowRight,
  Sparkles,
  BarChart3,
  Globe2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  getPublishedNewsletters,
  getRecentArticles,
  formatNewsletterDate,
  getCategoryDisplayName,
  getCategoryColor
} from '@/lib/newsletter-helpers'
import type { Newsletter, CuratedArticle } from '@/lib/newsletter-helpers'

export const metadata = {
  title: 'NRI Weekly Newsletter - AI-Curated Wealth Insights',
  description: 'AI-curated weekly digest for NRIs covering success stories, regulatory updates, financial insights, and community news. Expert analysis delivered every Monday. Subscribe free!',
  keywords: ['NRI newsletter', 'weekly digest', 'financial insights', 'investment newsletter', 'tax updates', 'NRI regulations', 'curated news']
}

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
                <span className="px-3 py-1 bg-navy text-white text-xs font-semibold rounded-full">
                  ISSUE #{newsletter.issueNumber}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatNewsletterDate(newsletter.sentAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors line-clamp-2">
                {newsletter.title}
              </h3>

              {/* Preview Text */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {newsletter.previewText}
              </p>

              {/* Stats (if available) */}
              {newsletter.stats && (
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-navy">{newsletter.stats.sent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{newsletter.stats.openRate}%</div>
                    <div className="text-xs text-gray-500">Opened</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{newsletter.stats.clickRate}%</div>
                    <div className="text-xs text-gray-500">Clicked</div>
                  </div>
                </div>
              )}

              {/* Article Count */}
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-semibold">Featured:</span>
                {' '}
                {[
                  newsletter.content.sections.success.articles.length > 0 && 'Success Stories',
                  newsletter.content.sections.regulatory.articles.length > 0 && 'Regulatory',
                  newsletter.content.sections.financial.articles.length > 0 && 'Financial',
                  newsletter.content.sections.community.articles.length > 0 && 'Community'
                ].filter(Boolean).join(', ')}
              </div>

              {/* CTA */}
              <Button asChild variant="default" className="w-full group-hover:bg-navy">
                <Link href={`/insights/newsletter/${newsletter.id}`}>
                  Read Newsletter
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading newsletters:', error)
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">
          Unable to load newsletters. Please try again later.
        </p>
      </div>
    )
  }
}

async function FeaturedArticles() {
  try {
    const articles = await getRecentArticles(6)

    if (articles.length === 0) {
      return null
    }

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Latest Curated Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recent articles handpicked and summarized by our AI-powered curation system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {articles.map((article: CuratedArticle) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Category Badge */}
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${getCategoryColor(article.category)}`}>
                    {getCategoryDisplayName(article.category)}
                  </span>

                  {/* Headline */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.headline}
                  </h3>

                  {/* Summary */}
                  <div
                    className="text-sm text-gray-600 mb-3 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: article.summary }}
                  />

                  {/* Key Takeaway */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">KEY TAKEAWAY</p>
                    <p className="text-sm text-blue-800">{article.keyTakeaway}</p>
                  </div>

                  {/* Source */}
                  <div className="text-xs text-gray-500">
                    Source: {article.originalArticle.source}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading featured articles:', error)
    return null
  }
}

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              NRI Wealth Insights
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Stay ahead with AI-curated insights on wealth management, tax planning,
              regulatory updates, and success stories from the NRI community.
              Expert analysis delivered weekly to your inbox.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Newspaper, label: 'Issues Published', value: '25+' },
                { icon: TrendingUp, label: 'Articles Curated', value: '500+' },
                { icon: Globe2, label: 'Subscribers', value: '2,000+' },
                { icon: BarChart3, label: 'Avg Open Rate', value: '45%' }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-gold" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div className="mt-10">
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

      {/* Newsletter Archive */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Newsletter Archive
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse past issues of our weekly newsletter featuring curated insights
              across success stories, regulatory updates, financial trends, and community news.
            </p>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          }>
            <NewsletterList />
          </Suspense>
        </div>
      </section>

      {/* Featured Articles */}
      <Suspense fallback={null}>
        <FeaturedArticles />
      </Suspense>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              What We Cover
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered curation system brings you the most relevant insights across four key categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Success Stories',
                icon: '🌟',
                description: 'Real-life journeys of NRIs achieving financial success and building wealth across borders',
                color: 'bg-green-50 border-green-200',
                textColor: 'text-green-800'
              },
              {
                title: 'Regulatory Updates',
                icon: '📋',
                description: 'Latest FEMA regulations, tax law changes, compliance requirements, and policy updates',
                color: 'bg-blue-50 border-blue-200',
                textColor: 'text-blue-800'
              },
              {
                title: 'Financial Insights',
                icon: '💰',
                description: 'Market trends, investment opportunities, portfolio strategies, and wealth management tips',
                color: 'bg-yellow-50 border-yellow-200',
                textColor: 'text-yellow-800'
              },
              {
                title: 'Community News',
                icon: '🌏',
                description: 'NRI diaspora news, cultural events, community initiatives, and global Indian impact',
                color: 'bg-purple-50 border-purple-200',
                textColor: 'text-purple-800'
              }
            ].map((category, index) => (
              <Card key={index} className={`${category.color} border-2`}>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className={`text-xl font-bold mb-3 ${category.textColor}`}>
                    {category.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="h-12 w-12 mx-auto mb-6 text-gold" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Insights Delivered to Your Inbox
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join 2,000+ NRIs who receive our weekly newsletter with curated insights,
              expert analysis, and actionable advice for cross-border wealth management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="cta" size="lg">
                <Link href="/insights/subscribe">
                  Subscribe Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <span className="text-sm text-gray-300">
                ✓ No spam ✓ Unsubscribe anytime ✓ Privacy protected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Stay Informed */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              More Ways to Stay Informed
            </h2>
            <p className="text-lg text-gray-600">
              Beyond our weekly newsletter, explore other resources to stay updated
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* News Feed Promotion */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy">News Feed</h3>
                    <span className="text-xs text-blue-600 font-semibold">⚡ Updated Daily</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Need breaking updates between newsletters? Check our News Feed for real-time news from USCIS, IRS, RBI, and Bloomberg.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/news">
                    View News Feed <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Resources Promotion */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Globe2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy">Resources</h3>
                    <span className="text-xs text-green-600 font-semibold">📥 Free Downloads</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Download comprehensive guides, tax checklists, and investment playbooks. All our resources are free PDFs you can save and share.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources">
                    Browse Resources <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Subscribe Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy text-center mb-12">
              Why Subscribe to Our Newsletter?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'AI-Powered Curation',
                  description: 'Our advanced AI scans 19 trusted sources daily, filtering 200+ articles to bring you only the most relevant insights.',
                  icon: '🤖'
                },
                {
                  title: 'Expert Summary',
                  description: 'Every article is professionally summarized with key takeaways, saving you hours of reading time.',
                  icon: '📝'
                },
                {
                  title: 'Weekly Digest',
                  description: 'Receive a comprehensive roundup every Monday morning, perfectly timed for your week ahead.',
                  icon: '📅'
                },
                {
                  title: 'Actionable Insights',
                  description: 'Clear, practical advice you can implement immediately in your wealth management journey.',
                  icon: '🎯'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-4xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
