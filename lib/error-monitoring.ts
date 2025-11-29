/**
 * Error Monitoring & Auto-Remediation System
 *
 * Multi-layer monitoring:
 * 1. Frontend error tracking with auto-recovery
 * 2. API health monitoring
 * 3. Performance tracking
 * 4. Auto-remediation strategies
 */

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  API = 'api',
  JAVASCRIPT = 'javascript',
  RENDERING = 'rendering',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
}

interface ErrorReport {
  timestamp: string
  category: ErrorCategory
  severity: ErrorSeverity
  message: string
  stack?: string
  url: string
  userAgent: string
  metadata?: Record<string, any>
}

class ErrorMonitor {
  private errors: ErrorReport[] = []
  private readonly MAX_ERRORS = 100
  private readonly REPORT_ENDPOINT = '/api/monitor/error'
  private retryAttempts = new Map<string, number>()

  constructor() {
    this.initialize()
  }

  private initialize() {
    // Global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError({
          category: ErrorCategory.JAVASCRIPT,
          severity: ErrorSeverity.HIGH,
          message: event.message,
          stack: event.error?.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        })
      })

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError({
          category: ErrorCategory.JAVASCRIPT,
          severity: ErrorSeverity.HIGH,
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            reason: event.reason,
          },
        })
      })

      // Network errors
      this.monitorNetworkErrors()

      // Performance issues
      this.monitorPerformance()
    }
  }

  private captureError(error: Omit<ErrorReport, 'timestamp'>) {
    const errorReport: ErrorReport = {
      ...error,
      timestamp: new Date().toISOString(),
    }

    // Add to local buffer
    this.errors.push(errorReport)
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift() // Remove oldest
    }

    // Attempt auto-remediation
    this.attemptRemediation(errorReport)

    // Send to backend (non-blocking)
    this.reportError(errorReport)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorMonitor]', errorReport)
    }
  }

  private async reportError(error: ErrorReport) {
    try {
      await fetch(this.REPORT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
      })
    } catch (e) {
      // Silently fail - don't want monitoring to break the app
      console.warn('Failed to report error:', e)
    }
  }

  private monitorNetworkErrors() {
    // Monitor fetch API
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [url] = args
      const urlString = typeof url === 'string' ? url : url.url

      try {
        const response = await originalFetch(...args)

        if (!response.ok) {
          this.captureError({
            category: ErrorCategory.NETWORK,
            severity: response.status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: window.location.href,
            userAgent: navigator.userAgent,
            metadata: {
              requestUrl: urlString,
              status: response.status,
              statusText: response.statusText,
            },
          })
        }

        return response
      } catch (error: any) {
        this.captureError({
          category: ErrorCategory.NETWORK,
          severity: ErrorSeverity.HIGH,
          message: `Network request failed: ${error.message}`,
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            requestUrl: urlString,
            error: error.message,
          },
        })
        throw error
      }
    }
  }

  private monitorPerformance() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor long tasks
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 100) { // Tasks longer than 100ms
              this.captureError({
                category: ErrorCategory.PERFORMANCE,
                severity: ErrorSeverity.MEDIUM,
                message: `Long task detected: ${entry.duration}ms`,
                url: window.location.href,
                userAgent: navigator.userAgent,
                metadata: {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  name: entry.name,
                },
              })
            }
          }
        })
        observer.observe({ entryTypes: ['longtask', 'measure'] })
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  private attemptRemediation(error: ErrorReport) {
    const errorKey = `${error.category}-${error.message}`
    const attempts = this.retryAttempts.get(errorKey) || 0

    // Don't retry indefinitely
    if (attempts >= 3) {
      console.warn('Max retry attempts reached for:', errorKey)
      return
    }

    this.retryAttempts.set(errorKey, attempts + 1)

    // Auto-remediation strategies
    switch (error.category) {
      case ErrorCategory.NETWORK:
        this.remediateNetworkError(error)
        break
      case ErrorCategory.API:
        this.remediateAPIError(error)
        break
      case ErrorCategory.RENDERING:
        this.remediateRenderError(error)
        break
      default:
        // Log for manual review
        break
    }
  }

  private remediateNetworkError(error: ErrorReport) {
    // Strategy: Retry with exponential backoff
    const attempts = this.retryAttempts.get(`${error.category}-${error.message}`) || 0
    const delay = Math.min(1000 * Math.pow(2, attempts), 10000) // Max 10s

    setTimeout(() => {
      // Trigger a reload if critical resources failed
      if (error.severity === ErrorSeverity.CRITICAL) {
        console.log('Critical network error - attempting page reload...')
        // window.location.reload()
      }
    }, delay)
  }

  private remediateAPIError(error: ErrorReport) {
    // Strategy: Clear cache and retry
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }

    // Clear sessionStorage for chatbot
    if (error.metadata?.endpoint?.includes('/api/chat')) {
      sessionStorage.removeItem('chatbot_user_email')
    }
  }

  private remediateRenderError(error: ErrorReport) {
    // Strategy: Component-level recovery
    console.log('Render error detected - component should use Error Boundary')
  }

  // Public API
  public trackEvent(event: string, metadata?: Record<string, any>) {
    console.log('[Event]', event, metadata)
  }

  public getRecentErrors(limit = 10): ErrorReport[] {
    return this.errors.slice(-limit)
  }

  public clearErrors() {
    this.errors = []
    this.retryAttempts.clear()
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor()

// React Error Boundary component
export class ErrorBoundary extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ErrorBoundary'
  }
}

// Health check utilities
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-cache',
    })
    return response.ok
  } catch {
    return false
  }
}

// Performance metrics
export function measurePerformance(metricName: string, callback: () => void) {
  const start = performance.now()
  callback()
  const duration = performance.now() - start

  if (duration > 1000) { // Warn if over 1 second
    errorMonitor.captureError({
      category: ErrorCategory.PERFORMANCE,
      severity: ErrorSeverity.MEDIUM,
      message: `Slow operation: ${metricName} took ${duration}ms`,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: { metricName, duration },
    })
  }

  return duration
}
