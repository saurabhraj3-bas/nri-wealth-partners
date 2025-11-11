import { CheckCircle2 } from "lucide-react"

const WhyChooseUs = () => {
  const reasons = [
    "18+ years of proven expertise in NRI financial planning",
    "Chartered Accountant with deep tax and compliance knowledge",
    "AMFI registered mutual fund distribution services",
    "Understanding of both Indian and international markets",
    "Personalized service with transparent communication",
    "Track record with 500+ satisfied clients and ₹250+ Cr AUA",
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-navy/5 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Why Choose NRI Wealth Partners?
            </h2>
            <p className="text-lg text-gray-600">
              Your trusted partner for cross-border wealth management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-700 font-medium">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
