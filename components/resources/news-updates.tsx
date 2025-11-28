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
  AlertCircle,
  Info
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

export default function NewsUpdates() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLiveData, setIsLiveData] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch('/api/news/fetch-latest?days=30')
      const data = await response.json()

      if (data.success) {
        setNews(data.articles || [])
        setIsLiveData(data.isLiveData || false)
      } else {
        setError('Failed to load news')
      }
    } catch (err) {
      setError('Unable to load news. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNews = news.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      immigration: "bg-blue-100 text-blue-800",
      tax: "bg-purple-100 text-purple-800",
      investment: "bg-green-100 text-green-800",
      market: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-3xl font-bold text-navy">Latest News & Updates</h2>
          {isLiveData && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Data
            </span>
          )}
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed with real-time news on immigration, taxation, investments, and market updates affecting NRIs worldwide.
        </p>
      </div>

      {!isLiveData && news.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Showing sample news</p>
            <p className="text-blue-700">Real-time news feed will be available once Firebase is fully configured with news aggregation.</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
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
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-navy animate-spin mb-4" />
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 font-semibold mb-2">Unable to Load News</p>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchNews} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* News Grid */}
      {!isLoading && !error && filteredNews.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-navy hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full",
                    getCategoryColor(article.category)
                  )}>
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-navy mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>

                {/* Source */}
                <div className="text-xs text-gray-500 mb-4">
                  Source: {article.source}
                </div>

                {/* CTA */}
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold text-sm transition-colors"
                  >
                    Read Full Article
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredNews.length === 0 && (
        <div className="text-center py-20">
          <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No news articles found</p>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : "Check back soon for the latest updates"}
          </p>
        </div>
      )}
    </div>
  )
}
