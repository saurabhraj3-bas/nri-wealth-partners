import type { Metadata } from "next"
import ContactForm from "@/components/forms/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Globe, Clock, MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Our Experts",
  description: "Contact NRI Wealth Partners for personalized financial guidance. Call +91 9974742626 or email support@nriwealthpartners.com. Schedule your free consultation today.",
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-navy/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-700">
              Have questions? We're here to help. Reach out to our expert team for personalized financial guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Office Address</p>
                        <p className="text-sm text-gray-600">605-Titanium One, Besides Rajpath Club,<br />S G Highway, Bodakdev,<br />Ahmedabad, Gujarat, India - 380054</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a href="tel:+919974742626" className="text-sm text-navy hover:text-gold transition-colors">
                          +91 9974742626
                        </a>
                        <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9 AM - 6 PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href="mailto:support@nriwealthpartners.com" className="text-sm text-navy hover:text-gold transition-colors">
                          support@nriwealthpartners.com
                        </a>
                        <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <p className="text-sm text-gray-600">www.nriwealthpartners.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium text-gray-900">Monday - Friday</p>
                        <p className="text-sm text-gray-600">9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium text-gray-900">Saturday</p>
                        <p className="text-sm text-gray-600">10:00 AM - 2:00 PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Sunday</p>
                        <p className="text-sm text-gray-600">Closed</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    * We schedule appointments outside these hours for international clients
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#25D366] text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">WhatsApp</h3>
                  <p className="text-sm mb-4 text-white/90">
                    Get instant replies to your queries via WhatsApp
                  </p>
                  <a
                    href="https://wa.me/919974742626?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services%20for%20NRIs."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-[#25D366] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message on WhatsApp
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
