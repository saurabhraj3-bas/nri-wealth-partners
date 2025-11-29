"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

interface MetricProps {
  value: string
  label: string
  index: number
}

const Metric = ({ value, label, index }: MetricProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ""))
      if (isNaN(numericValue)) return

      const duration = 2000
      const steps = 60
      const stepValue = numericValue / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += stepValue
        if (current >= numericValue) {
          setCount(numericValue)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  const displayValue = value.includes("+")
    ? `${count}+`
    : value.includes("₹")
    ? `₹${count}+`
    : count.toString()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6"
    >
      <div className="text-4xl md:text-5xl font-bold text-navy mb-2">
        {isInView ? displayValue : "0"}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  )
}

const TrustMetrics = () => {
  const metrics = [
    { value: "18+", label: "Years Investment Advisory Experience" },
    { value: "500+", label: "Individual Clients Served" },
    { value: "₹500+", label: "Crores Assets Under Advisory" },
    { value: "90+", label: "Corporate Clients" },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <Metric key={index} {...metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustMetrics
