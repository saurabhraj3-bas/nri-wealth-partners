"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3 no-print">
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
