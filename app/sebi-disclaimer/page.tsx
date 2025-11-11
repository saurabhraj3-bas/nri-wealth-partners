import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "SEBI Disclaimer & Regulatory Compliance",
  description: "SEBI registration details, regulatory compliance information, risk disclosures, and investor responsibilities for NRI Wealth Partners.",
}

export default function SEBIDisclaimerPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy mb-4">SEBI Disclaimer & Regulatory Compliance</h1>
          <p className="text-gray-600">
            Last Updated: January 2025
          </p>
        </div>

        <div className="space-y-6">
          {/* Important Notice */}
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-bold text-yellow-900 mb-2">Important Regulatory Notice</h2>
                  <p className="text-sm text-yellow-800">
                    Please read all regulatory disclosures and disclaimers carefully before investing.
                    Investments are subject to market risks and regulatory compliance requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEBI Registration */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">1. SEBI Registration & Disclosure</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Avani Parekh</strong> is registered with the <strong>Association of Mutual Funds in India (AMFI)</strong> as
                  a Mutual Fund Distributor. AMFI Registration Number: <strong>[ADD ACTUAL ARN NUMBER]</strong>
                </p>
                <p>
                  <strong>Anil Parekh & Co.</strong> provides investment advisory and chartered accountancy services. We comply with
                  Institute of Chartered Accountants of India (ICAI) guidelines and regulations.
                </p>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  <strong>Note:</strong> Please verify our registration status at www.amfiindia.com before investing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Compliance */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">2. Regulatory Compliance</h2>
              <p className="text-gray-700 mb-3">Our services are subject to and comply with:</p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Securities and Exchange Board of India (SEBI) regulations",
                  "Association of Mutual Funds in India (AMFI) guidelines",
                  "Institute of Chartered Accountants of India (ICAI) code of ethics",
                  "Foreign Exchange Management Act (FEMA) regulations",
                  "Income Tax Act, 1961",
                  "Prevention of Money Laundering Act (PMLA), 2002",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-navy mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risk Disclosure */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-red-900 mb-4">3. Risk Disclosure Statement</h2>
              <div className="space-y-3 text-red-800">
                <p className="font-semibold">
                  Investment in securities market are subject to market risks. Read all the related documents carefully before investing.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Past performance is not indicative of future returns</li>
                  <li>• Mutual fund investments are subject to market risks</li>
                  <li>• The NAV of mutual funds may go up or down depending upon market forces</li>
                  <li>• All investors should carefully read the Scheme Information Document and Statement of Additional Information</li>
                  <li>• Returns are not guaranteed and may be positive or negative</li>
                  <li>• Different investment products carry different levels of risk</li>
                  <li>• Currency fluctuations may impact returns for NRI investors</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Investor Responsibilities */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">4. Investor Responsibilities</h2>
              <p className="text-gray-700 mb-3">Investors are advised to:</p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Understand the products and services before investing",
                  "Conduct independent research or seek professional advice",
                  "Read all scheme documents (SID, SAI, KIM) carefully",
                  "Understand the risk-return profile of investments",
                  "Monitor portfolio performance regularly",
                  "Keep KYC documents updated",
                  "Report any suspicious activities",
                  "Verify AMFI/SEBI registration before transacting",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Important Disclaimers */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">5. Important Disclaimers</h2>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>• We do not guarantee returns or promise any fixed returns on investments</p>
                <p>• Investment decisions should be made after careful consideration of financial goals, risk appetite, and time horizon</p>
                <p>• Information provided on this website is for educational purposes only and should not be construed as personalized investment advice</p>
                <p>• We are not liable for any investment losses incurred by investors</p>
                <p>• Recommendations are based on information believed to be reliable, but we do not warrant its completeness or accuracy</p>
                <p>• NRI investors must ensure compliance with applicable tax laws in their country of residence</p>
                <p>• Currency fluctuations may impact returns for NRI investors</p>
              </div>
            </CardContent>
          </Card>

          {/* Conflict of Interest */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">6. Conflict of Interest Disclosure</h2>
              <p className="text-gray-700">
                As a mutual fund distributor, we may receive commissions from mutual fund companies for distribution services.
                This does not affect the NAV of the mutual fund or the returns to investors. We commit to act in the best interests
                of our clients and disclose all material conflicts of interest.
              </p>
            </CardContent>
          </Card>

          {/* Complaint Redressal */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">7. Complaint Redressal</h2>
              <p className="text-gray-700 mb-4">For any complaints or grievances:</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> support@nriwealthpartners.com</p>
                <p><strong>Phone:</strong> +91 9974742626</p>
                <p><strong>Response Time:</strong> Within 7 working days</p>
              </div>
              <p className="text-gray-700 mt-4">If not satisfied, investors may escalate to:</p>
              <ul className="space-y-2 text-gray-700 mt-2">
                <li>• AMFI: complaints@amfiindia.com</li>
                <li>• SEBI SCORES Portal: scores.gov.in</li>
                <li>• SEBI Website: www.sebi.gov.in</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">8. Data Privacy & Confidentiality</h2>
              <p className="text-gray-700">
                We maintain strict confidentiality of client information and comply with data protection regulations.
                Client data is used only for providing services and is not shared with third parties without explicit consent,
                except as required by law or regulatory authorities.
              </p>
            </CardContent>
          </Card>

          {/* AML Compliance */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">9. Anti-Money Laundering (AML) Compliance</h2>
              <p className="text-gray-700">
                We comply with Prevention of Money Laundering Act (PMLA) and maintain strict KYC (Know Your Customer) procedures.
                We reserve the right to refuse services if adequate KYC documentation is not provided or if we suspect any suspicious activities.
              </p>
            </CardContent>
          </Card>

          {/* Website Disclaimer */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-navy mb-4">10. Website Disclaimer</h2>
              <p className="text-gray-700">
                The information on this website is updated periodically and while we strive for accuracy, we do not guarantee that
                all information is current, complete, or error-free. Users should verify information independently before making
                investment decisions. The calculators provide estimates only and actual results may vary.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-navy text-white rounded-lg">
          <p className="text-center font-semibold mb-2">
            Mutual fund investments are subject to market risks, read all scheme related documents carefully.
          </p>
          <p className="text-center text-sm text-gray-300">
            For detailed information, please read our{" "}
            <a href="/terms" className="underline hover:text-gold">Terms of Service</a> and{" "}
            <a href="/privacy-policy" className="underline hover:text-gold">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
