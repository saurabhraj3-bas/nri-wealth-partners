"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileCheck, Globe, Landmark, BookOpen, CheckCircle2 } from "lucide-react"

const ComplianceSection = () => {
  const complianceServices = [
    {
      icon: Shield,
      title: "FEMA Compliance",
      description: "Expert guidance on Foreign Exchange Management Act regulations for NRIs",
    },
    {
      icon: FileCheck,
      title: "FATCA & CRS",
      description: "Complete assistance with FATCA and Common Reporting Standard compliance",
    },
    {
      icon: Globe,
      title: "Repatriation",
      description: "Seamless fund repatriation services in line with RBI guidelines",
    },
    {
      icon: Landmark,
      title: "NRE/NRO/FCNR",
      description: "Comprehensive support for NRI account types and regulations",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-navy/5 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-navy rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            NRI Compliance Made Simple
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We help NRIs with FEMA, FATCA, CRS, repatriation, NRE/NRO/FCNR rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {complianceServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="text-center border-navy/20 hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-white border-navy/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy mb-3">
                    Stay Compliant, Stay Stress-Free
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Navigating cross-border regulations can be complex. Our team ensures you remain compliant with all Indian and international regulations, giving you peace of mind to focus on growing your wealth.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>Regular updates on regulatory changes</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>Expert filing and documentation support</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>Proactive compliance monitoring</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ComplianceSection
