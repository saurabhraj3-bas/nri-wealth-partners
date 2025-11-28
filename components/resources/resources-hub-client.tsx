"use client"

/**
 * Resources Hub Client Component
 *
 * Handles tab navigation and client-side interactivity
 */

import { useState } from "react"
import { Newspaper, Globe, BookOpen, Mail, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type TabType = "newsletter" | "news" | "library"

interface ResourcesHubClientProps {
  newsletterContent: React.ReactNode
  newsContent: React.ReactNode
  libraryContent: React.ReactNode
}

export default function ResourcesHubClient({
  newsletterContent,
  newsContent,
  libraryContent
}: ResourcesHubClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("newsletter")

  const tabs = [
    {
      id: "newsletter" as TabType,
      name: "Newsletter Archive",
      icon: Newspaper,
      description: "AI-curated weekly insights"
    },
    {
      id: "news" as TabType,
      name: "Latest News",
      icon: Globe,
      description: "Real-time updates"
    },
    {
      id: "library" as TabType,
      name: "Resource Library",
      icon: BookOpen,
      description: "Guides & webinars"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <TrendingUp className="w-4 h-4" />
              Your NRI Wealth Knowledge Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Make Informed Decisions
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Access curated newsletters, real-time news updates, and comprehensive resources - all in one place
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                asChild
              >
                <a href="#newsletter-subscribe">
                  <Mail className="w-5 h-5 mr-2" />
                  Subscribe to Newsletter
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={() => setActiveTab("news")}
              >
                <Globe className="w-5 h-5 mr-2" />
                View Latest News
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-lg p-1 my-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-white text-navy shadow-md"
                        : "text-gray-600 hover:text-navy"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.id === "newsletter" ? "Newsletter" : tab.id === "news" ? "News" : "Library"}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "newsletter" && newsletterContent}
          {activeTab === "news" && newsContent}
          {activeTab === "library" && libraryContent}
        </div>
      </section>
    </div>
  )
}
