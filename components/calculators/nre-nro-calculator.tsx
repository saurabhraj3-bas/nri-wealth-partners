"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const NRECalculator = () => {
  const [accountType, setAccountType] = useState<"nre" | "nro">("nre")
  const [depositType, setDepositType] = useState<"savings" | "fd">("fd")
  const [principal, setPrincipal] = useState(1000000)
  const [interestRate, setInterestRate] = useState(7.0)
  const [tenure, setTenure] = useState(5)
  const [compoundingFrequency, setCompoundingFrequency] = useState<"monthly" | "quarterly" | "yearly">("quarterly")

  const calculateReturns = () => {
    let maturityAmount = 0
    let tds = 0

    if (depositType === "savings") {
      // Simple interest for savings account
      const interest = (principal * interestRate * tenure) / 100
      maturityAmount = principal + interest

      // TDS applicable only for NRO
      if (accountType === "nro") {
        tds = interest * 0.30 // 30% TDS on NRO interest
      }
    } else {
      // Compound interest for FD
      const frequencyMap = {
        monthly: 12,
        quarterly: 4,
        yearly: 1,
      }
      const n = frequencyMap[compoundingFrequency]
      maturityAmount = principal * Math.pow(1 + interestRate / (100 * n), n * tenure)

      const interest = maturityAmount - principal

      // TDS applicable only for NRO
      if (accountType === "nro") {
        tds = interest * 0.30 // 30% TDS on NRO interest (can be reduced via 15CA/15CB)
      }
    }

    const totalInterest = maturityAmount - principal
    const netMaturityAmount = maturityAmount - tds

    return {
      principal,
      maturityAmount,
      totalInterest,
      tds,
      netMaturityAmount,
    }
  }

  const results = calculateReturns()

  // Generate year-wise breakdown
  const generateYearlyBreakdown = () => {
    const data = []
    const frequencyMap = { monthly: 12, quarterly: 4, yearly: 1 }
    const n = depositType === "fd" ? frequencyMap[compoundingFrequency] : 1

    for (let year = 1; year <= tenure; year++) {
      let amount: number
      if (depositType === "savings") {
        amount = principal + (principal * interestRate * year) / 100
      } else {
        amount = principal * Math.pow(1 + interestRate / (100 * n), n * year)
      }

      const interest = amount - principal
      const yearlyTDS = accountType === "nro" ? interest * 0.30 : 0

      data.push({
        year,
        principal,
        interest: parseFloat(interest.toFixed(2)),
        maturityAmount: parseFloat(amount.toFixed(2)),
        tds: parseFloat(yearlyTDS.toFixed(2)),
        netAmount: parseFloat((amount - yearlyTDS).toFixed(2)),
      })
    }

    return data
  }

  const yearlyData = generateYearlyBreakdown()

  // Compare NRE vs NRO
  const nreInterest = results.totalInterest
  const nroInterestAfterTax = accountType === "nro" ? results.totalInterest - results.tds : results.totalInterest

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">NRE/NRO Account Calculator</CardTitle>
        <p className="text-sm text-gray-600">
          Calculate returns on NRE and NRO deposits with tax implications
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Account Type */}
            <div>
              <Label>Account Type</Label>
              <Select value={accountType} onValueChange={(value: "nre" | "nro") => setAccountType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nre">NRE (Non-Resident External)</SelectItem>
                  <SelectItem value="nro">NRO (Non-Resident Ordinary)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {accountType === "nre"
                  ? "Tax-free interest, fully repatriable"
                  : "Taxable interest (30% TDS), limited repatriation"}
              </p>
            </div>

            {/* Deposit Type */}
            <div>
              <Label>Deposit Type</Label>
              <Select value={depositType} onValueChange={(value: "savings" | "fd") => setDepositType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="fd">Fixed Deposit (FD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Principal Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Deposit Amount</Label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-32 text-right"
                />
              </div>
              <Slider
                value={[principal]}
                onValueChange={(value) => setPrincipal(value[0])}
                min={100000}
                max={10000000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹1L</span>
                <span>₹1Cr</span>
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
                min={3}
                max={9}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3%</span>
                <span>9%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {depositType === "savings"
                  ? "Typical NRE/NRO savings: 2.75-3.5%"
                  : "Typical NRE/NRO FD: 6.5-7.5%"}
              </p>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Tenure (Years)</Label>
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
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Yr</span>
                <span>10 Yrs</span>
              </div>
            </div>

            {/* Compounding Frequency (only for FD) */}
            {depositType === "fd" && (
              <div>
                <Label>Compounding Frequency</Label>
                <Select value={compoundingFrequency} onValueChange={(value: "monthly" | "quarterly" | "yearly") => setCompoundingFrequency(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className={`rounded-lg p-6 ${accountType === "nre" ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-200" : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"}`}>
              <h3 className="text-lg font-semibold text-navy mb-4">
                {accountType === "nre" ? "NRE Account" : "NRO Account"} Returns
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(results.principal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interest Earned:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(results.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Maturity Amount:</span>
                  <span className="text-xl font-bold text-navy">
                    {formatCurrency(results.maturityAmount)}
                  </span>
                </div>

                {accountType === "nro" && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">TDS @ 30%:</span>
                        <span className="text-lg font-bold text-red-600">
                          -{formatCurrency(results.tds)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Net Amount (Post-Tax):</span>
                        <span className="text-2xl font-bold text-navy">
                          {formatCurrency(results.netMaturityAmount)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className={`rounded-lg p-4 ${accountType === "nre" ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
              <h4 className="font-semibold mb-2">
                {accountType === "nre" ? "NRE Account Features" : "NRO Account Features"}
              </h4>
              <ul className="text-sm space-y-1">
                {accountType === "nre" ? (
                  <>
                    <li>✓ Interest is completely tax-free</li>
                    <li>✓ Both principal and interest are fully repatriable</li>
                    <li>✓ Can be funded only from foreign sources</li>
                    <li>✓ Joint account only with another NRI</li>
                  </>
                ) : (
                  <>
                    <li>• Interest is taxable (30% TDS)</li>
                    <li>• Principal fully repatriable, interest up to USD 1M/year</li>
                    <li>• Can be funded from India or abroad</li>
                    <li>• Joint account possible with resident Indian</li>
                  </>
                )}
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Effective Return</p>
                <p className="text-lg font-bold text-purple-600">
                  {((results.netMaturityAmount - results.principal) / results.principal * 100).toFixed(2)}%
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Total Duration</p>
                <p className="text-lg font-bold text-orange-600">
                  {tenure} {tenure === 1 ? "Year" : "Years"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">Growth Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData}>
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
                  dataKey="maturityAmount"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  name="Gross Amount"
                />
                {accountType === "nro" && (
                  <Line
                    type="monotone"
                    dataKey="netAmount"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Net Amount (Post-Tax)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy mb-4">NRE vs NRO Quick Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Feature</th>
                  <th className="p-3 text-left">NRE Account</th>
                  <th className="p-3 text-left">NRO Account</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Tax on Interest</td>
                  <td className="p-3 text-green-600 font-semibold">Tax-Free</td>
                  <td className="p-3 text-red-600 font-semibold">30% TDS</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-3">Repatriation</td>
                  <td className="p-3">Fully Repatriable</td>
                  <td className="p-3">Limited (USD 1M/year)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Funding Source</td>
                  <td className="p-3">Foreign Sources Only</td>
                  <td className="p-3">India + Foreign</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-3">Joint Account</td>
                  <td className="p-3">Only with NRI</td>
                  <td className="p-3">With Resident/NRI</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Best For</td>
                  <td className="p-3">Foreign earnings</td>
                  <td className="p-3">Indian income (rent, etc.)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Important Notes for NRIs:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>NRE: Interest is completely tax-free in India (may be taxable in country of residence)</li>
            <li>NRO: 30% TDS can be reduced if income is below taxable limit via Form 15CA/15CB</li>
            <li>DTAA (Double Taxation Avoidance Agreement) benefits may apply based on country of residence</li>
            <li>Interest rates vary by bank and are subject to change quarterly by RBI</li>
            <li>This calculator provides estimates. Consult with a tax advisor for accurate calculations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default NRECalculator
