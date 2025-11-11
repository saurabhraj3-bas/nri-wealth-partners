import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function calculateSIP(
  monthlyInvestment: number,
  annualReturn: number,
  years: number
): { totalInvestment: number; estimatedReturns: number; futureValue: number } {
  const months = years * 12
  const monthlyRate = annualReturn / 12 / 100

  let futureValue = 0
  if (monthlyRate === 0) {
    futureValue = monthlyInvestment * months
  } else {
    futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  }

  const totalInvestment = monthlyInvestment * months
  const estimatedReturns = futureValue - totalInvestment

  return {
    totalInvestment,
    estimatedReturns,
    futureValue,
  }
}

export function calculateLumpsum(
  principal: number,
  annualReturn: number,
  years: number
): { futureValue: number; returns: number } {
  const futureValue = principal * Math.pow(1 + annualReturn / 100, years)
  const returns = futureValue - principal

  return {
    futureValue,
    returns,
  }
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  frequency: number = 4
): { maturityAmount: number; interest: number } {
  const maturityAmount = principal * Math.pow(1 + rate / (frequency * 100), frequency * time)
  const interest = maturityAmount - principal

  return {
    maturityAmount,
    interest,
  }
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  years: number
): { emi: number; totalInterest: number; totalAmount: number } {
  const monthlyRate = annualRate / 12 / 100
  const months = years * 12

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  const totalAmount = emi * months
  const totalInterest = totalAmount - principal

  return {
    emi,
    totalInterest,
    totalAmount,
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
