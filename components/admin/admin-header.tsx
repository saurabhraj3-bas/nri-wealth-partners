"use client"

/**
 * Admin Header Component
 *
 * Top navigation bar with user info and logout button.
 */

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2, User } from "lucide-react"

interface AdminHeaderProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut({ redirect: false })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("❌ Logout error:", error)
      // Still redirect to login on error
      router.push("/admin/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-navy to-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-gold font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">
                NRI Wealth Partners
              </h1>
              <p className="text-xs text-gray-500">Newsletter Admin</p>
            </div>
          </div>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-navy">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role.replace(/_/g, " ")}</p>
          </div>

          <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging Out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
