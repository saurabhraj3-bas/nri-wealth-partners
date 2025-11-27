"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Newspaper,
  Calendar,
  TrendingUp,
  Globe,
  Search,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  description: string
  category: string
  source: string
  url: string
  publishedAt: string
  imageUrl?: string
  tags: string[]
}

const categories = [
  { id: "all", name: "All News", icon: Newspaper },
  { id: "immigration", name: "Immigration", icon: Globe },
  { id: "tax", name: "Tax & Compliance", icon: TrendingUp },
  { id: "investment", name: "Investment", icon: TrendingUp },
  { id: "market", name: "Market Updates", icon: TrendingUp },
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/news/fetch-latest?days=7")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch news")
      }

      setNews(data.articles || [])
    } catch (err: any) {
      console.error("Failed to fetch news:", err)
      setError(err.message || "Failed to load news")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNews = news.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Newspaper className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Latest News & Updates
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Stay informed with the latest immigration, tax, and investment news affecting NRIs
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur border-0 focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                    selectedCategory === category.id
                      ? "bg-navy text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-navy animate-spin" />
              <p className="text-gray-600">Loading latest news...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Unable to Load News</h3>
                <p className="text-gray-600 mb-2">We're having trouble connecting to our news service.</p>
                <p className="text-sm text-gray-500 mb-6">
                  This may be due to temporary technical difficulties. Please try again in a few moments.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={fetchNews} variant="cta">
                    Try Again
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/resources">
                      Browse Resources Instead
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-6">
                  Still having issues? Contact us at{" "}
                  <a href="mailto:support@nriwealthpartners.com" className="text-navy hover:underline">
                    support@nriwealthpartners.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredNews.length === 0 && (
            <div className="text-center py-20">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No news found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* News Articles */}
          {!isLoading && !error && filteredNews.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl border border-gray-200 hover:border-navy hover:shadow-xl transition-all p-6 group"
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-navy transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{article.source}</span>
                    <ExternalLink className="h-4 w-4 text-navy group-hover:translate-x-1 transition-transform" />
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get News Delivered to Your Inbox
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Subscribe to receive curated news updates and insights weekly
            </p>
            <Button asChild variant="cta" size="lg">
              <Link href="/insights/subscribe">Subscribe to Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
