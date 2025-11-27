"use client"

import { useState, useRef } from "react"
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
  FileText,
  Upload,
  Plus,
  Edit3,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  File,
  Tag,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Resource } from "@/app/admin/resources/page"

interface ResourceManagementClientProps {
  resources: Resource[]
  currentUser: any
}

const categoryLabels = {
  guides: "Investment Guides",
  tax: "Tax Resources",
  market: "Market Insights",
  videos: "Videos & Webinars",
  checklists: "Checklists",
  immigration: "Immigration News",
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800 border-gray-300",
  published: "bg-green-100 text-green-800 border-green-300",
  archived: "bg-red-100 text-red-800 border-red-300",
}

export function ResourceManagementClient({ resources, currentUser }: ResourceManagementClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [resourceList, setResourceList] = useState<Resource[]>(resources)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<Resource> & { file?: File }>({
    title: "",
    description: "",
    category: "guides",
    type: "PDF Guide",
    tags: [],
    status: "draft",
    file: undefined,
  })

  const handleOpenDialog = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource)
      setFormData(resource)
    } else {
      setEditingResource(null)
      setFormData({
        title: "",
        description: "",
        category: "guides",
        type: "PDF Guide",
        tags: [],
        status: "draft",
        file: undefined,
      })
    }
    setIsDialogOpen(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setFormData({ ...formData, file: files[0] })
    } else {
      setError("Please upload a PDF file")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      if (files[0].type === 'application/pdf') {
        setFormData({ ...formData, file: files[0] })
      } else {
        setError("Please upload a PDF file")
        setTimeout(() => setError(""), 3000)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      let fileUrl = editingResource?.fileUrl || ""
      let fileName = editingResource?.fileName || ""
      let fileSize = editingResource?.fileSize || 0

      // Upload file if new file is selected
      if (formData.file) {
        setIsUploading(true)

        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.file)
        uploadFormData.append('category', formData.category || 'guides')

        const uploadResponse = await fetch("/api/admin/resources/upload", {
          method: "POST",
          body: uploadFormData,
        })

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Failed to upload file")
        }

        fileUrl = uploadData.fileUrl
        fileName = uploadData.fileName
        fileSize = uploadData.fileSize
        setIsUploading(false)
      }

      // Create or update resource
      const url = editingResource
        ? "/api/admin/resources/update"
        : "/api/admin/resources/create"

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: editingResource?.id,
          fileUrl,
          fileName,
          fileSize,
          file: undefined, // Remove file object before sending
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save resource")
      }

      setSuccess(editingResource ? "Resource updated successfully" : "Resource created successfully")

      // Update local state
      if (editingResource) {
        setResourceList(resourceList.map(r =>
          r.id === data.resource.id ? data.resource : r
        ))
      } else {
        setResourceList([data.resource, ...resourceList])
      }

      setTimeout(() => {
        setIsDialogOpen(false)
        setSuccess("")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "Failed to save resource")
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const response = await fetch("/api/admin/resources/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete resource")
      }

      setResourceList(resourceList.filter(r => r.id !== id))
      setSuccess("Resource deleted successfully")
      setTimeout(() => setSuccess(""), 3000)

    } catch (err: any) {
      setError(err.message || "Failed to delete resource")
      setTimeout(() => setError(""), 3000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Resource Management</h1>
          <p className="text-gray-600">
            Upload and manage PDFs, guides, and resources
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} variant="cta" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Upload Resource
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

      {/* Resources Grid */}
      {resourceList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No resources yet</h3>
          <p className="text-gray-500 mb-6">Upload your first resource to get started</p>
          <Button onClick={() => handleOpenDialog()} variant="cta">
            <Upload className="h-5 w-5 mr-2" />
            Upload Resource
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceList.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-navy/10 rounded-lg">
                  <FileText className="h-6 w-6 text-navy" />
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  statusColors[resource.status]
                )}>
                  {resource.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {resource.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {resource.description}
              </p>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    {categoryLabels[resource.category]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(resource.fileSize)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-3 w-3" />
                  {resource.downloadCount || 0} downloads
                </div>
              </div>

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(resource)}
                  className="flex-1"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(resource.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-navy">
              {editingResource ? "Edit Resource" : "Upload New Resource"}
            </DialogTitle>
            <DialogDescription>
              {editingResource ? "Update resource details" : "Upload a PDF and fill in the details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* File Upload */}
            {!editingResource && (
              <div>
                <Label>Upload PDF File *</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragging
                      ? "border-navy bg-navy/5"
                      : "border-gray-300 hover:border-navy/50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {formData.file ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="font-medium">{formData.file.name}</span>
                      <span className="text-sm text-gray-500">
                        ({formatFileSize(formData.file.size)})
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop your PDF here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Maximum file size: 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="title">Resource Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="NRI Tax Planning Guide 2024"
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
                placeholder="Comprehensive guide covering tax planning strategies for NRIs..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guides">Investment Guides</SelectItem>
                    <SelectItem value="tax">Tax Resources</SelectItem>
                    <SelectItem value="market">Market Insights</SelectItem>
                    <SelectItem value="immigration">Immigration News</SelectItem>
                    <SelectItem value="videos">Videos & Webinars</SelectItem>
                    <SelectItem value="checklists">Checklists</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  placeholder="PDF Guide"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Tags and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="tax, NRI, guide"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading file to storage...
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting || isUploading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="cta"
                disabled={isSubmitting || isUploading || (!editingResource && !formData.file)}
                className="flex-1"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {editingResource ? "Update Resource" : "Create Resource"}
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
