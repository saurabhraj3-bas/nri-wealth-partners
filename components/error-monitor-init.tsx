"use client"

import { useEffect } from 'react'
import { errorMonitor } from '@/lib/error-monitoring'

/**
 * Error Monitoring Initializer
 *
 * This component initializes the global error monitoring system.
 * It's imported in the root layout to ensure errors are captured
 * across the entire application.
 */
export default function ErrorMonitorInit() {
  useEffect(() => {
    // Error monitor is auto-initialized on import
    // This effect just ensures it's loaded on the client
    console.log('[ErrorMonitor] Initialized successfully')
  }, [])

  return null // This component doesn't render anything
}
