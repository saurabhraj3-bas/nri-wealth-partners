"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const HomeLoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [loanTenure, setLoanTenure] = useState(20)

  const calculateEMI = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const months = loanTenure * 12

    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1)

    const totalPayment = emi * months
    const totalInterest = totalPayment - principal

    return {
      emi,
      totalPayment,
      totalInterest,
      principal,
    }
  }

  const results = calculateEMI()

  const chartData = [
    { name: "Principal", value: results.principal, color: "#1e3a8a" },
    { name: "Interest", value: results.totalInterest, color: "#ef4444" },
  ]

  // Generate amortization schedule for chart
  const generateAmortization = () => {
    const data = []
    const monthlyRate = interestRate / 100 / 12
    let remainingPrincipal = loanAmount

    for (let year = 1; year <= loanTenure; year++) {
      let yearlyPrincipal = 0
      let yearlyInterest = 0

      for (let month = 1; month <= 12; month++) {
        const interestPaid = remainingPrincipal * monthlyRate
        const principalPaid = results.emi - interestPaid

        yearlyInterest += interestPaid
        yearlyPrincipal += principalPaid
        remainingPrincipal -= principalPaid
      }

      data.push({
        year,
        principal: parseFloat(yearlyPrincipal.toFixed(0)),
        interest: parseFloat(yearlyInterest.toFixed(0)),
        remainingBalance: parseFloat(Math.max(0, remainingPrincipal).toFixed(0)),
      })
    }

    return data
  }

  const amortizationData = generateAmortization()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Home Loan EMI Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Calculate your monthly EMI and total interest for home loans
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Loan Amount</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                min={500000}
                max={50000000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹5L</span>
                <span>₹5Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Interest Rate (p.a.)</Label>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-24 text-right"
                  step="0.1"
                />
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={6}
                max={15}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Loan Tenure (Years)</Label>
                <Input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[loanTenure]}
                onValueChange={(value) => setLoanTenure(value[0])}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">EMI Summary</h3>
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="text-3xl font-bold text-navy">
                      {formatCurrency(results.emi)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.principal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount Payable:</span>
                    <span className="text-2xl font-bold text-navy">
                      {formatCurrency(results.totalPayment)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Interest Burden</p>
                <p className="text-lg font-bold text-blue-600">
                  {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Total Months</p>
                <p className="text-lg font-bold text-green-600">
                  {loanTenure * 12} months
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Payment Breakdown Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={amortizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Year", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="principal"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  name="Principal Paid"
                />
                <Line
                  type="monotone"
                  dataKey="interest"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Interest Paid"
                />
                <Line
                  type="monotone"
                  dataKey="remainingBalance"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Remaining Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This calculator provides estimates for informational purposes only.
            Actual EMI may vary based on processing fees, GST, insurance, and other charges.
            Please consult with your lender for exact figures and terms.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default HomeLoanCalculator
