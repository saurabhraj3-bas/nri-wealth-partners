"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)
  const [inflationRate, setInflationRate] = useState(6)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [lifeExpectancy, setLifeExpectancy] = useState(85)

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge
    const yearsInRetirement = lifeExpectancy - retirementAge

    // Calculate future monthly expenses at retirement
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)

    // Calculate required corpus (assuming 4% safe withdrawal rate adjusted for inflation)
    const annualExpensesAtRetirement = futureMonthlyExpenses * 12
    const requiredCorpus = annualExpensesAtRetirement * yearsInRetirement * Math.pow(1 + inflationRate / 100, yearsInRetirement / 2)

    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement)

    // Calculate additional corpus needed
    const additionalCorpusNeeded = Math.max(0, requiredCorpus - futureValueCurrentSavings)

    // Calculate monthly SIP required
    const monthlyRate = expectedReturn / 100 / 12
    const months = yearsToRetirement * 12
    const monthlySIP = additionalCorpusNeeded > 0
      ? (additionalCorpusNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
      : 0

    // Calculate lumpsum required
    const lumpsumRequired = additionalCorpusNeeded / Math.pow(1 + expectedReturn / 100, yearsToRetirement)

    return {
      yearsToRetirement,
      yearsInRetirement,
      futureMonthlyExpenses,
      requiredCorpus,
      futureValueCurrentSavings,
      additionalCorpusNeeded,
      monthlySIP,
      lumpsumRequired,
    }
  }

  const results = calculateRetirement()

  // Generate chart data for corpus growth
  const generateCorpusData = () => {
    const data = []
    const yearsToRetirement = retirementAge - currentAge

    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year
      const currentSavingsGrowth = currentSavings * Math.pow(1 + expectedReturn / 100, year)
      const monthlyRate = expectedReturn / 100 / 12
      const months = year * 12
      const sipGrowth = results.monthlySIP > 0
        ? results.monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
        : 0

      data.push({
        age,
        year,
        totalCorpus: currentSavingsGrowth + sipGrowth,
      })
    }
    return data
  }

  const corpusData = generateCorpusData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Retirement Planning Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Plan your retirement corpus and investment strategy
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Current Age */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Age</Label>
                <Input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[currentAge]}
                onValueChange={(value) => setCurrentAge(value[0])}
                min={18}
                max={60}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18</span>
                <span>60</span>
              </div>
            </div>

            {/* Retirement Age */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Retirement Age</Label>
                <Input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[retirementAge]}
                onValueChange={(value) => setRetirementAge(value[0])}
                min={45}
                max={75}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>45</span>
                <span>75</span>
              </div>
            </div>

            {/* Life Expectancy */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Life Expectancy</Label>
                <Input
                  type="number"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[lifeExpectancy]}
                onValueChange={(value) => setLifeExpectancy(value[0])}
                min={65}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>65</span>
                <span>100</span>
              </div>
            </div>

            {/* Current Monthly Expenses */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Monthly Expenses</Label>
                <Input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[monthlyExpenses]}
                onValueChange={(value) => setMonthlyExpenses(value[0])}
                min={10000}
                max={500000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹10K</span>
                <span>₹5L</span>
              </div>
            </div>

            {/* Current Savings */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Retirement Savings</Label>
                <Input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[currentSavings]}
                onValueChange={(value) => setCurrentSavings(value[0])}
                min={0}
                max={10000000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Inflation Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Expected Inflation Rate (%)</Label>
                <Input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-24 text-right"
                  step="0.1"
                />
              </div>
              <Slider
                value={[inflationRate]}
                onValueChange={(value) => setInflationRate(value[0])}
                min={3}
                max={12}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3%</span>
                <span>12%</span>
              </div>
            </div>

            {/* Expected Return */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Expected Return Rate (%)</Label>
                <Input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-24 text-right"
                  step="0.1"
                />
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={(value) => setExpectedReturn(value[0])}
                min={6}
                max={18}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span>18%</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Retirement Plan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years to Retirement:</span>
                  <span className="text-lg font-bold text-navy">
                    {results.yearsToRetirement} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Expenses at {retirementAge}:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.futureMonthlyExpenses)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Required Corpus:</span>
                    <span className="text-xl font-bold text-navy">
                      {formatCurrency(results.requiredCorpus)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Savings Growth:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(results.futureValueCurrentSavings)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Additional Needed:</span>
                    <span className="text-lg font-bold text-orange-600">
                      {formatCurrency(results.additionalCorpusNeeded)}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-3 mt-3 bg-blue-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                  <p className="text-sm font-semibold text-navy mb-3">To bridge the gap:</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Monthly SIP Required:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(results.monthlySIP)}/mo
                    </span>
                  </div>
                  <div className="text-center text-sm text-gray-600 my-2">OR</div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Lumpsum Required Today:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(results.lumpsumRequired)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Corpus Growth Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={corpusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age (Years)", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "Corpus Value (₹)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(age) => `Age: ${age}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalCorpus"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  name="Total Corpus"
                  dot={{ fill: "#1e3a8a" }}
                />
                {/* Add reference line for required corpus */}
                <Line
                  type="monotone"
                  dataKey={() => results.requiredCorpus}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Required Corpus"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This calculator provides estimates based on assumed inflation and return rates.
            Actual retirement needs may vary based on lifestyle, healthcare costs, and market conditions.
            Consider consulting a financial advisor for personalized retirement planning.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RetirementCalculator
