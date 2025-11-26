"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, CheckCircle2, Calendar, Clock, Bell } from "lucide-react"

interface WebinarRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  webinar: {
    id: string
    title: string
    date: string
    time: string
    timezone?: string
  }
}

export function WebinarRegistrationModal({
  isOpen,
  onClose,
  webinar,
}: WebinarRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    countryCode: "+91",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/webinar-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          country: formData.country,
          webinarId: webinar.id,
          webinarTitle: webinar.title,
          webinarDate: formatDate(webinar.date),
          webinarTime: `${webinar.time} ${webinar.timezone || ""}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setIsSuccess(true)

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          countryCode: "+91",
        })
        setIsSuccess(false)
        onClose()
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-navy">
            Register for Webinar
          </DialogTitle>
          <DialogDescription className="text-base">
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-navy">{webinar.title}</p>
                  <p className="text-sm">{formatDate(webinar.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="h-5 w-5 text-gold flex-shrink-0" />
                <p className="text-sm">
                  {webinar.time} {webinar.timezone || ""}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">
              Registration Successful!
            </h3>
            <p className="text-gray-600">
              Check your email for confirmation and webinar details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, countryCode: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91 (India)</SelectItem>
                    <SelectItem value="+1">+1 (USA)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+971">+971 (UAE)</SelectItem>
                    <SelectItem value="+65">+65 (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  placeholder="9876543210"
                  className="flex-1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="UAE">United Arab Emirates</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="cta"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Register Now
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
