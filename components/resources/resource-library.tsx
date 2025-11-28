"use client"

import { useState } from "react"
import { BookOpen, Download, FileText, Video, TrendingUp, Calendar, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "All Resources", icon: BookOpen },
  { id: "guides", name: "Investment Guides", icon: FileText },
  { id: "videos", name: "Webinars & Videos", icon: Video },
  { id: "market", name: "Market Insights", icon: TrendingUp },
  { id: "tax", name: "Tax Resources", icon: Calendar },
]

const resources = [
  {
    id: 1,
    title: "NRI Tax Guide 2024-25",
    category: "tax",
    type: "PDF Guide",
    description: "Complete tax planning guide for NRIs covering DTAA, TDS, tax residency, RNOR status, and compliance requirements.",
    icon: FileText,
    downloadUrl: "#",
    date: "2024-12-01",
  },
  {
    id: 2,
    title: "Repatriation Checklist for NRIs",
    category: "guides",
    type: "Checklist",
    description: "Step-by-step checklist for NRIs looking to repatriate funds from India, covering RBI guidelines, documentation, and compliance.",
    icon: FileText,
    downloadUrl: "#",
    date: "2024-12-01",
  },
  {
    id: 3,
    title: "Complete Guide to NRI Investment in India",
    category: "guides",
    type: "PDF Guide",
    description: "Comprehensive guide covering all aspects of NRI investments including mutual funds, stocks, real estate, and regulatory compliance.",
    icon: FileText,
    downloadUrl: "/resources-library/nri-investment-guide",
    date: "2024-11-01",
  },
  {
    id: 4,
    title: "Understanding Old vs New Tax Regime FY 2024-25",
    category: "tax",
    type: "PDF Guide",
    description: "Detailed comparison of old and new tax regimes with examples and decision framework for NRIs.",
    icon: FileText,
    downloadUrl: "#",
    date: "2024-10-15",
  },
  {
    id: 5,
    title: "NRE vs NRO Accounts: Complete Guide",
    category: "guides",
    type: "Article",
    description: "Everything you need to know about NRE and NRO accounts, taxation, repatriation rules, and optimal usage.",
    icon: FileText,
    downloadUrl: "#",
    date: "2024-10-01",
  },
  {
    id: 6,
    title: "SIP Strategy for NRIs: Monthly Webinar Recording",
    category: "videos",
    type: "Video",
    description: "Learn systematic investment strategies tailored for NRIs with currency considerations and long-term wealth building.",
    icon: Video,
    downloadUrl: "#",
    date: "2024-09-20",
  },
  {
    id: 7,
    title: "Q3 2024 Market Outlook & Investment Strategy",
    category: "market",
    type: "Report",
    description: "Latest market analysis, sectoral trends, and investment recommendations for NRI investors.",
    icon: TrendingUp,
    downloadUrl: "#",
    date: "2024-09-01",
  },
  {
    id: 8,
    title: "Retirement Planning for NRIs",
    category: "guides",
    type: "PDF Guide",
    description: "Comprehensive retirement planning guide covering corpus calculation, investment allocation, and withdrawal strategies.",
    icon: FileText,
    downloadUrl: "#",
    date: "2024-08-15",
  },
]

export default function ResourceLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesSearch = searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-navy mb-4">Resource Library</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Download guides, watch webinars, and access expert resources to make informed financial decisions.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search resources..."
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

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon
            return (
              <div
                key={resource.id}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-navy hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Icon & Type */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-navy/10 rounded-lg group-hover:bg-navy group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6 text-navy group-hover:text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-navy mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    Published: {new Date(resource.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>

                  {/* CTA */}
                  {resource.downloadUrl !== "#" ? (
                    <Link href={resource.downloadUrl}>
                      <Button variant="outline" className="w-full group-hover:bg-navy group-hover:text-white transition-all">
                        <Download className="mr-2 h-4 w-4" />
                        View Resource
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No resources found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-8 md:p-12 text-white text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gold" />
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Need Personalized Guidance?
        </h3>
        <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
          Our expert advisors can help you navigate complex financial decisions with personalized strategies tailored to your goals.
        </p>
        <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-semibold" asChild>
          <Link href="/contact">
            Schedule a Consultation
          </Link>
        </Button>
      </div>
    </div>
  )
}
