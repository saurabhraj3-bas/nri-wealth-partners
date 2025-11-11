"use client"

import type { Metadata } from "next"
import React, { useState, useEffect } from "react"
import SIPCalculator from "@/components/calculators/sip-calculator"
import LumpsumCalculator from "@/components/calculators/lumpsum-calculator"
import RetirementCalculator from "@/components/calculators/retirement-calculator"
import HomeLoanCalculator from "@/components/calculators/home-loan-calculator"
import PPFCalculator from "@/components/calculators/ppf-calculator"
import TaxCalculator from "@/components/calculators/tax-calculator"
import CurrencyDepreciationCalculator from "@/components/calculators/currency-depreciation-calculator"
import NRECalculator from "@/components/calculators/nre-nro-calculator"
import GoalPlannerCalculator from "@/components/calculators/goal-planner-calculator"
import EducationCalculator from "@/components/calculators/education-calculator"

const calculators = [
  {
    id: "sip",
    name: "SIP Calculator",
    icon: "📈",
    category: "investment",
    description: "Calculate returns on systematic investment plans with rupee cost averaging benefits",
    component: SIPCalculator,
    popular: true,
  },
  {
    id: "lumpsum",
    name: "Lumpsum Investment",
    icon: "💵",
    category: "investment",
    description: "Estimate returns on one-time investments with compound interest calculation",
    component: LumpsumCalculator,
    popular: true,
  },
  {
    id: "retirement",
    name: "Retirement Planning",
    icon: "🏖️",
    category: "investment",
    description: "Plan your retirement corpus with inflation-adjusted expense projections",
    component: RetirementCalculator,
    popular: true,
  },
  {
    id: "tax",
    name: "Income Tax Calculator",
    icon: "💰",
    category: "tax",
    description: "Compare old vs new tax regime for FY 2024-25 and optimize your tax liability",
    component: TaxCalculator,
    popular: true,
  },
  {
    id: "ppf",
    name: "PPF Calculator",
    icon: "🛡️",
    category: "investment",
    description: "Calculate tax-free returns on Public Provident Fund investments",
    component: PPFCalculator,
    popular: false,
  },
  {
    id: "currency",
    name: "Currency Impact",
    icon: "💱",
    category: "tax",
    description: "Project future value with USD, EUR, GBP and other currencies vs INR depreciation",
    component: CurrencyDepreciationCalculator,
    popular: true,
  },
  {
    id: "nre-nro",
    name: "NRE/NRO Calculator",
    icon: "🏦",
    category: "tax",
    description: "Compare NRE and NRO account returns with TDS calculations for NRIs",
    component: NRECalculator,
    popular: true,
  },
  {
    id: "home-loan",
    name: "Home Loan EMI",
    icon: "🏠",
    category: "loans",
    description: "Calculate monthly EMI, total interest, and view amortization schedule",
    component: HomeLoanCalculator,
    popular: false,
  },
  {
    id: "goal-planner",
    name: "Financial Goal Planner",
    icon: "🎯",
    category: "loans",
    description: "Plan for specific goals like home, car, wedding, or business with SIP/lumpsum options",
    component: GoalPlannerCalculator,
    popular: false,
  },
  {
    id: "education",
    name: "Education Cost Planner",
    icon: "🎓",
    category: "loans",
    description: "Plan for child's education in India or abroad with inflation-adjusted costs",
    component: EducationCalculator,
    popular: false,
  },
]

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "All Calculators", icon: "📊" },
    { id: "investment", name: "Investment Planning", icon: "💰" },
    { id: "tax", name: "Tax & Currency", icon: "📈" },
    { id: "loans", name: "Loans & Goals", icon: "🏠" },
  ]

  const filteredCalculators = selectedCategory === "all"
    ? calculators
    : calculators.filter((calc) => calc.category === selectedCategory)

  const popularCalculators = calculators.filter((calc) => calc.popular)

  // Auto-open calculator based on URL hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "")
      if (hash.startsWith("calc-")) {
        const calcId = hash.replace("calc-", "")
        setActiveCalculator(calcId)
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-navy via-navy/95 to-primary overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-gold/20 border border-gold/30 rounded-full">
              <span className="text-gold font-semibold text-sm">Professional Financial Tools</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Smart Financial Calculators
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Make data-driven investment decisions with our comprehensive suite of calculators
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Accurate Projections</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real-time Calculations</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>NRI-Specific Tools</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 inline-block">
              <strong className="text-gold">Professional Disclaimer:</strong> These calculators provide estimates for planning purposes.
              Actual returns may vary based on market conditions. Consult our certified advisors for personalized recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Calculators Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy">Most Popular</h2>
                <p className="text-gray-600 mt-1">Start with our most-used calculators</p>
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                {popularCalculators.length} Tools
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCalculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalculator(calc.id)
                    document.getElementById(`calc-${calc.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="group text-left bg-white rounded-xl border-2 border-gray-200 hover:border-navy hover:shadow-xl transition-all p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{calc.icon}</span>
                    <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full">Popular</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-primary transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {calc.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold text-sm">
                    <span>Open Calculator</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Calculators Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Category Filter */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6 text-center">All Financial Calculators</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setActiveCalculator(null)
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedCategory === category.id
                        ? "bg-navy text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-navy"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {filteredCalculators.map((calc) => {
                const CalculatorComponent = calc.component
                const isActive = activeCalculator === calc.id

                return (
                  <div
                    key={calc.id}
                    id={`calc-${calc.id}`}
                    className="scroll-mt-24"
                  >
                    {!isActive ? (
                      <button
                        onClick={() => setActiveCalculator(calc.id)}
                        className="w-full text-left bg-white rounded-xl border-2 border-gray-200 hover:border-navy hover:shadow-xl transition-all p-8 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-5xl">{calc.icon}</span>
                          {calc.popular && (
                            <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-primary transition-colors">
                          {calc.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {calc.description}
                        </p>
                        <div className="flex items-center text-primary font-semibold">
                          <span>Launch Calculator</span>
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </button>
                    ) : (
                      <div className="bg-white rounded-xl shadow-2xl border-2 border-navy">
                        <div className="p-4 bg-gradient-to-r from-navy to-primary rounded-t-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{calc.icon}</span>
                              <h3 className="text-xl font-bold text-white">{calc.name}</h3>
                            </div>
                            <button
                              onClick={() => setActiveCalculator(null)}
                              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                              aria-label="Close calculator"
                            >
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="p-1">
                          <CalculatorComponent />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="text-3xl font-bold text-navy mb-2">10+</div>
                <div className="text-sm text-gray-600">Professional Tools</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
                <div className="text-3xl font-bold text-navy mb-2">100%</div>
                <div className="text-sm text-gray-600">Free to Use</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                <div className="text-3xl font-bold text-navy mb-2">Real-time</div>
                <div className="text-sm text-gray-600">Calculations</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
                <div className="text-3xl font-bold text-navy mb-2">NRI</div>
                <div className="text-sm text-gray-600">Specialized</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy/95 to-primary p-12 text-center">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
              <div className="relative">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Ready to Take the Next Step?
                </h3>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Our certified financial advisors can help you create a personalized strategy based on your unique goals and circumstances.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-gold hover:bg-gold/90 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>Schedule Free Consultation</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="/services"
                    className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border-2 border-white/30"
                  >
                    Explore Our Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
