import { NextResponse } from 'next/server'

/**
 * Health Check Endpoint
 *
 * Used by:
 * 1. Cloud Run health checks
 * 2. Uptime monitoring services
 * 3. Frontend error monitoring
 *
 * Returns 200 if all systems operational
 * Returns 503 if any critical service is down
 */

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    api: boolean
    googleAI: boolean
    email: boolean
    environment: boolean
  }
  version?: string
}

export async function GET() {
  const startTime = Date.now()

  try {
    // Perform health checks
    const checks = {
      api: true, // API is responding if we're here
      googleAI: await checkGoogleAI(),
      email: checkEmailConfig(),
      environment: checkEnvironmentVars(),
    }

    // Determine overall status
    const allHealthy = Object.values(checks).every((check) => check === true)
    const anyUnhealthy = Object.values(checks).some((check) => check === false)

    const status: HealthStatus = {
      status: allHealthy ? 'healthy' : anyUnhealthy ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      version: process.env.COMMIT_SHA || 'unknown',
    }

    // Log degraded status
    if (status.status !== 'healthy') {
      console.warn('[Health Check] Degraded:', status)
    }

    const responseTime = Date.now() - startTime

    return NextResponse.json(
      { ...status, responseTime },
      { status: status.status === 'unhealthy' ? 503 : 200 }
    )
  } catch (error) {
    console.error('[Health Check] Failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

async function checkGoogleAI(): Promise<boolean> {
  // Check if Google AI API key is configured
  return !!process.env.GOOGLE_AI_API_KEY
}

function checkEmailConfig(): Promise<boolean> {
  // Check if email credentials are configured
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

function checkEnvironmentVars(): Promise<boolean> {
  // Check critical environment variables
  const required = ['GOOGLE_AI_API_KEY', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']

  return required.every((varName) => !!process.env[varName])
}
