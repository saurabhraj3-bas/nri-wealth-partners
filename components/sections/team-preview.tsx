"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Linkedin } from "lucide-react"

const TeamPreview = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Meet Your Trusted Advisors
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Led by experienced professionals with over 18 years of expertise in wealth management and financial advisory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Anil Parekh */}
          <div className="bg-white rounded-xl shadow-card p-6 text-center hover:shadow-card-hover transition-all duration-300">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 border-4 border-navy/10">
              <Image
                src="/images/team/anil-parekh.jpg"
                alt="Anil Parekh"
                width={160}
                height={160}
                className="object-cover object-top w-full h-full"
              />
            </div>
            <h3 className="text-2xl font-bold text-navy mb-2">Anil Parekh</h3>
            <p className="text-gold font-semibold mb-4">Chartered Accountant | 18+ Years Experience</p>
            <p className="text-gray-600 mb-4">
              Founder & Chief Investment Advisor with deep expertise in wealth management, tax planning, and corporate finance.
            </p>
            <div className="flex justify-center gap-2">
              <a href="#" className="text-navy hover:text-gold transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Avani Parekh */}
          <div className="bg-white rounded-xl shadow-card p-6 text-center hover:shadow-card-hover transition-all duration-300">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 border-4 border-navy/10">
              <Image
                src="/images/team/avani-parekh.jpg"
                alt="Avani Parekh"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-2xl font-bold text-navy mb-2">Avani Parekh</h3>
            <p className="text-gold font-semibold mb-4">AMFI Registered Mutual Fund Distributor</p>
            <p className="text-gray-600 mb-4">
              Co-Founder & Wealth Management Specialist managing ₹250+ Crores AUA with expertise in goal-based planning.
            </p>
            <div className="flex justify-center gap-2">
              <a href="#" className="text-navy hover:text-gold transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/about">
              Learn More About Our Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TeamPreview
