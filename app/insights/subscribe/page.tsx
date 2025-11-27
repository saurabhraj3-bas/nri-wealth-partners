"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Mail,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Globe,
  Download,
  Smartphone,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NewsletterSubscribePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    interests: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)

  const countries = [
    'USA', 'Canada', 'UK', 'UAE', 'Singapore', 'Australia',
    'Saudi Arabia', 'Qatar', 'Kuwait', 'Germany', 'Other'
  ]

  const interestOptions = [
    'Tax Planning',
    'Investment Strategies',
    'Regulatory Updates',
    'Success Stories',
    'Real Estate',
    'Retirement Planning'
  ]

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async () => {
    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newsletter',
          source: 'website_subscribe_page'
        })
      })

      const data = await response.json()
      setQrCode(data.qrCodeDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-4">
              Almost There!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              We've sent a confirmation email to <strong>{formData.email}</strong>
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 text-left">
              <h3 className="font-bold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="space-y-2 text-blue-800">
                <li>1. Check your email inbox (and spam folder)</li>
                <li>2. Click the confirmation link in the email</li>
                <li>3. You'll start receiving our weekly newsletter every Monday</li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default">
                <Link href="/insights">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Newsletter Archive
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Insights
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-navy via-navy/95 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Mail className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Subscribe to NRI Wealth Insights
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Join 2,000+ NRIs receiving weekly curated insights on wealth management,
              tax planning, and financial success stories
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Free Forever
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                No Spam
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Unsubscribe Anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Subscription Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-navy mb-6">
                    Get Started in 30 Seconds
                  </h2>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Country of Residence
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy"
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        What are you interested in? (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {interestOptions.map(interest => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.interests.includes(interest)
                                ? 'border-navy bg-navy text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-navy'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="cta"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Subscribe Now
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                      By subscribing, you agree to receive our weekly newsletter.
                      You can unsubscribe at any time. We respect your privacy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              {/* What You'll Get */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-navy mb-6">
                    What You'll Get Every Week
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Sparkles,
                        title: 'AI-Curated Content',
                        description: 'Top 12 articles from 19 trusted sources, filtered for NRI relevance'
                      },
                      {
                        icon: TrendingUp,
                        title: 'Success Stories',
                        description: 'Real NRI wealth-building journeys and investment wins'
                      },
                      {
                        icon: Shield,
                        title: 'Regulatory Updates',
                        description: 'Latest FEMA, tax laws, and compliance requirements'
                      },
                      {
                        icon: Clock,
                        title: 'Time-Saving Summaries',
                        description: 'Professional summaries with key takeaways - 5 min read'
                      }
                    ].map((benefit, index) => {
                      const Icon = benefit.icon
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                              <Icon className="h-6 w-6 text-navy" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Section */}
              <Card className="bg-gradient-to-br from-navy to-blue-900 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="h-6 w-6 text-gold" />
                    <h3 className="text-xl font-bold">Subscribe via QR Code</h3>
                  </div>
                  <p className="text-gray-200 mb-6 text-sm">
                    Scan with your phone to subscribe instantly
                  </p>

                  {!qrCode ? (
                    <Button
                      onClick={generateQRCode}
                      variant="outline"
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      Generate QR Code
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <Image
                          src={qrCode}
                          alt="Newsletter Subscription QR Code"
                          width={200}
                          height={200}
                          className="w-full h-auto"
                        />
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
                      >
                        <a href={qrCode} download="newsletter-qr-code.png">
                          <Download className="mr-2 h-4 w-4" />
                          Download QR Code
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Proof */}
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Globe className="h-12 w-12 mx-auto text-navy mb-3" />
                    <h3 className="text-xl font-bold text-navy mb-2">
                      Join Our Global Community
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-navy">2,000+</div>
                      <div className="text-xs text-gray-600">Subscribers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-navy">25+</div>
                      <div className="text-xs text-gray-600">Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-navy">45%</div>
                      <div className="text-xs text-gray-600">Open Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            What Our Subscribers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Rajesh Kumar',
                location: 'USA',
                quote: 'The weekly summaries save me hours of research. I stay updated on all NRI-relevant news in just 5 minutes.'
              },
              {
                name: 'Priya Sharma',
                location: 'UK',
                quote: 'The regulatory updates are invaluable. I caught a tax deadline I would have otherwise missed!'
              },
              {
                name: 'Amit Patel',
                location: 'UAE',
                quote: 'Best NRI newsletter out there. The AI curation is spot-on - no spam, only quality content.'
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className="text-gold text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold text-navy">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
