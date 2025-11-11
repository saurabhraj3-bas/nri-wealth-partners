"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    {
      name: "Services",
      href: "/services",
      dropdown: [
        { name: "NRI Investment Advisory", href: "/services#nri-investment" },
        { name: "Mutual Fund Planning", href: "/services#mutual-funds" },
        { name: "Tax Planning & Compliance", href: "/services#tax-planning" },
        { name: "Retirement Planning", href: "/services#retirement" },
        { name: "Portfolio Management", href: "/services#portfolio" },
        { name: "Estate Planning", href: "/services#estate" },
        { name: "Corporate Services", href: "/services#corporate" },
        { name: "Stock Market Advisory", href: "/services#stock-market" },
      ],
    },
    {
      name: "Calculators",
      href: "/calculators",
      dropdown: [
        { name: "SIP Calculator", href: "/calculators#calc-sip" },
        { name: "Lumpsum Investment", href: "/calculators#calc-lumpsum" },
        { name: "Retirement Planning", href: "/calculators#calc-retirement" },
        { name: "Tax Calculator", href: "/calculators#calc-tax" },
        { name: "Currency Impact", href: "/calculators#calc-currency" },
        { name: "NRE/NRO Calculator", href: "/calculators#calc-nre-nro" },
        { name: "Home Loan EMI", href: "/calculators#calc-home-loan" },
        { name: "PPF Calculator", href: "/calculators#calc-ppf" },
        { name: "Goal Planner", href: "/calculators#calc-goal-planner" },
        { name: "Education Planner", href: "/calculators#calc-education" },
      ],
    },
    { name: "Resources", href: "/resources" },
    { name: "Webinars", href: "/webinars" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white border-b border-gray-200"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-40">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 py-4">
            <Image
              src="/images/logos/logo.png"
              alt="NRI Wealth Partners"
              width={450}
              height={169}
              className="h-36 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-navy py-2",
                    pathname === item.href
                      ? "text-navy"
                      : "text-gray-700"
                  )}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fade-in z-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-navy hover:text-white transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            <Button asChild variant="cta" size="sm" className="whitespace-nowrap">
              <Link href="/services">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-navy transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-in-right">
            {navigation.map((item) => (
              <div key={item.name} className="py-2">
                <Link
                  href={item.href}
                  className={cn(
                    "block px-4 py-2 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-navy text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 mt-2 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 px-4">
              <Button asChild variant="cta" size="default" className="w-full">
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
