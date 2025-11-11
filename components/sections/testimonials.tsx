"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "R.S.",
      location: "San Francisco, USA",
      rating: 5,
      text: "Excellent service and expert guidance on NRI investments. Anil and Avani helped me navigate complex tax implications and build a solid portfolio. Highly recommended!",
    },
    {
      name: "M.K.",
      location: "London, UK",
      rating: 5,
      text: "Professional and knowledgeable team. They understood my NRI status concerns and provided tailored solutions for mutual fund investments. Very satisfied with their service.",
    },
    {
      name: "P.D.",
      location: "Dubai, UAE",
      rating: 5,
      text: "Best financial advisors for NRIs! They handled my repatriation concerns and tax planning efficiently. Their expertise in FEMA regulations is exceptional.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by NRIs worldwide for expert financial guidance
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="border-none shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="text-lg md:text-xl text-gray-700 text-center mb-6 italic">
                "{testimonials[currentIndex].text}"
              </blockquote>
              <div className="text-center">
                <p className="font-semibold text-navy text-lg">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-gray-600">{testimonials[currentIndex].location}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-navy w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
