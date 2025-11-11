"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const LumpsumCalculator = () => {
  const [investment, setInvestment] = useState(100000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)

  const calculateLumpsum = () => {
    const futureValue = investment * Math.pow(1 + returnRate / 100, years)
    const totalReturns = futureValue - investment
    return {
      investment,
      returns: totalReturns,
      futureValue,
    }
  }

  const results = calculateLumpsum()

  const chartData = [
    { name: "Investment", value: results.investment, color: "#1e3a8a" },
    { name: "Returns", value: results.returns, color: "#22c55e" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Lumpsum Investment Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Calculate returns on one-time investment
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Investment Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Investment Amount</Label>
                <Input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[investment]}
                onValueChange={(value) => setInvestment(value[0])}
                min={10000}
                max={10000000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹10K</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Expected Return Rate (p.a.)</Label>
                <Input
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-24 text-right"
                  step="0.1"
                />
              </div>
              <Slider
                value={[returnRate]}
                onValueChange={(value) => setReturnRate(value[0])}
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
              <div className="flex justify-between items-center mb-2">
                <Label>Time Period (Years)</Label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[years]}
                onValueChange={(value) => setYears(value[0])}
                min={1}
                max={40}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>40 Yrs</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Investment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Invested Amount:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.investment)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Returns:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(results.returns)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="text-2xl font-bold text-navy">
                      {formatCurrency(results.futureValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64">
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
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This calculator provides an estimate based on the inputs provided.
            Actual returns may vary based on market conditions. Past performance is not indicative of future results.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default LumpsumCalculator
