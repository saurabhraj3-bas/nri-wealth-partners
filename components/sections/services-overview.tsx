import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, PieChart, FileText, Anchor, BarChart3, Shield, Building2, Activity, ArrowRight } from "lucide-react"

const ServicesOverview = () => {
  const services = [
    {
      icon: TrendingUp,
      title: "NRI Investment Advisory",
      description: "Tax-efficient cross-border investment strategies tailored for Non-Resident Indians.",
      link: "/services#nri-investment",
    },
    {
      icon: PieChart,
      title: "Mutual Fund Planning",
      description: "AMFI registered, goal-based mutual fund investment and distribution services.",
      link: "/services#mutual-funds",
    },
    {
      icon: FileText,
      title: "Tax Planning & Compliance",
      description: "Expert guidance on India-US taxation, FEMA compliance, and cross-border tax optimization.",
      link: "/services#tax-planning",
    },
    {
      icon: Anchor,
      title: "Retirement Planning",
      description: "Build a secure retirement corpus across borders with comprehensive planning.",
      link: "/services#retirement",
    },
    {
      icon: BarChart3,
      title: "Portfolio Management",
      description: "Active portfolio monitoring, rebalancing, and performance optimization services.",
      link: "/services#portfolio",
    },
    {
      icon: Shield,
      title: "Estate Planning",
      description: "Secure wealth transfer and succession planning for your family's future.",
      link: "/services#estate",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Comprehensive Financial Services for NRIs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From investment advisory to tax planning, we offer a complete suite of wealth management services
            designed specifically for the Non-Resident Indian community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-card-hover transition-all duration-300 border-gray-200"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-navy group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6 text-navy group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {service.description}
                  </CardDescription>
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-sm font-medium text-navy hover:text-gold transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="cta" size="lg">
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesOverview
