"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const PPFCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000)
  const [interestRate, setInterestRate] = useState(7.1)
  const [tenure, setTenure] = useState(15)

  const calculatePPF = () => {
    let totalInvestment = 0
    let maturityAmount = 0

    // PPF interest is compounded annually
    for (let year = 1; year <= tenure; year++) {
      maturityAmount = (maturityAmount + yearlyInvestment) * (1 + interestRate / 100)
      totalInvestment += yearlyInvestment
    }

    const totalInterest = maturityAmount - totalInvestment

    return {
      totalInvestment,
      totalInterest,
      maturityAmount,
    }
  }

  const results = calculatePPF()

  const chartData = [
    { name: "Investment", value: results.totalInvestment, color: "#1e3a8a" },
    { name: "Interest Earned", value: results.totalInterest, color: "#22c55e" },
  ]

  // Generate year-wise breakdown
  const generateYearlyBreakdown = () => {
    const data = []
    let balance = 0
    let totalInvested = 0

    for (let year = 1; year <= tenure; year++) {
      balance = (balance + yearlyInvestment) * (1 + interestRate / 100)
      totalInvested += yearlyInvestment

      data.push({
        year,
        investment: totalInvested,
        balance: parseFloat(balance.toFixed(2)),
        interest: parseFloat((balance - totalInvested).toFixed(2)),
      })
    }

    return data
  }

  const yearlyData = generateYearlyBreakdown()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">PPF Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Calculate returns on Public Provident Fund investments
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Yearly Investment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Yearly Investment</Label>
                <Input
                  type="number"
                  value={yearlyInvestment}
                  onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[yearlyInvestment]}
                onValueChange={(value) => setYearlyInvestment(value[0])}
                min={500}
                max={150000}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹500</span>
                <span>₹1.5L (Max)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: ₹500/year | Maximum: ₹1,50,000/year
              </p>
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
                max={9}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span>9%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current PPF rate: 7.1% (Q3 FY 2024-25)
              </p>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Time Period (Years)</Label>
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[tenure]}
                onValueChange={(value) => setTenure(value[0])}
                min={15}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 Yrs (Min)</span>
                <span>50 Yrs</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PPF has a lock-in period of 15 years (extendable in blocks of 5 years)
              </p>
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
              <h3 className="text-lg font-semibold text-navy mb-4">PPF Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Investment:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.totalInvestment)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interest Earned:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maturity Value:</span>
                    <span className="text-2xl font-bold text-navy">
                      {formatCurrency(results.maturityAmount)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Return on Investment:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {((results.totalInterest / results.totalInvestment) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Benefits Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Tax Benefits</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Investment qualifies for deduction u/s 80C (up to ₹1.5L)</li>
                <li>• Interest earned is tax-free</li>
                <li>• Maturity amount is tax-free (EEE status)</li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Monthly Investment</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(yearlyInvestment / 12)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Interest/Investment</p>
                <p className="text-lg font-bold text-purple-600">
                  {((results.totalInterest / results.totalInvestment) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Growth Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Year", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stackId="1"
                  stroke="#1e3a8a"
                  fill="#1e3a8a"
                  name="Total Investment"
                />
                <Area
                  type="monotone"
                  dataKey="interest"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  name="Interest Earned"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Important Notes:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>PPF account has a lock-in period of 15 years from the end of the financial year in which it was opened</li>
            <li>Partial withdrawals are allowed from the 7th year onwards</li>
            <li>Interest rates are set by the Government of India quarterly</li>
            <li>NRIs cannot open new PPF accounts but can continue existing ones until maturity</li>
            <li>This calculator assumes deposits are made at the beginning of each year for maximum interest benefit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default PPFCalculator
