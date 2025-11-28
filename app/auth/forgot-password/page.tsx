'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-navy p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gold/10 rounded-2xl mb-4">
              <CheckCircle2 className="w-12 h-12 text-gold" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-gray-300">
              We've sent a password reset link to your email address
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="space-y-4 text-gray-200">
              <p>
                If an account exists for <strong className="text-white">{email}</strong>, you will receive a password reset link shortly.
              </p>

              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                <h3 className="font-semibold text-gold mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                  <li>Check your email inbox</li>
                  <li>Click the reset link (valid for 1 hour)</li>
                  <li>Create a new password</li>
                  <li>Log in with your new password</li>
                </ol>
              </div>

              <p className="text-sm text-gray-400">
                Didn't receive an email? Check your spam folder or try again.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href="/auth/admin"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold/90 text-white rounded-lg font-semibold transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all duration-200 border border-white/20"
              >
                Send Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-navy p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gold/10 rounded-2xl mb-4">
            <Mail className="w-12 h-12 text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-300">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="admin@nriwealthpartners.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full px-4 py-3 bg-gold hover:bg-gold/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <Link
              href="/auth/admin"
              className="flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Remember your password?{' '}
            <Link href="/auth/admin" className="text-gold hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
