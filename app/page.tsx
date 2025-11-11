import type { Metadata } from "next"
import HeroSection from "@/components/sections/hero-section"
import TrustMetrics from "@/components/sections/trust-metrics"
import ServicesOverview from "@/components/sections/services-overview"
import WhyChooseUs from "@/components/sections/why-choose-us"
import TeamPreview from "@/components/sections/team-preview"
import Testimonials from "@/components/sections/testimonials"
import FinalCTA from "@/components/sections/final-cta"

export const metadata: Metadata = {
  title: "NRI Wealth Partners | Expert Wealth Management for Non-Resident Indians",
  description: "Trusted financial guidance across borders since 2007. SEBI-registered wealth management, investment advisory, and tax planning services for NRIs. 18+ years of expertise.",
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustMetrics />
      <ServicesOverview />
      <WhyChooseUs />
      <TeamPreview />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
