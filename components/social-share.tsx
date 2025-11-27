"use client"

import { useState } from 'react'
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Check,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function SocialShare({
  url,
  title,
  description,
  variant = 'outline',
  size = 'default',
  className = ''
}: SocialShareProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${url}`
    : `https://nriwealthpartners.com${url}`

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = description ? encodeURIComponent(description) : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async (platform: keyof typeof shareLinks) => {
    // Try native share API first (for mobile)
    if (navigator.share && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl
        })
        setShowMenu(false)
        return
      } catch (err) {
        // User cancelled or not supported
        console.log('Native share not available')
      }
    }

    // Open share link in new window
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowMenu(!showMenu)}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="py-2">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Share on Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare('email')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                Share via Email
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 text-gray-600" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Alternative: Simple icon-based share buttons
export function SocialShareButtons({
  url,
  title,
  description,
  className = ''
}: Omit<SocialShareProps, 'variant' | 'size'>) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${url}`
    : `https://nriwealthpartners.com${url}`

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = description ? encodeURIComponent(description) : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-semibold text-gray-700">Share:</span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(shareLinks.twitter, '_blank', 'width=600,height=400')}
          className="hover:bg-blue-50"
        >
          <Twitter className="h-4 w-4 text-blue-400" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(shareLinks.facebook, '_blank', 'width=600,height=400')}
          className="hover:bg-blue-50"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(shareLinks.linkedin, '_blank', 'width=600,height=400')}
          className="hover:bg-blue-50"
        >
          <Linkedin className="h-4 w-4 text-blue-700" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(shareLinks.email)}
          className="hover:bg-gray-50"
        >
          <Mail className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className={copied ? 'bg-green-50' : 'hover:bg-gray-50'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <LinkIcon className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>
    </div>
  )
}
