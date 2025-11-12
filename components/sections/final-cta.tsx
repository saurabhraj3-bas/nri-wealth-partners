"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight } from "lucide-react"

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-navy via-primary-800 to-deep-blue text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Secure Your Financial Future?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Schedule a free consultation with our expert advisors and discover personalized wealth management solutions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild variant="cta" size="xl" className="bg-deep-orange hover:bg-deep-orange/90">
              <Link href="/contact">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="flex justify-center items-center text-gray-200">
            <a
              href="mailto:support@nriwealthpartners.com"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Mail className="h-5 w-5" />
              support@nriwealthpartners.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
