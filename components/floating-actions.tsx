"use client"

import { useState, useEffect } from "react"
import { ArrowUp, MessageCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Show WhatsApp tooltip after 3 seconds, once per session
    const hasSeenTooltip = sessionStorage.getItem("whatsapp-tooltip-seen")
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowWhatsAppTooltip(true)
        sessionStorage.setItem("whatsapp-tooltip-seen", "true")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const whatsappMessage = encodeURIComponent(
    "Hello, I would like to know more about your NRI wealth management services."
  )

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3 no-print">
      {/* WhatsApp Tooltip */}
      {showWhatsAppTooltip && (
        <div className="mb-2 animate-in slide-in-from-bottom-5">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-64 relative">
            <button
              onClick={() => setShowWhatsAppTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">NRI Wealth Partners</h3>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Chat with our NRI wealth specialist anytime.
            </p>
            <a
              href={`https://wa.me/919974742626?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Start Chat
            </a>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/919974742626?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowWhatsAppTooltip(true)}
        className="group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-slow"
        aria-label="Chat with our NRI wealth specialist anytime"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "group flex items-center justify-center w-14 h-14 bg-navy text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
          showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
        <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Back to top
        </span>
      </button>
    </div>
  )
}

export default FloatingActions
