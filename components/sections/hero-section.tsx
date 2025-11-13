"use client"

import Link from "next/link"
import { ArrowRight, Shield, TrendingUp, Award } from "lucide-react"
import { motion } from "framer-motion"

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-navy via-primary-800 to-deep-blue text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Expert Wealth Management for{" "}
              <span className="text-gold">Non-Resident Indians</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 font-medium">
              Trusted Financial Guidance Across Borders Since 2007
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-14 px-10 rounded-button text-base font-semibold bg-deep-orange text-white hover:bg-deep-orange/90 shadow-md transition-colors"
            >
              Schedule Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/calculators"
              className="inline-flex items-center justify-center h-14 px-10 rounded-button text-base border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Explore Calculators
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-8"
          >
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Shield className="h-5 w-5 text-gold" />
              <span>SEBI Registered</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <TrendingUp className="h-5 w-5 text-gold" />
              <span>₹250+ Cr AUA</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Award className="h-5 w-5 text-gold" />
              <span>500+ Clients</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-16 md:h-20">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
