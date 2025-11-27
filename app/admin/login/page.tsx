"use client"

/**
 * Admin Login Page
 *
 * Secure login for admin users with error handling and validation.
 */

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Attempt sign in
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        // Handle specific error messages
        if (result.error === "CredentialsSignin") {
          throw new Error("Invalid email or password")
        } else {
          throw new Error(result.error)
        }
      }

      if (result?.ok) {
        // Success - redirect to admin dashboard
        console.log("✅ Login successful, redirecting to:", callbackUrl)
        router.push(callbackUrl)
        router.refresh()
      } else {
        throw new Error("Login failed. Please try again.")
      }
    } catch (err: any) {
      console.error("❌ Login error:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-blue-900 to-navy p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Lock className="h-10 w-10 text-navy" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-300 text-sm">
            NRI Wealth Partners Newsletter System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-navy font-semibold">
                Email Address
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    setError("") // Clear error on input change
                  }}
                  placeholder="admin@nriwealthpartners.com"
                  className="pl-10"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-navy font-semibold">
                Password
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setError("") // Clear error on input change
                  }}
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">Login Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="cta"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Only authorized administrators can access this system.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contact{" "}
              <a
                href="mailto:saurabh@nriwealthpartners.com"
                className="text-gold hover:underline"
              >
                saurabh@nriwealthpartners.com
              </a>{" "}
              for access.
            </p>
          </div>
        </div>

        {/* Development Note */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-xs font-semibold text-yellow-800">
              Development Mode
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Use your admin email and the password set in ADMIN_PASSWORD env variable.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
