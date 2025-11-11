"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const GoalPlannerCalculator = () => {
  const [goalType, setGoalType] = useState("custom")
  const [goalName, setGoalName] = useState("Dream Home")
  const [currentCost, setCurrentCost] = useState(5000000)
  const [inflationRate, setInflationRate] = useState(6)
  const [timeToGoal, setTimeToGoal] = useState(5)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [expectedReturn, setExpectedReturn] = useState(12)

  const goalPresets = {
    home: { name: "Dream Home", cost: 5000000, inflation: 6, years: 5 },
    car: { name: "New Car", cost: 1500000, inflation: 5, years: 3 },
    wedding: { name: "Wedding", cost: 2000000, inflation: 7, years: 4 },
    vacation: { name: "World Tour", cost: 500000, inflation: 5, years: 2 },
    business: { name: "Start Business", cost: 3000000, inflation: 6, years: 5 },
    custom: { name: "Custom Goal", cost: 5000000, inflation: 6, years: 5 },
  }

  const handleGoalChange = (value: string) => {
    setGoalType(value)
    const preset = goalPresets[value as keyof typeof goalPresets]
    setGoalName(preset.name)
    setCurrentCost(preset.cost)
    setInflationRate(preset.inflation)
    setTimeToGoal(preset.years)
  }

  const calculateGoal = () => {
    // Calculate future cost with inflation
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, timeToGoal)

    // Calculate future value of current savings
    const futureValueSavings = currentSavings * Math.pow(1 + expectedReturn / 100, timeToGoal)

    // Calculate additional amount needed
    const additionalNeeded = Math.max(0, futureCost - futureValueSavings)

    // Calculate monthly SIP required
    const monthlyRate = expectedReturn / 100 / 12
    const months = timeToGoal * 12
    const monthlySIP = additionalNeeded > 0
      ? (additionalNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
      : 0

    // Calculate lumpsum required today
    const lumpsumRequired = additionalNeeded / Math.pow(1 + expectedReturn / 100, timeToGoal)

    // Total investment via SIP
    const totalSIPInvestment = monthlySIP * months

    return {
      currentCost,
      futureCost,
      futureValueSavings,
      additionalNeeded,
      monthlySIP,
      lumpsumRequired,
      totalSIPInvestment,
    }
  }

  const results = calculateGoal()

  const pieData = [
    { name: "Current Savings (Future Value)", value: results.futureValueSavings, color: "#22c55e" },
    { name: "Additional SIP Investment", value: results.totalSIPInvestment, color: "#3b82f6" },
  ]

  const barData = [
    {
      name: "Today",
      currentCost: results.currentCost,
      currentSavings,
    },
    {
      name: `After ${timeToGoal} Years`,
      futureCost: results.futureCost,
      totalSavings: results.futureValueSavings + results.totalSIPInvestment,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Financial Goal Planner</CardTitle>
        <p className="text-sm text-gray-600">
          Plan and achieve your financial goals systematically
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Goal Type */}
            <div>
              <Label>Select Goal Type</Label>
              <Select value={goalType} onValueChange={handleGoalChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">🏠 Dream Home</SelectItem>
                  <SelectItem value="car">🚗 New Car</SelectItem>
                  <SelectItem value="wedding">💍 Wedding</SelectItem>
                  <SelectItem value="vacation">✈️ World Tour</SelectItem>
                  <SelectItem value="business">💼 Start Business</SelectItem>
                  <SelectItem value="custom">🎯 Custom Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Goal Name */}
            <div>
              <Label>Goal Name</Label>
              <Input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Current Cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Cost of Goal</Label>
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
                min={100000}
                max={50000000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹1L</span>
                <span>₹5Cr</span>
              </div>
            </div>

            {/* Time to Goal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Time to Achieve Goal (Years)</Label>
                <Input
                  type="number"
                  value={timeToGoal}
                  onChange={(e) => setTimeToGoal(Number(e.target.value))}
                  className="w-24 text-right"
                />
              </div>
              <Slider
                value={[timeToGoal]}
                onValueChange={(value) => setTimeToGoal(value[0])}
                min={1}
                max={30}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>30 Yrs</span>
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

            {/* Current Savings */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Current Savings for This Goal</Label>
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
              <h3 className="text-lg font-semibold text-navy mb-4">Goal: {goalName}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Cost:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.currentCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Future Cost (in {timeToGoal}y):</span>
                  <span className="text-lg font-bold text-orange-600">
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
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Additional Needed:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatCurrency(results.additionalNeeded)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-navy mb-3">Investment Strategy</h4>
              <p className="text-sm text-gray-600 mb-4">Choose one of these options to bridge the gap:</p>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">Option 1: Monthly SIP</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {formatCurrency(results.monthlySIP)}/mo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Total investment: {formatCurrency(results.totalSIPInvestment)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Recommended
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">Option 2: Lumpsum Today</p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        {formatCurrency(results.lumpsumRequired)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">One-time investment</p>
                    </div>
                  </div>
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

        {/* Bar Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Goal Progress Visualization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="currentCost" fill="#f59e0b" name="Cost of Goal" />
                <Bar dataKey="currentSavings" fill="#22c55e" name="Your Savings" />
                <Bar dataKey="futureCost" fill="#f59e0b" name="Future Cost" />
                <Bar dataKey="totalSavings" fill="#22c55e" name="Total Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-green-700">
              Start early! The power of compounding works best with time. Even small monthly investments can grow significantly.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Diversify</h4>
            <p className="text-sm text-blue-700">
              Consider a mix of equity and debt instruments based on your time horizon and risk appetite.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">🔄 Review Regularly</h4>
            <p className="text-sm text-purple-700">
              Review your goal progress quarterly and adjust investments if needed to stay on track.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Note:</strong> This calculator helps you plan for specific financial goals by accounting for inflation
            and investment returns. Actual results may vary based on market conditions and investment choices.
            Consider consulting a financial advisor for personalized goal planning.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default GoalPlannerCalculator
