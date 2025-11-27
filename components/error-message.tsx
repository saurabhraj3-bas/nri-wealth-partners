import { AlertCircle, RefreshCw, Home, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorMessageProps {
  title?: string
  message?: string
  details?: string
  showRetry?: boolean
  onRetry?: () => void
  showHomeButton?: boolean
  showContactSupport?: boolean
}

export function ErrorMessage({
  title = "Something Went Wrong",
  message = "We encountered an unexpected error. Please try again.",
  details,
  showRetry = true,
  onRetry,
  showHomeButton = true,
  showContactSupport = true,
}: ErrorMessageProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-2">{message}</p>
          {details && (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200 mt-3">
              {details}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="cta">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
          )}
        </div>

        {showContactSupport && (
          <p className="text-xs text-gray-500 mt-6">
            Need help?{" "}
            <a
              href="mailto:support@nriwealthpartners.com"
              className="text-navy hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Database Connection Error - Specific error for Firebase/DB issues
 */
export function DatabaseErrorMessage() {
  return (
    <ErrorMessage
      title="Service Temporarily Unavailable"
      message="We're currently experiencing technical difficulties with our database."
      details="Our team has been notified and is working to resolve this issue. Please try again in a few minutes."
      showRetry={true}
      onRetry={() => window.location.reload()}
    />
  )
}

/**
 * Permission Error - For unauthorized access
 */
export function PermissionErrorMessage() {
  return (
    <ErrorMessage
      title="Access Denied"
      message="You don't have permission to access this page."
      details="If you believe this is an error, please contact your administrator."
      showRetry={false}
      showContactSupport={true}
    />
  )
}

/**
 * Not Found Error
 */
export function NotFoundErrorMessage({ resourceType = "page" }: { resourceType?: string }) {
  return (
    <ErrorMessage
      title="Not Found"
      message={`The ${resourceType} you're looking for doesn't exist or has been removed.`}
      showRetry={false}
      showHomeButton={true}
      showContactSupport={false}
    />
  )
}
