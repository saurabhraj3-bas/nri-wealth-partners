"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users2, CheckCircle2, ArrowRight } from "lucide-react"

const FamilyOfficeSection = () => {
  const features = [
    "Holistic wealth management coordination",
    "Investment management across all asset classes",
    "Tax planning and compliance oversight",
    "Estate and succession planning",
    "Cash flow and liquidity management",
    "Consolidated financial reporting",
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-deep-blue to-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
                <Users2 className="h-8 w-8 text-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Virtual Family Office
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                We manage your wealth like an in-house team across investing, taxation and estate planning.
              </p>
              <p className="text-gray-300 mb-8">
                For high-net-worth NRI families, we provide comprehensive wealth management services that function like your personal family office—without the overhead costs. Our team coordinates all aspects of your financial life, giving you peace of mind and more time to focus on what matters most.
              </p>
              <Button asChild variant="outline" size="lg" className="bg-white text-navy hover:bg-gray-100">
                <Link href="/services#family-office">
                  Learn More About Our Family Office Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div>
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">What We Manage</h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-gray-100">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 p-4 bg-gold/20 rounded-lg border border-gold/30">
                    <p className="text-sm text-gray-100">
                      <strong className="text-gold">Dedicated Service:</strong> Each family is assigned a dedicated relationship manager who coordinates all services and ensures seamless execution.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FamilyOfficeSection
