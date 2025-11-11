"use client"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export default function NRIInvestmentGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Print Header - Only shows when printing */}
      <div className="hidden print:block text-center py-6 border-b-2 border-navy">
        <h1 className="text-2xl font-bold text-navy">NRI Wealth Partners</h1>
        <p className="text-sm text-gray-600">Expert Wealth Management for Non-Resident Indians</p>
      </div>

      {/* Web Header - Hidden when printing */}
      <div className="print:hidden bg-gradient-to-br from-navy to-blue-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Complete Guide to NRI Investment in India</h1>
            <p className="text-xl text-gray-200 mb-6">
              Comprehensive guide covering all aspects of NRI investments including mutual funds, stocks, real estate, and regulatory compliance.
            </p>
            <div className="flex gap-4">
              <Button
                variant="cta"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download as PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white text-navy hover:bg-gray-100"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg prose-navy">

          {/* Table of Contents */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12 print:break-after-page">
            <h2 className="text-2xl font-bold text-navy mb-4">Table of Contents</h2>
            <ol className="space-y-2">
              <li><a href="#introduction" className="text-navy hover:underline">1. Introduction to NRI Investments</a></li>
              <li><a href="#account-types" className="text-navy hover:underline">2. NRI Account Types (NRE, NRO, FCNR)</a></li>
              <li><a href="#mutual-funds" className="text-navy hover:underline">3. Mutual Fund Investments</a></li>
              <li><a href="#equity" className="text-navy hover:underline">4. Stock Market Investments</a></li>
              <li><a href="#real-estate" className="text-navy hover:underline">5. Real Estate Investments</a></li>
              <li><a href="#fixed-income" className="text-navy hover:underline">6. Fixed Income Options</a></li>
              <li><a href="#tax" className="text-navy hover:underline">7. Tax Implications</a></li>
              <li><a href="#repatriation" className="text-navy hover:underline">8. Repatriation Rules</a></li>
              <li><a href="#compliance" className="text-navy hover:underline">9. Regulatory Compliance</a></li>
              <li><a href="#strategy" className="text-navy hover:underline">10. Investment Strategy Framework</a></li>
            </ol>
          </div>

          {/* Section 1: Introduction */}
          <section id="introduction" className="mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4 print:break-before-page">1. Introduction to NRI Investments</h2>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Who is an NRI?</h3>
            <p>
              As per the Foreign Exchange Management Act (FEMA), a Non-Resident Indian is an Indian citizen who stays abroad for employment, business, or any other purpose indicating an intention to stay abroad for an uncertain period.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg my-6">
              <h4 className="font-semibold text-navy mb-2">Key Definition:</h4>
              <p className="mb-0">
                An Indian citizen is deemed to be an NRI if they stay abroad for more than 182 days during the preceding financial year.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Why Invest in India?</h3>
            <ul className="space-y-3">
              <li><strong>High Growth Potential:</strong> India's GDP growth consistently outpaces developed markets</li>
              <li><strong>Rupee Appreciation:</strong> Potential for currency gains in addition to investment returns</li>
              <li><strong>Diversification:</strong> Reduces portfolio risk through geographical diversity</li>
              <li><strong>Family Connections:</strong> Supporting family members and maintaining ties to homeland</li>
              <li><strong>Retirement Planning:</strong> Building a corpus for eventual return to India</li>
              <li><strong>Tax Benefits:</strong> Various tax-saving investment options available</li>
            </ul>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Regulatory Framework</h3>
            <p>
              NRI investments in India are governed by:
            </p>
            <ul>
              <li><strong>FEMA (Foreign Exchange Management Act), 1999:</strong> Primary legislation</li>
              <li><strong>RBI (Reserve Bank of India):</strong> Regulatory authority</li>
              <li><strong>SEBI (Securities and Exchange Board of India):</strong> Securities market regulator</li>
              <li><strong>Income Tax Act, 1961:</strong> Taxation framework</li>
            </ul>
          </section>

          {/* Section 2: Account Types */}
          <section id="account-types" className="mb-12 print:break-before-page">
            <h2 className="text-3xl font-bold text-navy mb-4">2. NRI Account Types</h2>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">NRE Account (Non-Resident External)</h3>
            <div className="bg-green-50 p-6 rounded-lg my-4">
              <h4 className="font-semibold text-navy mb-3">Key Features:</h4>
              <ul className="space-y-2 mb-0">
                <li>✅ Fully repatriable (principal + interest)</li>
                <li>✅ Tax-free interest income in India</li>
                <li>✅ Held in Indian Rupees (INR)</li>
                <li>✅ Joint holding allowed with another NRI</li>
                <li>✅ Can be used for investments in India</li>
              </ul>
            </div>
            <p><strong>Best For:</strong> Parking foreign earnings in India with complete repatriation flexibility</p>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">NRO Account (Non-Resident Ordinary)</h3>
            <div className="bg-yellow-50 p-6 rounded-lg my-4">
              <h4 className="font-semibold text-navy mb-3">Key Features:</h4>
              <ul className="space-y-2 mb-0">
                <li>⚠️ Limited repatriation (up to USD 1 million per financial year)</li>
                <li>⚠️ Interest income taxable at 30% TDS</li>
                <li>✅ Held in Indian Rupees (INR)</li>
                <li>✅ Joint holding allowed with resident Indian</li>
                <li>✅ Can receive rent, dividends, pension</li>
              </ul>
            </div>
            <p><strong>Best For:</strong> Managing Indian income (rent, pension, dividends)</p>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">FCNR Account (Foreign Currency Non-Resident)</h3>
            <div className="bg-purple-50 p-6 rounded-lg my-4">
              <h4 className="font-semibold text-navy mb-3">Key Features:</h4>
              <ul className="space-y-2 mb-0">
                <li>✅ Held in foreign currency (USD, GBP, EUR, etc.)</li>
                <li>✅ No currency risk</li>
                <li>✅ Tax-free interest income</li>
                <li>✅ Fully repatriable</li>
                <li>⏱️ Fixed deposit only (1-5 years tenure)</li>
              </ul>
            </div>
            <p><strong>Best For:</strong> Protecting against rupee depreciation while earning interest</p>

            <div className="bg-navy text-white p-6 rounded-lg my-8">
              <h4 className="font-bold text-xl mb-3">Quick Comparison</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-left py-2">NRE</th>
                    <th className="text-left py-2">NRO</th>
                    <th className="text-left py-2">FCNR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-2">Currency</td>
                    <td>INR</td>
                    <td>INR</td>
                    <td>Foreign</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2">Repatriation</td>
                    <td>Full</td>
                    <td>Limited</td>
                    <td>Full</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2">Tax on Interest</td>
                    <td>No</td>
                    <td>Yes (30%)</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td className="py-2">Joint with Resident</td>
                    <td>No</td>
                    <td>Yes</td>
                    <td>No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Mutual Funds */}
          <section id="mutual-funds" className="mb-12 print:break-before-page">
            <h2 className="text-3xl font-bold text-navy mb-4">3. Mutual Fund Investments</h2>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Why Mutual Funds for NRIs?</h3>
            <ul className="space-y-2">
              <li>✅ Professional fund management</li>
              <li>✅ Diversification across stocks/sectors</li>
              <li>✅ SIP facility for disciplined investing</li>
              <li>✅ High liquidity (open-ended funds)</li>
              <li>✅ Tax efficiency (compared to bank deposits)</li>
              <li>✅ No TDS on redemption</li>
            </ul>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Types of Mutual Funds</h3>

            <div className="space-y-6">
              <div className="border-l-4 border-navy pl-4">
                <h4 className="font-semibold text-lg text-navy">Equity Mutual Funds</h4>
                <p>Invest primarily in stocks. Best for long-term wealth creation (7+ years).</p>
                <ul className="mt-2 text-sm">
                  <li><strong>Large Cap:</strong> Lower risk, stable returns (10-12% CAGR)</li>
                  <li><strong>Mid Cap:</strong> Moderate risk, higher growth potential (12-15% CAGR)</li>
                  <li><strong>Small Cap:</strong> Higher risk, highest growth potential (15%+ CAGR)</li>
                  <li><strong>Flexi/Multi Cap:</strong> Balanced exposure across market caps</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h4 className="font-semibold text-lg text-navy">Debt Mutual Funds</h4>
                <p>Invest in bonds and fixed-income securities. Lower risk than equity.</p>
                <ul className="mt-2 text-sm">
                  <li><strong>Liquid Funds:</strong> Very low risk, 3-5% returns, high liquidity</li>
                  <li><strong>Short Duration:</strong> Low risk, 6-7% returns</li>
                  <li><strong>Corporate Bond:</strong> Moderate risk, 7-8% returns</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-600 pl-4">
                <h4 className="font-semibold text-lg text-navy">Hybrid Funds</h4>
                <p>Mix of equity and debt for balanced returns.</p>
                <ul className="mt-2 text-sm">
                  <li><strong>Aggressive Hybrid:</strong> 65-80% equity, higher returns</li>
                  <li><strong>Conservative Hybrid:</strong> 75-90% debt, lower risk</li>
                  <li><strong>Balanced Advantage:</strong> Dynamic allocation based on market</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">How to Invest?</h3>
            <ol className="space-y-3">
              <li><strong>Complete KYC:</strong> One-time process through registered intermediary</li>
              <li><strong>Choose Fund House:</strong> Select based on track record and AUM</li>
              <li><strong>Select Funds:</strong> Based on goals, risk appetite, time horizon</li>
              <li><strong>Investment Mode:</strong> Lumpsum or SIP</li>
              <li><strong>Payment:</strong> From NRE/NRO account only</li>
              <li><strong>Redemption:</strong> Credit to NRE/NRO account</li>
            </ol>

            <div className="bg-yellow-50 p-6 rounded-lg my-6">
              <h4 className="font-semibold text-navy mb-2">⚠️ Important Note for USA/Canada NRIs:</h4>
              <p className="mb-0">
                Due to FATCA compliance issues, many Indian mutual funds do not accept investments from NRIs residing in USA and Canada. Consult your advisor for alternative options or eligible funds.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Taxation on Mutual Funds (FY 2024-25)</h3>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Fund Type</th>
                  <th className="border border-gray-300 p-2 text-left">Holding Period</th>
                  <th className="border border-gray-300 p-2 text-left">Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Equity Funds</td>
                  <td className="border border-gray-300 p-2">&lt; 1 year (Short term)</td>
                  <td className="border border-gray-300 p-2">15% STCG</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Equity Funds</td>
                  <td className="border border-gray-300 p-2">&gt; 1 year (Long term)</td>
                  <td className="border border-gray-300 p-2">10% LTCG (above ₹1 lakh)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Debt Funds</td>
                  <td className="border border-gray-300 p-2">Any period</td>
                  <td className="border border-gray-300 p-2">As per income slab</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 4: Equity */}
          <section id="equity" className="mb-12 print:break-before-page">
            <h2 className="text-3xl font-bold text-navy mb-4">4. Stock Market Investments</h2>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Can NRIs Invest in Indian Stocks?</h3>
            <p>Yes! NRIs can invest in Indian stocks through two routes:</p>

            <h4 className="font-semibold text-lg mt-4 mb-2">1. Portfolio Investment Scheme (PIS)</h4>
            <ul className="space-y-2">
              <li>✅ For purchasing shares on stock exchanges</li>
              <li>✅ Requires PIS permission from designated bank</li>
              <li>✅ Repatriable and non-repatriable options</li>
              <li>⚠️ Repatriation limit: Initial investment + capital gains</li>
            </ul>

            <h4 className="font-semibold text-lg mt-4 mb-2">2. Non-PIS Route</h4>
            <ul className="space-y-2">
              <li>✅ For shares received by way of gift/inheritance</li>
              <li>✅ IPO investments up to ₹2 lakhs per financial year</li>
              <li>⚠️ Proceeds are non-repatriable</li>
            </ul>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Opening Trading and Demat Account</h3>
            <ol className="space-y-2">
              <li>Choose a broker registered with SEBI</li>
              <li>Complete KYC and in-person verification (IPV)</li>
              <li>Link NRE/NRO bank account</li>
              <li>Apply for PIS permission from bank (if repatriation needed)</li>
              <li>Fund account and start trading</li>
            </ol>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Investment Restrictions</h3>
            <div className="bg-red-50 p-6 rounded-lg my-4">
              <h4 className="font-semibold text-navy mb-2">NRIs CANNOT Invest in:</h4>
              <ul className="space-y-1 mb-0">
                <li>❌ Small Cap stocks in certain categories</li>
                <li>❌ Trading in derivatives (F&O)</li>
                <li>❌ Day trading (intraday)</li>
                <li>❌ Agricultural land/plantation/farmhouse</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-navy mt-6 mb-3">Taxation on Equity (FY 2024-25)</h3>
            <ul className="space-y-2">
              <li><strong>Short Term Capital Gains (&lt;1 year):</strong> 15%</li>
              <li><strong>Long Term Capital Gains (&gt;1 year):</strong> 10% on gains above ₹1 lakh</li>
              <li><strong>Dividend Income:</strong> Taxable as per income tax slab</li>
              <li><strong>STT (Securities Transaction Tax):</strong> Applicable on all transactions</li>
            </ul>
          </section>

          {/* Continued sections would follow the same pattern */}

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
            <p className="font-semibold text-navy text-lg mb-2">NRI Wealth Partners</p>
            <p>Expert Wealth Management for Non-Resident Indians</p>
            <p className="mt-2">www.nriwealthpartners.com | contact@nriwealthpartners.com</p>
            <p className="mt-4 text-xs">
              Disclaimer: This guide is for informational purposes only. Please consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>

        </article>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 2cm;
            size: A4;
          }
          body {
            font-size: 11pt;
            line-height: 1.4;
          }
          h2 {
            page-break-after: avoid;
          }
          .print\\:break-before-page {
            page-break-before: always;
          }
          .print\\:break-after-page {
            page-break-after: always;
          }
          a {
            color: #1e3a5f !important;
            text-decoration: none;
          }
        }
      `}</style>
    </div>
  )
}
