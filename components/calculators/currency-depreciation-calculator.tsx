"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const CurrencyDepreciationCalculator = () => {
  const [currency, setCurrency] = useState("USD")
  const [currentRate, setCurrentRate] = useState(83)
  const [depreciationRate, setDepreciationRate] = useState(2)
  const [years, setYears] = useState(10)
  const [amount, setAmount] = useState(10000)

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", defaultRate: 83 },
    { code: "EUR", name: "Euro", symbol: "€", defaultRate: 90 },
    { code: "GBP", name: "British Pound", symbol: "£", defaultRate: 105 },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", defaultRate: 55 },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", defaultRate: 62 },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", defaultRate: 62 },
    { code: "AED", name: "UAE Dirham", symbol: "AED", defaultRate: 22.6 },
  ]

  const selectedCurrency = currencies.find((c) => c.code === currency)

  const calculateDepreciation = () => {
    const data = []
    for (let year = 0; year <= years; year++) {
      const futureRate = currentRate * Math.pow(1 + depreciationRate / 100, year)
      const inrValue = amount * futureRate
      data.push({
        year,
        rate: parseFloat(futureRate.toFixed(2)),
        inrValue: parseFloat(inrValue.toFixed(2)),
      })
    }
    return data
  }

  const projectionData = calculateDepreciation()
  const finalData = projectionData[projectionData.length - 1]
  const initialValue = amount * currentRate
  const finalValue = finalData.inrValue
  const totalChange = finalValue - initialValue
  const percentageChange = ((totalChange / initialValue) * 100).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Currency Depreciation Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Project future value of foreign currency against INR
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Currency Selection */}
            <div>
              <Label>Select Currency</Label>
              <Select value={currency} onValueChange={(value) => {
                setCurrency(value)
                const curr = currencies.find(c => c.code === value)
                if (curr) setCurrentRate(curr.defaultRate)
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency Amount */}
            <div>
              <Label>{selectedCurrency?.name} Amount</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            {/* Current Exchange Rate */}
            <div>
              <Label>Current Rate (INR per {currency})</Label>
              <Input
                type="number"
                value={currentRate}
                onChange={(e) => setCurrentRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>

            {/* Annual Depreciation Rate */}
            <div>
              <Label>Expected Annual INR Depreciation (%)</Label>
              <Input
                type="number"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Positive value = INR weakens, Negative value = INR strengthens
              </p>
            </div>

            {/* Time Period */}
            <div>
              <Label>Time Period (Years)</Label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-1"
                min="1"
                max="30"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Projection Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(initialValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Future Value ({years} yrs):</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(finalValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Change:</span>
                  <span className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalChange >= 0 ? '+' : ''}{formatCurrency(totalChange)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Percentage Change:</span>
                    <span className={`text-2xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalChange >= 0 ? '+' : ''}{percentageChange}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Future Exchange Rate:</span>
                    <span className="text-lg font-bold text-navy">
                      ₹{finalData.rate.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">INR Value Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Years", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "INR Value", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "inrValue") return [formatCurrency(value), "INR Value"]
                    if (name === "rate") return [`₹${value.toFixed(2)}`, "Exchange Rate"]
                    return value
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inrValue"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  name="INR Value"
                  dot={{ fill: "#1e3a8a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This calculator provides projections based on assumed depreciation rates.
            Actual currency movements are influenced by multiple economic factors and can be volatile.
            Historical depreciation rates do not guarantee future performance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrencyDepreciationCalculator
