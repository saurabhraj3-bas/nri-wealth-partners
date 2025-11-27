"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  User,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Webinar } from "@/app/admin/webinars/page"

interface WebinarManagementClientProps {
  webinars: Webinar[]
  currentUser: any
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800 border-gray-300",
  published: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-blue-100 text-blue-800 border-blue-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
}

const timezones = [
  { value: "IST", label: "India (IST)" },
  { value: "EST", label: "Eastern Time (EST)" },
  { value: "PST", label: "Pacific Time (PST)" },
  { value: "GMT", label: "GMT" },
  { value: "SGT", label: "Singapore (SGT)" },
  { value: "AEDT", label: "Australia (AEDT)" },
]

export function WebinarManagementClient({ webinars, currentUser }: WebinarManagementClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [webinarList, setWebinarList] = useState<Webinar[]>(webinars)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState<Partial<Webinar>>({
    title: "",
    description: "",
    date: "",
    time: "",
    timezone: "IST",
    duration: 60,
    speaker: "",
    speakerTitle: "",
    maxAttendees: 100,
    tags: [],
    status: "draft",
  })

  const handleOpenDialog = (webinar?: Webinar) => {
    if (webinar) {
      setEditingWebinar(webinar)
      setFormData(webinar)
    } else {
      setEditingWebinar(null)
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        timezone: "IST",
        duration: 60,
        speaker: "",
        speakerTitle: "",
        maxAttendees: 100,
        tags: [],
        status: "draft",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const url = editingWebinar
        ? "/api/admin/webinars/update"
        : "/api/admin/webinars/create"

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: editingWebinar?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save webinar")
      }

      setSuccess(editingWebinar ? "Webinar updated successfully" : "Webinar created successfully")

      // Update local state
      if (editingWebinar) {
        setWebinarList(webinarList.map(w =>
          w.id === data.webinar.id ? data.webinar : w
        ))
      } else {
        setWebinarList([data.webinar, ...webinarList])
      }

      setTimeout(() => {
        setIsDialogOpen(false)
        setSuccess("")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "Failed to save webinar")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return

    try {
      const response = await fetch("/api/admin/webinars/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete webinar")
      }

      setWebinarList(webinarList.filter(w => w.id !== id))
      setSuccess("Webinar deleted successfully")
      setTimeout(() => setSuccess(""), 3000)

    } catch (err: any) {
      setError(err.message || "Failed to delete webinar")
      setTimeout(() => setError(""), 3000)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Webinar Management</h1>
          <p className="text-gray-600">
            Create and manage webinars with ease
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} variant="cta" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Webinar
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

      {/* Webinars Grid */}
      {webinarList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No webinars yet</h3>
          <p className="text-gray-500 mb-6">Create your first webinar to get started</p>
          <Button onClick={() => handleOpenDialog()} variant="cta">
            <Plus className="h-5 w-5 mr-2" />
            Create Webinar
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {webinarList.map((webinar) => (
            <div
              key={webinar.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-navy/10 rounded-lg">
                      <Video className="h-6 w-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{webinar.title}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border",
                          statusColors[webinar.status]
                        )}>
                          {webinar.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{webinar.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-navy" />
                          {formatDate(webinar.date)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-navy" />
                          {webinar.time} {webinar.timezone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="h-4 w-4 text-navy" />
                          {webinar.speaker}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="h-4 w-4 text-navy" />
                          {webinar.registrationCount || 0} / {webinar.maxAttendees || '∞'}
                        </div>
                      </div>

                      {webinar.tags && webinar.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {webinar.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(webinar)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(webinar.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-navy">
              {editingWebinar ? "Edit Webinar" : "Create New Webinar"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create an engaging webinar
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Webinar Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Tax Planning Strategies for NRIs"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Learn expert tax planning strategies tailored for NRIs..."
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Timezone and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone *</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                  min="15"
                  step="15"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Speaker Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="speaker">Speaker Name *</Label>
                <Input
                  id="speaker"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  required
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="speakerTitle">Speaker Title *</Label>
                <Input
                  id="speakerTitle"
                  value={formData.speakerTitle}
                  onChange={(e) => setFormData({ ...formData, speakerTitle: e.target.value })}
                  required
                  placeholder="Senior Financial Advisor"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Max Attendees and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
                  min="1"
                  placeholder="100"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                placeholder="tax planning, NRI, investment"
                disabled={isSubmitting}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="cta" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {editingWebinar ? "Update Webinar" : "Create Webinar"}
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
