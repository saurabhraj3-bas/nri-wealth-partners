import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Globe, Linkedin, Twitter, Facebook, Youtube } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep-blue text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logos/logo.png"
                alt="NRI Wealth Partners"
                width={240}
                height={95}
                className="h-20 w-auto brightness-0 invert"
              />
            </div>
            <h3 className="text-2xl font-bold text-gold mb-3">NRI Wealth Partners</h3>
            <p className="text-gray-300 text-sm mb-4">
              Expert wealth management and financial advisory services for Non-Resident Indians since 2007.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Calculators
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#nri-investment" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Investment Advisory
                </Link>
              </li>
              <li>
                <Link href="/services#mutual-funds" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Mutual Fund Planning
                </Link>
              </li>
              <li>
                <Link href="/services#tax-planning" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Tax Planning
                </Link>
              </li>
              <li>
                <Link href="/services#retirement" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Retirement Planning
                </Link>
              </li>
              <li>
                <Link href="/services#portfolio" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Portfolio Management
                </Link>
              </li>
              <li>
                <Link href="/services#corporate" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Corporate Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-300 text-sm">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-gold" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-gold" />
                <a href="tel:+919974742626" className="hover:text-gold transition-colors">
                  +91 9974742626
                </a>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-gold" />
                <a href="mailto:support@nriwealthpartners.com" className="hover:text-gold transition-colors">
                  support@nriwealthpartners.com
                </a>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Globe className="h-5 w-5 mr-2 flex-shrink-0 text-gold" />
                <span>www.nriwealthpartners.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-400">Business Hours:</p>
              <p className="text-sm text-gray-300">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
              <p className="text-sm text-gray-300">Sat: 10:00 AM - 2:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEBI Disclaimer */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gold mb-2">SEBI Registration & Compliance</p>
            <p className="text-xs text-gray-400 max-w-4xl mx-auto">
              Mutual fund investments are subject to market risks, read all scheme related documents carefully.
              Past performance is not indicative of future returns. Avani Parekh is registered with AMFI as a
              Mutual Fund Distributor. We comply with SEBI, AMFI, ICAI, and FEMA regulations.
            </p>
            <Link href="/sebi-disclaimer" className="text-xs text-gold hover:underline mt-2 inline-block">
              Read Full SEBI Disclaimer →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} NRI Wealth Partners. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden md:inline">|</span>
              <Link href="/terms" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <span className="hidden md:inline">|</span>
              <Link href="/sebi-disclaimer" className="hover:text-gold transition-colors">
                SEBI Disclaimer
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Made with ❤️ for NRIs Worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
