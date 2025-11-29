"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TrendingUp, PieChart, FileText, Anchor, BarChart3, Shield, Building2, Activity, FileCheck, Plane, Sparkles, Users2, ChevronRight } from "lucide-react"

export default function ServicesPage() {
  // Journey-Based Service Categories
  const serviceCategories = [
    {
      category: "Building Wealth",
      categoryIcon: "🏗️",
      categoryDescription: "Grow your wealth with expert investment strategies tailored for NRIs",
      services: [
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
          trackRecord: "₹500+ Crores Assets Under Advisory",
        },
      ],
    },
    {
      category: "Specialized Solutions",
      categoryIcon: "🌐",
      categoryDescription: "Advanced wealth management for sophisticated investors",
      services: [
        {
          id: "alternative-investments",
          icon: Sparkles,
          title: "Alternative Investments & GIFT City",
          description: "Access to Start-ups, AIFs, PMS, and GIFT City opportunities for NRIs",
          features: [
            "Alternative Investment Funds (AIFs) - Cat I, II, III",
            "Portfolio Management Services (PMS)",
            "Start-up investment opportunities",
            "GIFT City (India's IFSC) products and services",
            "Private equity and venture capital access",
            "Structured products for sophisticated investors",
            "Due diligence and investment evaluation",
            "Regulatory compliance for alternative investments",
          ],
          idealFor: "High-net-worth NRIs seeking diversification beyond traditional assets",
        },
        {
          id: "family-office",
          icon: Users2,
          title: "Virtual Family Office",
          description: "Comprehensive wealth management like an in-house team across investing, taxation, and estate planning",
          features: [
            "Holistic wealth management coordination",
            "Investment management across all asset classes",
            "Tax planning and compliance oversight",
            "Estate and succession planning",
            "Cash flow and liquidity management",
            "Consolidated financial reporting",
            "Multi-generational wealth planning",
            "Dedicated relationship manager",
          ],
          idealFor: "High-net-worth NRI families seeking comprehensive wealth management",
          trackRecord: "White-glove service for ultra-high-net-worth clients",
        },
      ],
    },
    {
      category: "Regulatory & Tax",
      categoryIcon: "📋",
      categoryDescription: "Stay compliant with Indian and international tax regulations",
      services: [
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
          id: "nri-compliance",
          icon: FileCheck,
          title: "NRI Compliance & Regulatory Services",
          description: "Comprehensive compliance support for FEMA, FATCA, CRS, and NRI account regulations",
          features: [
            "FEMA compliance and consulting",
            "FATCA and CRS reporting assistance",
            "Repatriation planning and execution",
            "NRE/NRO/FCNR account guidance",
            "Form 15CA/15CB filing support",
            "Regulatory updates and monitoring",
            "Cross-border transaction compliance",
            "Documentation and record-keeping support",
          ],
          idealFor: "NRIs seeking stress-free regulatory compliance across borders",
        },
      ],
    },
    {
      category: "Life Transitions",
      categoryIcon: "🏡",
      categoryDescription: "Navigate major life changes with expert financial guidance",
      services: [
        {
          id: "moving-back",
          icon: Plane,
          title: "Moving Back to India",
          description: "Complete relocation advisory for NRIs returning to India",
          features: [
            "RNOR (Resident but Not Ordinarily Resident) status planning",
            "Tax residency status determination",
            "Investment restructuring for residents",
            "Repatriation of funds guidance",
            "NRE to NRO account conversion",
            "Tax implications of returning to India",
            "Asset allocation for returning NRIs",
            "Social security and pension planning",
          ],
          idealFor: "NRIs planning to return to India permanently or temporarily",
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
      ],
    },
    {
      category: "Additional Services",
      categoryIcon: "💼",
      categoryDescription: "Extended financial services for businesses and equity investors",
      services: [
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
      ],
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

      {/* Services by Journey Categories - Compact Accordion View */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">Our Services by Your Journey</h2>
            <p className="text-gray-600">Click to explore services in each category</p>
          </div>

          <Accordion type="multiple" defaultValue={["category-0"]} className="space-y-4">
            {serviceCategories.map((categoryGroup, categoryIndex) => (
              <AccordionItem
                key={categoryIndex}
                value={`category-${categoryIndex}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="text-4xl">{categoryGroup.categoryIcon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-navy">{categoryGroup.category}</h3>
                      <p className="text-sm text-gray-600 mt-1">{categoryGroup.categoryDescription}</p>
                      <p className="text-xs text-gold mt-1 font-semibold">{categoryGroup.services.length} Services</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 mt-4">
                    {categoryGroup.services.map((service) => {
                      const Icon = service.icon
                      return (
                        <Card key={service.id} id={service.id} className="border-l-4 border-l-gold">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="h-6 w-6 text-navy" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                                <CardDescription className="text-sm">{service.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-navy text-sm mb-2">Key Features:</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="text-gold mt-0.5">✓</span>
                                      <span className="text-gray-700">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {'idealFor' in service && service.idealFor && (
                                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                                  <strong>Ideal For:</strong> {service.idealFor}
                                </p>
                              )}
                              {'credentials' in service && service.credentials && (
                                <p className="text-xs text-navy font-semibold bg-navy/5 p-2 rounded-md">
                                  {service.credentials}
                                </p>
                              )}
                              {'trackRecord' in service && service.trackRecord && (
                                <p className="text-xs text-green-700 font-semibold bg-green-50 p-2 rounded-md">
                                  {service.trackRecord}
                                </p>
                              )}
                              {'experience' in service && service.experience && (
                                <p className="text-xs text-blue-700 font-semibold bg-blue-50 p-2 rounded-md">
                                  {service.experience}
                                </p>
                              )}
                              {'partnership' in service && service.partnership && (
                                <p className="text-xs text-purple-700 font-semibold bg-purple-50 p-2 rounded-md">
                                  <strong>Partnership:</strong> {service.partnership}
                                </p>
                              )}
                              <div className="pt-2">
                                <Link
                                  href="/contact"
                                  className="inline-flex items-center justify-center h-9 px-4 py-2 rounded-button text-sm font-semibold bg-deep-orange text-white hover:bg-deep-orange/90 shadow-md transition-colors"
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
