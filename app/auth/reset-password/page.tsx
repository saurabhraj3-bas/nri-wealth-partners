'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const tokenParam = searchParams.get('token')

    if (!emailParam || !tokenParam) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    setEmail(emailParam)
    setToken(tokenParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          token,
          newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/admin')
        }, 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-navy p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-green-500/10 rounded-2xl mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Password Reset Successful!</h1>
            <p className="text-gray-300">
              You can now log in with your new password
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <p className="text-gray-200 mb-6">
              Redirecting you to the login page...
            </p>

            <Link
              href="/auth/admin"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Login
            </Link>
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
            <Lock className="w-12 h-12 text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-300">
            Create a new password for your account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {!email || !token ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-200 mb-6">{error || 'Invalid or expired reset link'}</p>
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Email Display */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Resetting password for
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {email}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full px-4 py-3 bg-gold hover:bg-gold/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          {email && token && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                href="/auth/admin"
                className="flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-navy">
        <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
