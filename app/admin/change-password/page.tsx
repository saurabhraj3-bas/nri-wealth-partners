'use client'

/**
 * Change Password Page
 *
 * Allows logged-in admin users to change their password
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        setError(data.error || 'Failed to change password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/admin"
            className="text-gray-600 hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-navy">Change Password</h1>
        </div>
        <p className="text-gray-600">Update your account password</p>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Password Changed Successfully!</h3>
            <p className="text-sm text-green-700">
              Your password has been updated. Redirecting you to the dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Change Password Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy/10 rounded-lg">
              <Lock className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-navy">Security Settings</h2>
              <p className="text-sm text-gray-600">Change your password to keep your account secure</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Enter current password"
                required
                disabled={isLoading || isSuccess}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Enter new password"
                required
                disabled={isLoading || isSuccess}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Confirm new password"
                required
                disabled={isLoading || isSuccess}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || isSuccess || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="flex-1 px-6 py-3 bg-navy hover:bg-navy/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Changing Password...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Password Changed
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Change Password
                </>
              )}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl">
        <h3 className="font-semibold text-blue-900 mb-3">Password Security Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Don't reuse passwords from other accounts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Change your password regularly (every 3-6 months)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Never share your password with anyone</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
