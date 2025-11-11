import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Calculator, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Thank You - We'll Be In Touch Soon",
  description: "Thank you for contacting NRI Wealth Partners. We'll respond to your inquiry within 24 hours.",
}

export default function ThankYouPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              We've received your inquiry and will respond within 24 hours.
            </p>
            <p className="text-gray-600">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-navy mb-4">What Happens Next?</h2>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <p className="text-gray-700">Our expert team will review your inquiry</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <p className="text-gray-700">We'll contact you within 24 hours via your preferred method</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <p className="text-gray-700">We'll schedule a free consultation to discuss your financial goals</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 font-medium">While you wait, explore our resources:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="cta" size="lg">
                <Link href="/calculators">
                  <Calculator className="mr-2 h-5 w-5" />
                  Try Our Calculators
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
