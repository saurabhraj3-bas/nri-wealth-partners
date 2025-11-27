"use client"

/**
 * Admin Navigation Sidebar
 *
 * Navigation menu with permission-based visibility.
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  Settings,
  BarChart3,
  Rss,
  QrCode,
  Calendar
} from "lucide-react"

interface AdminNavProps {
  user: {
    permissions: {
      manageAdmins: boolean
      manageWebinars: boolean
      deleteContent: boolean
      draftNewsletter: boolean
      publishNewsletter: boolean
      manageSubscribers: boolean
      viewAnalytics: boolean
      exportData: boolean
    }
  }
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  permission?: keyof AdminNavProps['user']['permissions']
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      href: "/admin/newsletters",
      label: "Newsletters",
      icon: Mail,
      permission: "draftNewsletter"
    },
    {
      href: "/admin/articles",
      label: "Articles",
      icon: FileText,
      permission: "draftNewsletter"
    },
    {
      href: "/admin/subscribers",
      label: "Subscribers",
      icon: Users,
      permission: "manageSubscribers"
    },
    {
      href: "/admin/webinars",
      label: "Webinars",
      icon: Calendar,
      permission: "manageWebinars"
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      permission: "viewAnalytics"
    },
    {
      href: "/admin/sources",
      label: "Content Sources",
      icon: Rss,
      permission: "draftNewsletter"
    },
    {
      href: "/admin/qr-codes",
      label: "QR Codes",
      icon: QrCode
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      permission: "manageAdmins"
    }
  ]

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter(item => {
    if (!item.permission) return true
    return user.permissions[item.permission] === true
  })

  return (
    <aside className="fixed left-0 top-[73px] bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-navy text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
