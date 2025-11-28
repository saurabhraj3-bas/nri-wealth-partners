/**
 * Admin Dashboard Page
 *
 * Overview of newsletter system status and quick actions.
 */

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Rss,
  AlertCircle,
  Video,
  FolderOpen,
  UserCog,
  Sparkles,
  Newspaper
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/auth/admin")
    }

    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your newsletter system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Subscribers"
            value="Coming Soon"
            icon={Users}
            change="Newsletter system"
            href="/admin"
            disabled={true}
          />
          <StatsCard
            title="Newsletters Sent"
            value="Coming Soon"
            icon={Mail}
            change="Newsletter system"
            href="/admin"
            disabled={true}
          />
          <StatsCard
            title="Curated Articles"
            value="Coming Soon"
            icon={FileText}
            change="Newsletter system"
            href="/admin"
            disabled={true}
          />
          <StatsCard
            title="Average Open Rate"
            value="Coming Soon"
            icon={TrendingUp}
            change="Newsletter system"
            href="/admin"
            disabled={true}
          />
        </div>

        {/* Setup Instructions */}
        <Card className="border-gold bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy">
              <AlertCircle className="h-5 w-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Welcome to your newsletter system! Follow these steps to get started:
              </p>

              <div className="space-y-3">
                <SetupStep
                  number={1}
                  title="Set up Firebase/Firestore"
                  description="Follow the Firebase setup guide to initialize your database"
                  docsLink="/docs/firebase-setup-guide.md"
                />
                <SetupStep
                  number={2}
                  title="Deploy Cloud Functions"
                  description="Deploy the RSS collector and AI processing functions"
                  docsLink="/docs/cloud-functions-deployment-guide.md"
                />
                <SetupStep
                  number={3}
                  title="Test RSS Collection"
                  description="Trigger a manual RSS collection to populate articles"
                  href="/admin/sources"
                />
                <SetupStep
                  number={4}
                  title="Review & Send Newsletter"
                  description="Review AI-compiled newsletter and send to subscribers"
                  href="/admin/newsletters"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Team Management - Super Admin Only */}
          {session.user.role === 'super_admin' && (
            <QuickActionCard
              title="Team Management"
              description="Invite and manage team members"
              icon={UserCog}
              href="/admin/team"
              disabled={false}
            />
          )}

          {/* Webinars */}
          <QuickActionCard
            title="Manage Webinars"
            description="Create and edit webinars"
            icon={Video}
            href="/admin/webinars"
            disabled={!session.user.permissions.manageWebinars}
          />

          {/* News Management */}
          <QuickActionCard
            title="Manage News"
            description="Moderate and delete news articles"
            icon={Newspaper}
            href="/admin/news"
            disabled={!session.user.permissions.deleteContent}
          />

          {/* Resources */}
          <QuickActionCard
            title="Manage Resources"
            description="Upload PDFs and resources"
            icon={FolderOpen}
            href="/admin/resources"
            disabled={!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars}
          />

          {/* Content Generator */}
          <QuickActionCard
            title="AI Content Generator"
            description="Generate blog posts and PDF guides with AI"
            icon={Sparkles}
            href="/admin/content-generator"
            disabled={!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars}
          />

          {/* Newsletter */}
          <QuickActionCard
            title="Create Newsletter"
            description="Newsletter system - Coming Soon"
            icon={Mail}
            href="/admin"
            disabled={true}
            comingSoon={true}
          />

          {/* Subscribers */}
          <QuickActionCard
            title="View Subscribers"
            description="Newsletter system - Coming Soon"
            icon={Users}
            href="/admin"
            disabled={true}
            comingSoon={true}
          />

          {/* Content Sources */}
          <QuickActionCard
            title="Content Sources"
            description="Newsletter system - Coming Soon"
            icon={Rss}
            href="/admin"
            disabled={true}
            comingSoon={true}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("❌ Dashboard error:", error)
    redirect("/auth/admin")
  }
}

function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  href,
  disabled
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  change: string
  href: string
  disabled?: boolean
}) {
  if (disabled) {
    return (
      <Card className="opacity-60 cursor-not-allowed">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-400 mb-1">{value}</h3>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-xs text-gray-400">{change}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-navy" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-navy mb-1">{value}</h3>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xs text-gray-500">{change}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function SetupStep({
  number,
  title,
  description,
  href,
  docsLink
}: {
  number: number
  title: string
  description: string
  href?: string
  docsLink?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-xs font-bold">{number}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-navy">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        {href && (
          <Link href={href} className="text-sm text-gold hover:underline mt-1 inline-block">
            Go to {title.toLowerCase()} →
          </Link>
        )}
        {docsLink && (
          <p className="text-xs text-gray-500 mt-1">
            Docs: <code className="bg-white px-1 py-0.5 rounded">{docsLink}</code>
          </p>
        )}
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  disabled,
  comingSoon
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  disabled?: boolean
  comingSoon?: boolean
}) {
  if (disabled) {
    return (
      <Card className="opacity-50 cursor-not-allowed">
        <CardContent className="p-6">
          <Icon className="h-8 w-8 text-gray-400 mb-3" />
          <h3 className="font-semibold text-gray-500 mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
          <p className="text-xs text-gray-400 mt-2">{comingSoon ? "Coming Soon" : "No permission"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <Icon className="h-8 w-8 text-navy mb-3" />
          <h3 className="font-semibold text-navy mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-sm text-gold mt-2 font-medium">Open →</p>
        </CardContent>
      </Card>
    </Link>
  )
}
