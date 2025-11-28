"use client"

/**
 * News Management Client Component
 *
 * Allows admins to view and delete news articles
 */

import { useState } from "react"
import { Newspaper, Trash2, ExternalLink, Calendar, AlertCircle, Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NewsArticle {
  id: string
  title: string
  description: string
  category: string
  source: string
  url: string
  publishedAt: string
  createdAt: string
  tags: string[]
}

interface NewsManagementClientProps {
  newsArticles: NewsArticle[]
  currentUser: any
  firebaseConfigured: boolean
}

export function NewsManagementClient({
  newsArticles: initialArticles,
  currentUser,
  firebaseConfigured
}: NewsManagementClientProps) {
  const [newsArticles, setNewsArticles] = useState(initialArticles)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const categories = ["all", "immigration", "tax", "investment", "market"]

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = async (newsId: string) => {
    if (!confirm("Are you sure you want to delete this news article? This action cannot be undone.")) {
      return
    }

    setDeletingId(newsId)

    try {
      const response = await fetch('/api/admin/news/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newsId })
      })

      const data = await response.json()

      if (response.ok) {
        // Remove from local state
        setNewsArticles(prev => prev.filter(article => article.id !== newsId))
      } else {
        alert(`Failed to delete: ${data.error}`)
      }
    } catch (error) {
      alert('An error occurred while deleting the news article')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">News Management</h1>
        <p className="text-gray-600">Moderate and delete news articles from the feed</p>
      </div>

      {!firebaseConfigured && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2">Firebase Setup Required</h3>
          <p className="text-amber-800">
            News management requires Firebase/Firestore to be configured. Please add FIREBASE_ADMIN_KEY to your environment variables.
          </p>
        </div>
      )}

      {firebaseConfigured && (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-navy/10 rounded-lg">
                  <Newspaper className="w-5 h-5 text-navy" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total Articles</span>
              </div>
              <p className="text-3xl font-bold text-navy">{newsArticles.length}</p>
            </div>

            {categories.slice(1).map(category => (
              <div key={category} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("p-2 rounded-lg", getCategoryColor(category).replace('text-', 'bg-').split(' ')[0].replace('100', '50'))}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 capitalize">{category}</span>
                </div>
                <p className="text-3xl font-bold text-navy">
                  {newsArticles.filter(a => a.category === category).length}
                </p>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all capitalize",
                      selectedCategory === category
                        ? "bg-navy text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* News Articles Table */}
          {filteredArticles.length > 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Article</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Source</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="font-semibold text-navy mb-1 line-clamp-1">{article.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize",
                            getCategoryColor(article.category)
                          )}>
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{article.source}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.publishedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {article.url && (
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                                title="View article"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete(article.id)}
                              disabled={deletingId === article.id}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete article"
                            >
                              {deletingId === article.id ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "News articles will appear here once they're aggregated"}
              </p>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Real-time News Feed</p>
              <p>News articles are automatically aggregated from various sources. Use the delete button to remove any unwanted articles from the public news feed.</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
