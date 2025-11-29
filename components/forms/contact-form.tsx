"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2 } from "lucide-react"

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  countryCode: z.string(),
  country: z.string().min(1, "Please select your country"),
  inquiryType: z.string().min(1, "Please select inquiry type"),
  subject: z.string().optional(),
  message: z.string().min(20, "Message must be at least 20 characters"),
  contactMethod: z.enum(["Email", "Phone", "WhatsApp"]),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
})

type ContactFormData = z.infer<typeof contactSchema>

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      countryCode: "+91",
      contactMethod: "Email",
      privacyConsent: false,
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Call API to send email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      console.log("Form submitted successfully:", result)

      // Show success toast
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
        duration: 3000,
      })

      reset()

      // Redirect to thank you page after toast
      setTimeout(() => {
        window.location.href = "/thank-you"
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message"

      // Show error toast
      toast.error("Failed to send message", {
        description: errorMessage + ". Please try again or contact us directly at support@nriwealthpartners.com",
        duration: 5000,
      })

      setError(errorMessage)
      console.error("Form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <div className="relative">
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="John Doe"
            className="mt-1 pr-10"
          />
          {touchedFields.fullName && !errors.fullName && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 mt-0.5" />
          )}
        </div>
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@example.com"
            className="mt-1 pr-10"
          />
          {touchedFields.email && !errors.email && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 mt-0.5" />
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="flex gap-2 mt-1">
          <Select
            defaultValue="+91"
            onValueChange={(value) => setValue("countryCode", value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+91">+91 (India)</SelectItem>
              <SelectItem value="+1">+1 (US/CA)</SelectItem>
              <SelectItem value="+44">+44 (UK)</SelectItem>
              <SelectItem value="+971">+971 (UAE)</SelectItem>
              <SelectItem value="+65">+65 (SG)</SelectItem>
              <SelectItem value="+61">+61 (AU)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 relative">
            <Input
              id="phone"
              {...register("phone")}
              placeholder="9974742626"
              className="pr-10"
            />
            {touchedFields.phone && !errors.phone && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
            )}
          </div>
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <Label htmlFor="country">Country of Residence *</Label>
        <div className="relative">
          <Select onValueChange={(value) => { setValue("country", value); trigger("country"); }}>
            <SelectTrigger className="mt-1 pr-10">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="UK">UK</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {watch("country") && !errors.country && (
            <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 mt-0.5 pointer-events-none" />
          )}
        </div>
        {errors.country && (
          <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
        )}
      </div>

      {/* Inquiry Type */}
      <div>
        <Label htmlFor="inquiryType">Type of Inquiry *</Label>
        <div className="relative">
          <Select onValueChange={(value) => { setValue("inquiryType", value); trigger("inquiryType"); }}>
            <SelectTrigger className="mt-1 pr-10">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
              <SelectItem value="Investment Advisory">Investment Advisory</SelectItem>
              <SelectItem value="Mutual Fund Planning">Mutual Fund Planning</SelectItem>
              <SelectItem value="Tax Planning & Compliance">Tax Planning & Compliance</SelectItem>
              <SelectItem value="Retirement Planning">Retirement Planning</SelectItem>
              <SelectItem value="Portfolio Review">Portfolio Review</SelectItem>
              <SelectItem value="Corporate Services">Corporate Services</SelectItem>
              <SelectItem value="Partnership/Collaboration">Partnership/Collaboration</SelectItem>
            </SelectContent>
          </Select>
          {watch("inquiryType") && !errors.inquiryType && (
            <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 mt-0.5 pointer-events-none" />
          )}
        </div>
        {errors.inquiryType && (
          <p className="text-sm text-red-600 mt-1">{errors.inquiryType.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <Label htmlFor="subject">Subject (Optional)</Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder="Brief subject of your inquiry"
          className="mt-1"
        />
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message">Message *</Label>
        <div className="relative">
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Please provide details about your inquiry..."
            rows={5}
            className="mt-1 pr-10"
          />
          {touchedFields.message && !errors.message && (
            <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-600" />
          )}
        </div>
        {errors.message && (
          <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <Label>Preferred Contact Method *</Label>
        <div className="flex gap-4 mt-2">
          {["Email", "Phone", "WhatsApp"].map((method) => (
            <label key={method} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={method}
                {...register("contactMethod")}
                className="w-4 h-4 text-navy"
              />
              <span className="text-sm">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Consent */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("privacyConsent")}
            className="w-4 h-4 text-navy mt-1"
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/privacy-policy" className="text-navy hover:underline">
              privacy policy
            </a>{" "}
            and consent to being contacted *
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="text-sm text-red-600 mt-1">{errors.privacyConsent.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}

export default ContactForm
