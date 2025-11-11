"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { formatCurrency, calculateSIP } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)

  const results = calculateSIP(monthlyInvestment, returnRate, years)

  // Generate chart data
  const generateChartData = () => {
    const data = []
    for (let year = 1; year <= years; year++) {
      const yearResults = calculateSIP(monthlyInvestment, returnRate, year)
      data.push({
        year,
        invested: yearResults.totalInvestment,
        returns: yearResults.estimatedReturns,
        total: yearResults.futureValue,
      })
    }
    return data
  }

  const chartData = generateChartData()

  const resetValues = () => {
    setMonthlyInvestment(10000)
    setReturnRate(12)
    setYears(10)
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">SIP Calculator</CardTitle>
        <CardDescription>
          Calculate your Systematic Investment Plan returns and plan your wealth creation journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Monthly Investment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="monthlyInvestment">Monthly Investment</Label>
                <Input
                  id="monthlyInvestment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-32 text-right"
                  min={500}
                  max={500000}
                />
              </div>
              <Slider
                value={[monthlyInvestment]}
                onValueChange={([value]) => setMonthlyInvestment(value)}
                min={500}
                max={500000}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹500</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="returnRate">Expected Annual Return (%)</Label>
                <Input
                  id="returnRate"
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-32 text-right"
                  min={1}
                  max={30}
                  step={0.5}
                />
              </div>
              <Slider
                value={[returnRate]}
                onValueChange={([value]) => setReturnRate(value)}
                min={1}
                max={30}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="years">Investment Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-32 text-right"
                  min={1}
                  max={40}
                />
              </div>
              <Slider
                value={[years]}
                onValueChange={([value]) => setYears(value)}
                min={1}
                max={40}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>40 years</span>
              </div>
            </div>

            <Button onClick={resetValues} variant="outline" className="w-full">
              Reset to Defaults
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-navy">
                  {formatCurrency(results.totalInvestment)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Estimated Returns</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(results.estimatedReturns)}
                </p>
              </div>
              <div className="bg-gold/10 border border-gold rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Future Value</p>
                <p className="text-3xl font-bold text-navy">
                  {formatCurrency(results.futureValue)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Wealth Gain</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {((results.estimatedReturns / results.totalInvestment) * 100).toFixed(2)}%
                </span>
                <span className="text-green-600 font-bold">
                  +{formatCurrency(results.estimatedReturns)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Growth Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                <YAxis
                  label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stackId="1"
                  stroke="#1e3a8a"
                  fill="url(#colorInvested)"
                  name="Invested"
                />
                <Area
                  type="monotone"
                  dataKey="returns"
                  stackId="1"
                  stroke="#22c55e"
                  fill="url(#colorReturns)"
                  name="Returns"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formula & Notes */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-navy mb-2">How It Works</h4>
          <p className="text-sm text-gray-700 mb-3">
            SIP returns are calculated using the compound interest formula:
          </p>
          <code className="block bg-white p-3 rounded border text-sm mb-3">
            FV = P × [(((1 + r)^n - 1) / r) × (1 + r)]
          </code>
          <p className="text-xs text-gray-600">
            Where: FV = Future Value, P = Monthly Investment, r = Monthly Rate of Return, n = Total Number of Months
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SIPCalculator
