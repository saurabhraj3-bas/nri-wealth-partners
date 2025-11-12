"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TrendingUp, PieChart, FileText, Anchor, BarChart3, Shield, Building2, Activity } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: "nri-investment",
      icon: TrendingUp,
      title: "NRI Investment Advisory",
      description: "Comprehensive investment strategies for NRIs navigating Indian markets",
      features: [
        "Tax-efficient investment structures",
        "Cross-border portfolio optimization",
        "Repatriation planning (NRE/NRO guidance)",
        "Currency hedging strategies",
        "Market analysis and recommendations",
        "FEMA compliance consulting",
      ],
      idealFor: "NRIs in USA, Canada, UK, UAE, Singapore, and Australia",
    },
    {
      id: "mutual-funds",
      icon: PieChart,
      title: "Mutual Fund Distribution",
      description: "AMFI registered mutual fund advisory and distribution services",
      features: [
        "Goal-based fund selection",
        "SIP planning and automation",
        "Regular portfolio rebalancing",
        "Fund performance monitoring",
        "Tax-loss harvesting strategies",
        "Direct vs regular plan guidance",
        "Risk profiling and asset allocation",
      ],
      credentials: "AMFI Registered Distributor - NJ India Invest",
    },
    {
      id: "tax-planning",
      icon: FileText,
      title: "Tax Planning & Compliance",
      description: "Expert guidance on Indian taxation and cross-border compliance",
      features: [
        "India-US tax treaty optimization (DTAA)",
        "FEMA compliance consulting",
        "TDS on NRO accounts - advisory",
        "Capital gains tax planning",
        "Form 15CA/15CB assistance",
        "Income Tax return filing",
        "GST consultancy for businesses",
        "Tax-efficient investment structuring",
      ],
      credentials: "Chartered Accountant with 18+ years experience",
    },
    {
      id: "retirement",
      icon: Anchor,
      title: "Retirement Planning",
      description: "Build a secure retirement across borders",
      features: [
        "Retirement corpus calculation",
        "NPS (National Pension System) guidance",
        "Annuity planning",
        "Social security coordination (US-India)",
        "Healthcare cost planning",
        "Pension income tax strategies",
        "Inflation-adjusted planning",
      ],
    },
    {
      id: "portfolio",
      icon: BarChart3,
      title: "Portfolio Management Services",
      description: "Active portfolio monitoring and optimization",
      features: [
        "Regular portfolio health checks",
        "Asset allocation rebalancing",
        "Risk assessment and mitigation",
        "Performance benchmarking",
        "Investment policy statement creation",
        "Quarterly review reports",
        "Goal tracking and adjustments",
      ],
      trackRecord: "₹250+ Crores Assets Under Advisory",
    },
    {
      id: "estate",
      icon: Shield,
      title: "Estate Planning",
      description: "Secure wealth transfer and succession planning",
      features: [
        "Will drafting guidance",
        "Nomination planning",
        "Trust structure recommendations",
        "Cross-border estate tax considerations",
        "Family wealth governance",
        "Succession planning for business owners",
        "Beneficiary designation review",
      ],
    },
    {
      id: "corporate",
      icon: Building2,
      title: "Corporate Financial Services",
      description: "Comprehensive financial services for businesses",
      features: [
        "Income Tax & GST audits",
        "Business financial planning",
        "MIS and internal controls",
        "Inventory and HR process optimization",
        "Bank audit services",
        "Corporate debt planning",
        "Compliance management",
      ],
      experience: "90+ corporate clients served",
    },
    {
      id: "stock-market",
      icon: Activity,
      title: "Stock Market Advisory",
      description: "Equity market guidance through IIFL partnership",
      features: [
        "Stock recommendations",
        "Market research and analysis",
        "Trading strategies",
        "Risk management",
        "Demat account services",
        "Portfolio diversification",
      ],
      partnership: "IIFL Capital Services Ltd.",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-navy/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              Comprehensive Financial Services for NRIs
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              From investment advisory to tax planning, we offer a complete suite of wealth management services
              designed specifically for the Non-Resident Indian community.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-8 rounded-button text-base font-semibold bg-deep-orange text-white hover:bg-deep-orange/90 shadow-md transition-colors"
            >
              Schedule Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={service.id} id={service.id} className="max-w-5xl mx-auto scroll-mt-24">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-navy" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">{service.title}</CardTitle>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-navy mb-3">Key Features:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-gold mt-1">✓</span>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {service.idealFor && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          <strong>Ideal For:</strong> {service.idealFor}
                        </p>
                      )}
                      {service.credentials && (
                        <p className="text-sm text-navy font-semibold bg-navy/5 p-3 rounded-md">
                          {service.credentials}
                        </p>
                      )}
                      {service.trackRecord && (
                        <p className="text-sm text-green-700 font-semibold bg-green-50 p-3 rounded-md">
                          {service.trackRecord}
                        </p>
                      )}
                      {service.experience && (
                        <p className="text-sm text-blue-700 font-semibold bg-blue-50 p-3 rounded-md">
                          {service.experience}
                        </p>
                      )}
                      {service.partnership && (
                        <p className="text-sm text-purple-700 font-semibold bg-purple-50 p-3 rounded-md">
                          <strong>Partnership:</strong> {service.partnership}
                        </p>
                      )}
                      <div className="pt-4">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-button text-sm font-semibold bg-deep-orange text-white hover:bg-deep-orange/90 shadow-md transition-colors"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-navy to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Contact us today for a personalized consultation and discover how we can help you achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-8 rounded-button text-base font-semibold bg-deep-orange text-white hover:bg-deep-orange/90 shadow-md transition-colors"
            >
              Schedule Consultation
            </Link>
            <a
              href="tel:+919974742626"
              className="inline-flex items-center justify-center h-11 px-8 rounded-button text-base border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Call +91 9974742626
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
