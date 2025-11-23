import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Award, Users, TrendingUp, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - Meet Our Expert Team",
  description: "Learn about NRI Wealth Partners, led by CA Anil Parekh and AMFI Registered Distributor Avani Parekh. 18+ years of expertise in wealth management for NRIs.",
}

export default function AboutPage() {
  const values = [
    { icon: Shield, title: "Integrity", description: "Unwavering commitment to ethical practices" },
    { icon: Users, title: "Client-First", description: "Your financial success is our priority" },
    { icon: TrendingUp, title: "Expertise", description: "Deep knowledge of NRI financial landscape" },
    { icon: Award, title: "Transparency", description: "Clear communication at every step" },
  ]

  const anilExpertise = [
    "Cross-Border Tax Planning",
    "Investment Strategy & Advisory",
    "Income Tax & GST Compliance",
    "Corporate Finance & Auditing",
    "Risk Management",
    "Business Consultancy",
    "Estate Planning",
    "Wealth Management",
  ]

  const avaniExpertise = [
    "Goal-Based Financial Planning",
    "Mutual Fund Distribution",
    "Asset Allocation Strategies",
    "Portfolio Review & Rebalancing",
    "Stock Market Advisory",
    "Client Relationship Management",
    "Digital Investment Platforms",
    "Investor Education",
    "Regulatory Compliance",
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-navy/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              About NRI Wealth Partners
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Empowering Non-Resident Indians to build and preserve wealth across borders through expert financial guidance,
              transparent communication, and personalized strategies since 2007.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-navy mb-4">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  To be the most trusted financial partner for the global Indian diaspora, known for exceptional service,
                  deep expertise, and unwavering commitment to our clients' financial success.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-navy mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  To empower Non-Resident Indians to build and preserve wealth across borders through expert financial guidance,
                  transparent communication, and personalized strategies that align with their unique needs and goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-navy" />
                    </div>
                    <h3 className="text-xl font-semibold text-navy mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-4">Meet Our Expert Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We are a young, energetic team working across tax, investments and compliance. Led by seasoned professionals with decades of combined experience in wealth management and financial advisory, we bring a fresh perspective to managing your global wealth.
          </p>

          {/* Anil Parekh */}
          <div className="max-w-5xl mx-auto mb-16">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-navy/5 to-primary/10 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-48 h-48 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src="/images/team/anil-parekh.jpg"
                        alt="Anil Parekh - Founder & Chief Investment Advisor"
                        width={192}
                        height={192}
                        className="object-cover object-top w-full h-full"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <h3 className="text-3xl font-bold text-navy mb-2">Anil Parekh</h3>
                  <p className="text-xl text-gold font-semibold mb-4">
                    Founder & Chief Investment Advisor
                  </p>
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Chartered Accountant | 18+ Years Experience
                  </p>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Mr. Anil Parekh is a distinguished Chartered Accountant and investment advisor with over 18 years of
                      specialized expertise in wealth management, financial planning, and investment advisory services.
                      Since establishing Anil Parekh & Co. in 2007, he has built a reputation for delivering exceptional
                      financial services to a diverse clientele spanning individuals and corporations.
                    </p>
                    <p>
                      Throughout his career, Mr. Parekh has served more than 90 corporate clients and 1,400+ individual clients,
                      providing comprehensive solutions in tax calculation, income tax audits, GST consultancy, internal controls,
                      business planning, and corporate finance. His holistic approach to wealth management emphasizes customized
                      strategies that align precisely with each client's short- and long-term financial goals.
                    </p>
                    <p>
                      With deep expertise in market dynamics, tax-efficient investment strategies, and sophisticated risk management,
                      Mr. Parekh has become a trusted advisor for Non-Resident Indians seeking to navigate the complexities of
                      cross-border financial planning.
                    </p>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold text-navy mb-3">Core Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {anilExpertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-navy/10 text-navy text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Avani Parekh */}
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-navy/5 to-primary/10 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-48 h-48 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src="/images/team/avani-parekh.jpg"
                        alt="Avani Parekh - Co-Founder & Wealth Management Specialist"
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <h3 className="text-3xl font-bold text-navy mb-2">Avani Parekh</h3>
                  <p className="text-xl text-gold font-semibold mb-4">
                    Co-Founder & Wealth Management Specialist
                  </p>
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    AMFI Registered Mutual Fund Distributor | Sub-Broker (IIFL)
                  </p>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Mrs. Avani Parekh brings extensive expertise and a client-centric approach to wealth management,
                      specializing in mutual fund distribution and equity market advisory. Since 2012, she has been instrumental
                      in helping clients achieve their financial goals through disciplined, transparent, and goal-oriented
                      investment strategies.
                    </p>
                    <p>
                      As an AMFI registered Mutual Fund Distributor with NJ India Invest Pvt. Ltd. and Sub-Broker with IIFL
                      Capital Services Ltd., Mrs. Parekh manages an impressive portfolio with Assets Under Advisory exceeding
                      ₹250 Crores. Her client base includes 500+ individual investors and 40+ corporate clients, all of whom
                      benefit from her deep understanding of market dynamics and investment products.
                    </p>
                    <p>
                      Mrs. Parekh's philosophy centers on building long-term financial security through disciplined mutual fund
                      investments, strategic asset allocation, and comprehensive financial planning. She is particularly skilled
                      at goal-based planning, helping NRI families align their investments with life milestones such as education,
                      retirement, and wealth transfer.
                    </p>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold text-navy mb-3">Core Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {avaniExpertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-navy/10 text-navy text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Affiliations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">Professional Affiliations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "Institute of Chartered Accountants of India (ICAI)",
              "Association of Mutual Funds in India (AMFI)",
              "IIFL Capital Services Ltd.",
              "NJ India Invest Pvt. Ltd.",
            ].map((affiliation, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">{affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
