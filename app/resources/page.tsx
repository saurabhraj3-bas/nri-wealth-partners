"use client"

import { useState } from "react"
import { BookOpen, Download, FileText, Video, TrendingUp, Calendar, Search } from "lucide-react"
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
  {
    id: 9,
    title: "Currency Impact on NRI Investments",
    category: "market",
    type: "Article",
    description: "Understanding how currency fluctuations affect your Indian investments and hedging strategies.",
    icon: TrendingUp,
    downloadUrl: "#",
    date: "2024-08-01",
  },
  {
    id: 10,
    title: "Tax Planning Webinar for NRIs",
    category: "tax",
    type: "Video",
    description: "Expert strategies for tax optimization covering DTAA, TDS, and compliance requirements.",
    icon: Video,
    downloadUrl: "#",
    date: "2024-07-15",
  },
  {
    id: 11,
    title: "Mutual Fund Selection Framework",
    category: "guides",
    type: "Checklist",
    description: "Step-by-step framework for selecting the right mutual funds based on goals, risk profile, and time horizon.",
    icon: FileText,
    downloadUrl: "#",
    date: "2024-07-01",
  },
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Knowledge Center
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Expert insights, guides, and resources to help you make informed investment decisions
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
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

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => {
                const Icon = resource.icon
                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-navy hover:shadow-xl transition-all p-6 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-navy/10 rounded-lg group-hover:bg-navy/20 transition-colors">
                        <Icon className="h-6 w-6 text-navy" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {resource.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-navy transition-colors">
                      {resource.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {new Date(resource.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <Button variant="ghost" size="sm" className="text-navy hover:text-white hover:bg-navy">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with Latest Resources
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Subscribe to receive new investment guides, market insights, and tax updates directly in your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:ring-gold"
              />
              <Button variant="cta" size="lg" className="whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Personalized Guidance?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our wealth advisors are here to help you with customized investment strategies
            </p>
            <Button asChild variant="cta" size="lg">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
