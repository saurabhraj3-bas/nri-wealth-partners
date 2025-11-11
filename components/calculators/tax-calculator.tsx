"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TaxCalculator = () => {
  const [income, setIncome] = useState(1500000)
  const [age, setAge] = useState("below60")
  const [deductions80C, setDeductions80C] = useState(150000)
  const [deductions80D, setDeductions80D] = useState(25000)
  const [homeLoanInterest, setHomeLoanInterest] = useState(0)
  const [otherDeductions, setOtherDeductions] = useState(0)

  // Old Tax Regime Calculation
  const calculateOldRegime = () => {
    let taxableIncome = income
    const totalDeductions = Math.min(deductions80C, 150000) +
                           Math.min(deductions80D, age === "senior" ? 50000 : 25000) +
                           Math.min(homeLoanInterest, 200000) +
                           otherDeductions

    taxableIncome = Math.max(0, taxableIncome - totalDeductions - 50000) // 50k standard deduction

    let tax = 0

    if (age === "below60") {
      // Below 60 years
      if (taxableIncome <= 250000) tax = 0
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20
      else tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30
    } else if (age === "senior") {
      // 60-80 years
      if (taxableIncome <= 300000) tax = 0
      else if (taxableIncome <= 500000) tax = (taxableIncome - 300000) * 0.05
      else if (taxableIncome <= 1000000) tax = 10000 + (taxableIncome - 500000) * 0.20
      else tax = 10000 + 100000 + (taxableIncome - 1000000) * 0.30
    } else {
      // Super senior (80+)
      if (taxableIncome <= 500000) tax = 0
      else if (taxableIncome <= 1000000) tax = (taxableIncome - 500000) * 0.20
      else tax = 100000 + (taxableIncome - 1000000) * 0.30
    }

    // Add 4% Health & Education Cess
    const cess = tax * 0.04
    const totalTax = tax + cess

    return {
      grossIncome: income,
      deductions: totalDeductions,
      taxableIncome,
      tax,
      cess,
      totalTax,
      netIncome: income - totalTax,
    }
  }

  // New Tax Regime Calculation (FY 2024-25)
  const calculateNewRegime = () => {
    const taxableIncome = Math.max(0, income - 75000) // 75k standard deduction in new regime

    let tax = 0

    // New tax slabs for FY 2024-25
    if (taxableIncome <= 300000) tax = 0
    else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05
    else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.10
    else if (taxableIncome <= 1200000) tax = 20000 + 30000 + (taxableIncome - 1000000) * 0.15
    else if (taxableIncome <= 1500000) tax = 20000 + 30000 + 30000 + (taxableIncome - 1200000) * 0.20
    else tax = 20000 + 30000 + 30000 + 60000 + (taxableIncome - 1500000) * 0.30

    // Add 4% Health & Education Cess
    const cess = tax * 0.04
    const totalTax = tax + cess

    return {
      grossIncome: income,
      deductions: 75000,
      taxableIncome,
      tax,
      cess,
      totalTax,
      netIncome: income - totalTax,
    }
  }

  const oldRegime = calculateOldRegime()
  const newRegime = calculateNewRegime()

  const comparison = [
    {
      regime: "Old Regime",
      tax: oldRegime.totalTax,
      netIncome: oldRegime.netIncome,
      color: "#1e3a8a",
    },
    {
      regime: "New Regime",
      tax: newRegime.totalTax,
      netIncome: newRegime.netIncome,
      color: "#22c55e",
    },
  ]

  const recommendedRegime = oldRegime.totalTax < newRegime.totalTax ? "Old Regime" : "New Regime"
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Income Tax Calculator (FY 2024-25)</CardTitle>
        <p className="text-sm text-gray-600">
          Compare old vs new tax regime and optimize your tax liability
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Annual Income */}
            <div>
              <Label>Annual Gross Income</Label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            {/* Age Group */}
            <div>
              <Label>Age Group</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below60">Below 60 years</SelectItem>
                  <SelectItem value="senior">60-80 years (Senior Citizen)</SelectItem>
                  <SelectItem value="supersenior">Above 80 years (Super Senior)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-navy mb-3">Deductions (Old Regime Only)</h4>

              {/* 80C Deductions */}
              <div className="mb-4">
                <Label>Section 80C (PPF, ELSS, etc.)</Label>
                <Input
                  type="number"
                  value={deductions80C}
                  onChange={(e) => setDeductions80C(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: ₹1,50,000</p>
              </div>

              {/* 80D Deductions */}
              <div className="mb-4">
                <Label>Section 80D (Health Insurance)</Label>
                <Input
                  type="number"
                  value={deductions80D}
                  onChange={(e) => setDeductions80D(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: ₹{age === "senior" ? "50,000" : "25,000"}
                </p>
              </div>

              {/* Home Loan Interest */}
              <div className="mb-4">
                <Label>Home Loan Interest (24b)</Label>
                <Input
                  type="number"
                  value={homeLoanInterest}
                  onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: ₹2,00,000</p>
              </div>

              {/* Other Deductions */}
              <div>
                <Label>Other Deductions (80G, 80E, etc.)</Label>
                <Input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Recommendation */}
            <div className={`rounded-lg p-6 ${recommendedRegime === "Old Regime" ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"}`}>
              <h3 className="text-lg font-semibold mb-2">Recommended: {recommendedRegime}</h3>
              <p className="text-2xl font-bold mb-1">
                Save {formatCurrency(savings)}
              </p>
              <p className="text-sm text-gray-600">by choosing {recommendedRegime}</p>
            </div>

            {/* Comparison Tabs */}
            <Tabs defaultValue="old" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="old">Old Regime</TabsTrigger>
                <TabsTrigger value="new">New Regime</TabsTrigger>
              </TabsList>

              <TabsContent value="old" className="space-y-3 mt-4">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gross Income:</span>
                      <span className="font-semibold">{formatCurrency(oldRegime.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Deductions:</span>
                      <span className="font-semibold text-green-600">-{formatCurrency(oldRegime.deductions)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-gray-600">Taxable Income:</span>
                      <span className="font-semibold">{formatCurrency(oldRegime.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Income Tax:</span>
                      <span className="font-semibold">{formatCurrency(oldRegime.tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cess (4%):</span>
                      <span className="font-semibold">{formatCurrency(oldRegime.cess)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Tax:</span>
                      <span className="text-xl font-bold text-red-600">{formatCurrency(oldRegime.totalTax)}</span>
                    </div>
                    <div className="flex justify-between bg-blue-50 -mx-4 -mb-4 p-4 mt-2 rounded-b-lg">
                      <span className="font-semibold">Net Income:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(oldRegime.netIncome)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-3 mt-4">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gross Income:</span>
                      <span className="font-semibold">{formatCurrency(newRegime.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Standard Deduction:</span>
                      <span className="font-semibold text-green-600">-{formatCurrency(newRegime.deductions)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-gray-600">Taxable Income:</span>
                      <span className="font-semibold">{formatCurrency(newRegime.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Income Tax:</span>
                      <span className="font-semibold">{formatCurrency(newRegime.tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cess (4%):</span>
                      <span className="font-semibold">{formatCurrency(newRegime.cess)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Tax:</span>
                      <span className="text-xl font-bold text-red-600">{formatCurrency(newRegime.totalTax)}</span>
                    </div>
                    <div className="flex justify-between bg-green-50 -mx-4 -mb-4 p-4 mt-2 rounded-b-lg">
                      <span className="font-semibold">Net Income:</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(newRegime.netIncome)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Tax Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regime" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="tax" fill="#ef4444" name="Total Tax" />
                <Bar dataKey="netIncome" fill="#22c55e" name="Net Income" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Important Notes:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>New tax regime has lower tax rates but doesn't allow most deductions</li>
            <li>Old regime allows deductions under 80C, 80D, 24b, etc. but has higher tax rates</li>
            <li>Once you choose new regime, you can switch back to old regime only once</li>
            <li>This calculator is for estimation purposes only. Consult a tax advisor for accurate filing</li>
            <li>For NRIs: Tax rates are same, but TDS rates differ. DTAA benefits may apply.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaxCalculator
