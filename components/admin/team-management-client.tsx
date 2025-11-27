"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserPlus,
  Mail,
  Shield,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Eye,
  Edit3,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdminUser } from "@/types/admin"

interface TeamMember extends Omit<AdminUser, 'createdAt' | 'lastLoginAt'> {
  createdAt: string
  lastLoginAt: string | null
}

interface TeamManagementClientProps {
  teamMembers: TeamMember[]
  currentUser: any
}

const roleColors = {
  super_admin: "bg-purple-100 text-purple-800 border-purple-200",
  admin: "bg-blue-100 text-blue-800 border-blue-200",
  editor: "bg-green-100 text-green-800 border-green-200",
  content_writer: "bg-yellow-100 text-yellow-800 border-yellow-200",
  viewer: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
}

const roleDescriptions = {
  super_admin: "Full access to all features including team management",
  admin: "Manage content, webinars, resources, and view analytics",
  editor: "Edit content, manage webinars and resources",
  content_writer: "Create and edit newsletters and articles",
  viewer: "View-only access to analytics and content",
}

export function TeamManagementClient({ teamMembers, currentUser }: TeamManagementClientProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [members, setMembers] = useState<TeamMember[]>(teamMembers)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [inviteForm, setInviteForm] = useState({
    email: "",
    name: "",
    role: "editor" as AdminUser['role'],
    permissions: {
      manageAdmins: false,
      manageWebinars: true,
      deleteContent: false,
      draftNewsletter: true,
      publishNewsletter: false,
      manageSubscribers: false,
      viewAnalytics: true,
      exportData: false,
    }
  })

  // Auto-set permissions based on role
  const handleRoleChange = (role: AdminUser['role']) => {
    let permissions = { ...inviteForm.permissions }

    switch (role) {
      case 'super_admin':
        permissions = {
          manageAdmins: true,
          manageWebinars: true,
          deleteContent: true,
          draftNewsletter: true,
          publishNewsletter: true,
          manageSubscribers: true,
          viewAnalytics: true,
          exportData: true,
        }
        break
      case 'admin':
        permissions = {
          manageAdmins: false,
          manageWebinars: true,
          deleteContent: true,
          draftNewsletter: true,
          publishNewsletter: true,
          manageSubscribers: true,
          viewAnalytics: true,
          exportData: true,
        }
        break
      case 'editor':
        permissions = {
          manageAdmins: false,
          manageWebinars: true,
          deleteContent: false,
          draftNewsletter: true,
          publishNewsletter: false,
          manageSubscribers: false,
          viewAnalytics: true,
          exportData: false,
        }
        break
      case 'content_writer':
        permissions = {
          manageAdmins: false,
          manageWebinars: false,
          deleteContent: false,
          draftNewsletter: true,
          publishNewsletter: false,
          manageSubscribers: false,
          viewAnalytics: false,
          exportData: false,
        }
        break
      case 'viewer':
        permissions = {
          manageAdmins: false,
          manageWebinars: false,
          deleteContent: false,
          draftNewsletter: false,
          publishNewsletter: false,
          manageSubscribers: false,
          viewAnalytics: true,
          exportData: false,
        }
        break
    }

    setInviteForm({ ...inviteForm, role, permissions })
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invite")
      }

      setSuccess(`Invite sent to ${inviteForm.email}`)

      // Add to local state
      const newMember: TeamMember = {
        email: inviteForm.email,
        name: inviteForm.name,
        role: inviteForm.role,
        permissions: inviteForm.permissions,
        status: 'pending',
        invitedBy: currentUser.email,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
      }
      setMembers([newMember, ...members])

      // Reset form
      setTimeout(() => {
        setIsInviteOpen(false)
        setSuccess("")
        setInviteForm({
          email: "",
          name: "",
          role: "editor",
          permissions: {
            manageAdmins: false,
            manageWebinars: true,
            deleteContent: false,
            draftNewsletter: true,
            publishNewsletter: false,
            manageSubscribers: false,
            viewAnalytics: true,
            exportData: false,
          }
        })
      }, 2000)

    } catch (err: any) {
      setError(err.message || "Failed to send invite")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (email: string, newStatus: AdminUser['status']) => {
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      setMembers(members.map(m =>
        m.email === email ? { ...m, status: newStatus } : m
      ))
      setSuccess(`Status updated for ${email}`)
      setTimeout(() => setSuccess(""), 3000)

    } catch (err: any) {
      setError(err.message || "Failed to update status")
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Team Management</h1>
          <p className="text-gray-600">
            Invite team members and manage their access permissions
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)} variant="cta" size="lg">
          <UserPlus className="h-5 w-5 mr-2" />
          Invite Team Member
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Permissions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                      roleColors[member.role]
                    )}>
                      <Shield className="h-3 w-3" />
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {member.permissions.manageWebinars && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs">
                          Webinars
                        </span>
                      )}
                      {member.permissions.draftNewsletter && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs">
                          Newsletter
                        </span>
                      )}
                      {member.permissions.viewAnalytics && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs">
                          Analytics
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                      statusColors[member.status]
                    )}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {member.lastLoginAt
                        ? new Date(member.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {member.email !== currentUser.email && (
                      <div className="flex gap-2">
                        {member.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(member.email, 'suspended')}
                          >
                            Suspend
                          </Button>
                        )}
                        {member.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(member.email, 'active')}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-navy">Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member with specific permissions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="space-y-5 mt-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                required
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                required
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value) => handleRoleChange(value as AdminUser['role'])}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="content_writer">Content Writer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                {roleDescriptions[inviteForm.role]}
              </p>
            </div>

            {/* Permissions Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Permissions for this role:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(inviteForm.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    {value ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300" />
                    )}
                    <span className={value ? "text-gray-700" : "text-gray-400"}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="cta" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
