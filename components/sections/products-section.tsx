"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, PieChart, Sparkles, ArrowRight } from "lucide-react"

const ProductsSection = () => {
  const products = [
    {
      icon: Building,
      title: "GIFT City Products",
      description: "Access to India's International Financial Services Centre (IFSC) offerings",
      benefits: [
        "Tax-efficient investment structures",
        "Global investment opportunities",
        "Regulatory advantages for NRIs",
      ],
    },
    {
      icon: PieChart,
      title: "Mutual Funds",
      description: "AMFI-registered mutual fund distribution and advisory services",
      benefits: [
        "Goal-based fund selection",
        "SIP planning and automation",
        "Regular portfolio rebalancing",
      ],
    },
    {
      icon: Sparkles,
      title: "Alternative Investment Funds",
      description: "Access to AIFs, PMS, and sophisticated investment products",
      benefits: [
        "Diversification beyond traditional assets",
        "Professional fund management",
        "Access to private equity and venture capital",
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Our Investment Products
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our offerings include GIFT City products, Mutual Funds and Alternative Investment Funds (AIFs).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <Card key={index} className="text-center hover:shadow-card-hover transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-navy" />
                  </div>
                  <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-gold mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're looking for traditional mutual funds, cutting-edge GIFT City opportunities, or alternative investments, we provide access to a comprehensive range of products tailored for NRI investors.
          </p>
          <Button asChild variant="cta" size="lg">
            <Link href="/services">
              Explore All Products & Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
