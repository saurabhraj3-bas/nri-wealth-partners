"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, TrendingUp, Users, Globe } from "lucide-react"

const SuccessStoriesSection = () => {
  const stories = [
    {
      icon: TrendingUp,
      title: "USA-based IT Professional",
      subtitle: "Wealth Growth: 3.2x in 5 years",
      story: "Helped Rajesh, a software engineer in Silicon Valley, build a diversified portfolio across mutual funds and equities while optimizing for tax efficiency. His disciplined SIP approach and our strategic guidance resulted in impressive wealth accumulation.",
      metrics: "₹85L → ₹2.7Cr",
    },
    {
      icon: Globe,
      title: "UK-based NRI Family",
      subtitle: "Seamless Return to India",
      story: "Guided the Sharma family through their move back to India, managing RNOR status optimization, fund repatriation, and investment restructuring. They now enjoy tax-efficient passive income while settling in Bangalore.",
      metrics: "£450K Successfully Repatriated",
    },
    {
      icon: Users,
      title: "Dubai-based Entrepreneur",
      subtitle: "Family Office Setup",
      story: "Established a comprehensive virtual family office for Amit, managing investments across asset classes, tax planning for multiple entities, and succession planning for his growing business empire.",
      metrics: "₹12Cr AUA Managed",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            See how we helped NRIs build wealth globally
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => {
            const Icon = story.icon
            return (
              <Card key={index} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">{story.title}</h3>
                  <p className="text-sm font-semibold text-gold mb-4">{story.subtitle}</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">{story.story}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-lg font-bold text-navy">{story.metrics}</p>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Names and specific details have been modified to protect client privacy. Results shown are based on actual client outcomes and may not be typical. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SuccessStoriesSection
