"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const EducationCalculator = () => {
  const [educationType, setEducationType] = useState("engineering")
  const [educationLocation, setEducationLocation] = useState("india")
  const [childAge, setChildAge] = useState(5)
  const [educationAge, setEducationAge] = useState(18)
  const [currentCost, setCurrentCost] = useState(2000000)
  const [inflationRate, setInflationRate] = useState(8)
  const [currentSavings, setCurrentSavings] = useState(200000)
  const [expectedReturn, setExpectedReturn] = useState(12)

  const educationPresets = {
    engineering: {
      india: { cost: 2000000, inflation: 8 },
      abroad: { cost: 8000000, inflation: 7 },
    },
    medical: {
      india: { cost: 5000000, inflation: 10 },
      abroad: { cost: 15000000, inflation: 7 },
    },
    mba: {
      india: { cost: 3000000, inflation: 9 },
      abroad: { cost: 12000000, inflation: 7 },
    },
    undergraduate: {
      india: { cost: 1500000, inflation: 8 },
      abroad: { cost: 6000000, inflation: 7 },
    },
  }

  const handleEducationChange = (type: string, location: string) => {
    const typePreset = educationPresets[type as keyof typeof educationPresets]
    const preset = typePreset?.[location as keyof typeof typePreset]
    if (preset) {
      setCurrentCost(preset.cost)
      setInflationRate(preset.inflation)
    }
  }

  const calculateEducation = () => {
    const yearsToEducation = educationAge - childAge
    const courseDuration = educationType === "medical" ? 5 : educationType === "engineering" ? 4 : 2

    // Calculate future cost of education
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToEducation)

    // Calculate future value of current savings
    const futureValueSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToEducation)

    // Calculate additional amount needed
    const additionalNeeded = Math.max(0, futureCost - futureValueSavings)

    // Calculate monthly SIP required
    const monthlyRate = expectedReturn / 100 / 12
    const months = yearsToEducation * 12
    const monthlySIP = additionalNeeded > 0 && months > 0
      ? (additionalNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
      : 0

    // Calculate lumpsum required today
    const lumpsumRequired = additionalNeeded > 0
      ? additionalNeeded / Math.pow(1 + expectedReturn / 100, yearsToEducation)
      : 0

    // Total investment via SIP
    const totalSIPInvestment = monthlySIP * months

    // Calculate year-wise cost breakdown during education
    const yearWiseCosts = []
    for (let year = 0; year < courseDuration; year++) {
      const yearsFromNow = yearsToEducation + year
      const yearCost = currentCost * Math.pow(1 + inflationRate / 100, yearsFromNow) / courseDuration
      yearWiseCosts.push({
        year: year + 1,
        cost: yearCost,
      })
    }

    return {
      yearsToEducation,
      courseDuration,
      currentCost,
      futureCost,
      futureValueSavings,
      additionalNeeded,
      monthlySIP,
      lumpsumRequired,
      totalSIPInvestment,
      yearWiseCosts,
    }
  }

  const results = calculateEducation()

  const pieData = [
    { name: "Current Savings (Future Value)", value: results.futureValueSavings, color: "#22c55e" },
    { name: "Additional Investment Needed", value: results.totalSIPInvestment, color: "#3b82f6" },
  ]

  // Generate savings accumulation data
  const generateAccumulationData = () => {
    const data = []
    const monthlyRate = expectedReturn / 100 / 12

    for (let year = 0; year <= results.yearsToEducation; year++) {
      const months = year * 12
      const savingsGrowth = currentSavings * Math.pow(1 + expectedReturn / 100, year)
      const sipGrowth = results.monthlySIP > 0
        ? results.monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
        : 0

      const targetForYear = currentCost * Math.pow(1 + inflationRate / 100, year)

      data.push({
        year,
        age: childAge + year,
        totalSavings: parseFloat((savingsGrowth + sipGrowth).toFixed(0)),
        targetCost: parseFloat(targetForYear.toFixed(0)),
      })
    }

    return data
  }

  const accumulationData = generateAccumulationData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Education Cost Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Plan for your child's higher education expenses in India or abroad
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Education Type */}
            <div>
              <Label>Education Type</Label>
              <Select
                value={educationType}
                onValueChange={(value) => {
                  setEducationType(value)
                  handleEducationChange(value, educationLocation)
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">🎓 Undergraduate (3 years)</SelectItem>
                  <SelectItem value="engineering">👨‍💻 Engineering (4 years)</SelectItem>
                  <SelectItem value="medical">⚕️ Medical (5 years)</SelectItem>
                  <SelectItem value="mba">💼 MBA/Masters (2 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Education Location */}
            <div>
              <Label>Study Location</Label>
              <Select
                value={educationLocation}
                onValueChange={(value) => {
                  setEducationLocation(value)
                  handleEducationChange(educationType, value)
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">🇮🇳 India (Top Institutions)</SelectItem>
                  <SelectItem value="abroad">🌍 Abroad (US/UK/Canada/Australia)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Child's Current Age */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Child's Current Age</Label>
                <Input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[childAge]}
                onValueChange={(value) => setChildAge(value[0])}
                min={0}
                max={18}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>18</span>
              </div>
            </div>

            {/* Age at Start of Education */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Age at Start of Education</Label>
                <Input
                  type="number"
                  value={educationAge}
                  onChange={(e) => setEducationAge(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[educationAge]}
                onValueChange={(value) => setEducationAge(value[0])}
                min={15}
                max={25}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15</span>
                <span>25</span>
              </div>
            </div>

            {/* Current Cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Total Cost of Education</Label>
                <Input
                  type="number"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[currentCost]}
                onValueChange={(value) => setCurrentCost(value[0])}
                min={500000}
                max={20000000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹5L</span>
                <span>₹2Cr</span>
              </div>
            </div>

            {/* Education Inflation Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Education Inflation Rate (%)</Label>
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
                min={5}
                max={15}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>15%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Education inflation in India: 8-12% | Abroad: 5-7%
              </p>
            </div>

            {/* Current Savings */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Education Savings</Label>
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
                max={5000000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹50L</span>
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
                max={15}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Education Plan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years to Education:</span>
                  <span className="text-lg font-bold text-navy">
                    {results.yearsToEducation} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Course Duration:</span>
                  <span className="text-lg font-bold text-navy">
                    {results.courseDuration} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Cost:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.currentCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Future Cost:</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatCurrency(results.futureCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Savings Growth:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(results.futureValueSavings)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Additional Needed:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatCurrency(results.additionalNeeded)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-navy mb-3">Investment Required</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-xs text-gray-600 mb-1">Monthly SIP Required</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(results.monthlySIP)}/mo
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Total SIP investment: {formatCurrency(results.totalSIPInvestment)}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600">OR</div>

                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-xs text-gray-600 mb-1">Lumpsum Investment Today</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(results.lumpsumRequired)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">One-time investment</p>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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

        {/* Savings Accumulation Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Savings Accumulation vs Education Cost</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accumulationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Child's Age", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(age) => `Age: ${age}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="totalSavings"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="Your Total Savings"
                />
                <Area
                  type="monotone"
                  dataKey="targetCost"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="Education Cost Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Year-wise Cost Breakdown */}
        {results.yearWiseCosts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-navy mb-4">
              Expected Year-wise Cost During Education (Starting at age {educationAge})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.yearWiseCosts.map((yearData) => (
                <div key={yearData.year} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border">
                  <p className="text-xs text-gray-600 mb-1">Year {yearData.year}</p>
                  <p className="text-lg font-bold text-navy">
                    {formatCurrency(yearData.cost)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips for Education Planning */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-navy mb-4">Education Planning Tips for NRIs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">📚 For India Education:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Consider PPF for tax-free accumulation</li>
                <li>• Sukanya Samriddhi Yojana for girl child</li>
                <li>• Child education plans from insurers</li>
                <li>• Mutual funds via SIP for long-term goals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">🌍 For Abroad Education:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Start early - costs are 3-4x higher</li>
                <li>• Consider international funds or ETFs</li>
                <li>• Education loans can cover 80-90% costs</li>
                <li>• Factor in living expenses (₹15-20L/year)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Education costs have been rising at 8-12% annually in India and 5-7% abroad.
            This calculator provides estimates based on current trends. Actual costs may vary based on institution,
            course, location, and other factors. Consider consulting an education planner for detailed advice.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default EducationCalculator
