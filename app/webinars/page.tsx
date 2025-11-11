"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Users,
  Video,
  Globe,
  Play,
  Download,
  ExternalLink,
  CheckCircle2,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample data - Replace with your actual Google Sheets data
const upcomingWebinars = [
  {
    id: "nri-tax-dec-2024",
    title: "Year-End Tax Planning for NRIs - FY 2024-25",
    description: "Comprehensive guide to maximize tax savings before financial year end. Learn about tax-saving investments, deductions, and compliance requirements.",
    speaker: "Anil Parekh",
    speakerTitle: "Chartered Accountant",
    speakerImage: "/images/team/anil-parekh.jpg",
    date: "2024-12-15",
    time: "19:00",
    timezone: "EST",
    duration: "60 mins",
    registrationLink: "https://forms.google.com/your-form-link", // Replace with your Google Form
    topics: [
      "Section 80C to 80U deductions",
      "Old vs New tax regime comparison",
      "TDS and advance tax planning",
      "Last-minute investment options"
    ],
    audience: "NRIs in USA, Canada",
    seats: 100,
    registered: 67
  },
  {
    id: "sip-strategy-jan-2025",
    title: "SIP Strategy for 2025: Building Wealth Systematically",
    description: "Learn how to use systematic investment plans to build long-term wealth. Ideal for NRIs looking to invest regularly in Indian markets.",
    speaker: "Avani Parekh",
    speakerTitle: "AMFI Registered Mutual Fund Distributor",
    speakerImage: "/images/team/avani-parekh.jpg",
    date: "2025-01-10",
    time: "20:00",
    timezone: "GMT",
    duration: "60 mins",
    registrationLink: "https://forms.google.com/your-form-link", // Replace with your Google Form
    topics: [
      "SIP vs Lumpsum investing",
      "Selecting right mutual funds",
      "Portfolio diversification",
      "Goal-based SIP planning"
    ],
    audience: "NRIs in UK, Europe",
    seats: 100,
    registered: 45
  },
  {
    id: "retirement-planning-jan-2025",
    title: "Retirement Planning for NRIs: Securing Your Future",
    description: "Comprehensive retirement planning strategies for NRIs. Calculate your retirement corpus, understand investment options, and create a sustainable withdrawal plan.",
    speaker: "Anil Parekh",
    speakerTitle: "Chartered Accountant",
    speakerImage: "/images/team/anil-parekh.jpg",
    date: "2025-01-25",
    time: "20:00",
    timezone: "GST",
    duration: "75 mins",
    registrationLink: "https://forms.google.com/your-form-link", // Replace with your Google Form
    topics: [
      "Retirement corpus calculation",
      "Investment allocation strategies",
      "NPS and pension options for NRIs",
      "Healthcare and insurance planning"
    ],
    audience: "NRIs in Middle East",
    seats: 100,
    registered: 38
  }
]

const pastWebinars = [
  {
    id: "nre-nro-nov-2024",
    title: "NRE vs NRO Accounts: Complete Guide",
    description: "Everything you need to know about NRE and NRO accounts, taxation, repatriation rules, and optimal usage strategies.",
    speaker: "Anil Parekh",
    date: "2024-11-05",
    duration: "55 mins",
    views: 234,
    recordingLink: "https://youtube.com/your-recording", // Replace with your YouTube link
    slidesLink: "https://drive.google.com/your-slides", // Replace with your Google Drive link
    topics: [
      "NRE vs NRO comparison",
      "Tax implications",
      "Repatriation rules",
      "Best practices"
    ]
  },
  {
    id: "market-outlook-oct-2024",
    title: "Q4 2024 Market Outlook & Investment Strategy",
    description: "Latest market analysis, sectoral trends, and investment recommendations for NRI investors looking to navigate Indian markets.",
    speaker: "Avani Parekh",
    date: "2024-10-20",
    duration: "65 mins",
    views: 189,
    recordingLink: "https://youtube.com/your-recording",
    slidesLink: "https://drive.google.com/your-slides",
    topics: [
      "Market trends analysis",
      "Sector-wise opportunities",
      "Risk management strategies",
      "Portfolio rebalancing tips"
    ]
  }
]

const timezones = [
  { code: "EST", name: "Eastern Time (USA/Canada)", offset: "-5:00" },
  { code: "PST", name: "Pacific Time (USA/Canada)", offset: "-8:00" },
  { code: "GMT", name: "Greenwich Mean Time (UK)", offset: "+0:00" },
  { code: "GST", name: "Gulf Standard Time (UAE)", offset: "+4:00" },
  { code: "SGT", name: "Singapore Time", offset: "+8:00" },
  { code: "AEDT", name: "Australian Eastern Time", offset: "+11:00" },
  { code: "IST", name: "Indian Standard Time", offset: "+5:30" }
]

export default function WebinarsPage() {
  const [selectedTimezone, setSelectedTimezone] = useState("EST")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Video className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expert Webinars for NRIs
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Join live sessions with our wealth management experts. Learn investment strategies, tax planning, and financial best practices designed specifically for Non-Resident Indians.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Users, label: "Attendees", value: "1,500+" },
                { icon: Video, label: "Webinars Hosted", value: "45+" },
                { icon: Globe, label: "Countries", value: "25+" },
                { icon: Clock, label: "Hours of Content", value: "60+" }
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
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Upcoming Webinars
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Register now for our upcoming sessions. All times shown in your selected timezone.
            </p>

            {/* Timezone Selector */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Globe className="h-5 w-5 text-navy" />
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-navy focus:border-navy"
              >
                {timezones.map((tz) => (
                  <option key={tz.code} value={tz.code}>
                    {tz.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-navy">
                <CardContent className="p-6">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      UPCOMING
                    </span>
                    <span className="text-sm text-gray-500">
                      {webinar.registered}/{webinar.seats} registered
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-navy font-semibold mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(webinar.date)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4" />
                      {webinar.time} {selectedTimezone} • {webinar.duration}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors">
                    {webinar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {webinar.description}
                  </p>

                  {/* Speaker */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={webinar.speakerImage}
                        alt={webinar.speaker}
                        width={48}
                        height={48}
                        className="object-cover object-top w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{webinar.speaker}</div>
                      <div className="text-sm text-gray-600">{webinar.speakerTitle}</div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-navy mb-2">Key Topics:</div>
                    <ul className="space-y-1">
                      {webinar.topics.slice(0, 3).map((topic, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Audience */}
                  <div className="mb-4 text-sm">
                    <span className="font-semibold text-gray-700">Target Audience: </span>
                    <span className="text-gray-600">{webinar.audience}</span>
                  </div>

                  {/* CTA */}
                  <Button asChild variant="cta" className="w-full" size="lg">
                    <a href={webinar.registrationLink} target="_blank" rel="noopener noreferrer">
                      <Bell className="h-4 w-4 mr-2" />
                      Register Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Webinars / Recordings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Past Webinars & Recordings
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Missed a session? Watch recordings and download presentation slides from our previous webinars.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pastWebinars.map((webinar) => (
              <Card key={webinar.id} className="group hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                      RECORDING AVAILABLE
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {webinar.views} views
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-3">
                    {formatDate(webinar.date)} • {webinar.duration}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {webinar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">
                    {webinar.description}
                  </p>

                  {/* Topics */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-navy mb-2">Covered Topics:</div>
                    <div className="flex flex-wrap gap-2">
                      {webinar.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-navy/10 text-navy text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Speaker */}
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Speaker: </span>
                    {webinar.speaker}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button asChild variant="default" className="flex-1">
                      <a href={webinar.recordingLink} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Recording
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={webinar.slidesLink} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recurring Series Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy text-center mb-8">
              Our Webinar Series
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "NRI Tax Corner",
                  frequency: "Monthly",
                  description: "Stay updated on tax laws, compliance requirements, and optimization strategies for NRIs.",
                  icon: "📊"
                },
                {
                  title: "Market Insights",
                  frequency: "Monthly",
                  description: "Expert analysis of Indian markets, sectoral trends, and investment opportunities.",
                  icon: "📈"
                },
                {
                  title: "Ask the CA",
                  frequency: "Bi-Monthly",
                  description: "Live Q&A sessions with CA Anil Parekh. Get your investment questions answered.",
                  icon: "💬"
                },
                {
                  title: "Goal Planning Series",
                  frequency: "Quarterly",
                  description: "Deep dives into specific goals: retirement, education, real estate, and wealth transfer.",
                  icon: "🎯"
                }
              ].map((series, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{series.icon}</div>
                    <h3 className="text-xl font-bold text-navy mb-2">{series.title}</h3>
                    <div className="text-sm text-gold font-semibold mb-3">{series.frequency}</div>
                    <p className="text-gray-600">{series.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Bell className="h-12 w-12 mx-auto mb-6 text-gold" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss a Webinar
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Subscribe to get notifications about upcoming webinars, exclusive resources, and expert insights delivered to your inbox.
            </p>
            <Button asChild variant="cta" size="lg">
              <Link href="/contact">
                Subscribe to Updates
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
