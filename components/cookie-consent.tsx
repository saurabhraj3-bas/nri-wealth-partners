"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
  }

  const rejectAll = () => {
    localStorage.setItem("cookie-consent", "rejected")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 animate-fade-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">We use cookies</h3>
            <p className="text-sm text-gray-600">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
              By clicking "Accept All", you consent to our use of cookies.{" "}
              <Link href="/privacy-policy" className="text-navy hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              className="whitespace-nowrap"
            >
              Reject All
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={acceptAll}
              className="whitespace-nowrap"
            >
              Accept All
            </Button>
          </div>
          <button
            onClick={rejectAll}
            className="absolute top-4 right-4 md:relative md:top-0 md:right-0 text-gray-400 hover:text-gray-600"
            aria-label="Close cookie banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
