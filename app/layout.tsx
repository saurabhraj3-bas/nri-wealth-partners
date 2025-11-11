import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/navigation/header"
import Footer from "@/components/navigation/footer"
import FloatingActions from "@/components/floating-actions"
import CookieConsent from "@/components/cookie-consent"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "NRI Wealth Partners | Expert Wealth Management for Non-Resident Indians",
    template: "%s | NRI Wealth Partners"
  },
  description: "Trusted financial guidance across borders since 2007. SEBI-registered wealth management and investment advisory services for NRIs. Led by CA Anil Parekh and AMFI Registered Distributor Avani Parekh.",
  keywords: ["NRI wealth management", "NRI investment advisor", "NRI tax planning", "NRI mutual funds", "cross-border financial planning", "FEMA compliance", "NRE NRO accounts", "AMFI registered distributor"],
  authors: [{ name: "NRI Wealth Partners" }],
  creator: "NRI Wealth Partners",
  publisher: "NRI Wealth Partners",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nriwealthpartners.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nriwealthpartners.com",
    title: "NRI Wealth Partners | Expert Wealth Management for Non-Resident Indians",
    description: "Trusted financial guidance across borders since 2007. SEBI-registered wealth management and investment advisory services for NRIs.",
    siteName: "NRI Wealth Partners",
  },
  twitter: {
    card: "summary_large_image",
    title: "NRI Wealth Partners | Expert Wealth Management for Non-Resident Indians",
    description: "Trusted financial guidance across borders since 2007. SEBI-registered wealth management and investment advisory services for NRIs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // TODO: Add actual verification code
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingActions />
        <CookieConsent />
      </body>
    </html>
  )
}
