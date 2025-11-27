"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Sparkles,
  FileText,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Filter,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  suggestedTopics,
  getTopicsByCategory,
  getTopicsByPriority,
  searchTopics,
  getRecommendedTopics,
  type ContentTopic
} from "@/lib/content-generator-topics"

export function ContentGenerator() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<ContentTopic | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")

  // Generation options
  const [includeExamples, setIncludeExamples] = useState(true)
  const [includeFAQs, setIncludeFAQs] = useState(true)
  const [tone, setTone] = useState("professional")

  // Filter topics
  const filteredTopics = suggestedTopics.filter(topic => {
    const matchesSearch = searchQuery === "" ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || topic.priority === priorityFilter
    const matchesDifficulty = difficultyFilter === "all" || topic.difficulty === difficultyFilter

    return matchesSearch && matchesCategory && matchesPriority && matchesDifficulty
  })

  const recommendedTopics = getRecommendedTopics()

  const handleGenerateContent = async () => {
    if (!selectedTopic) return

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/admin/content/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: selectedTopic.id,
          customizations: {
            includeExamples,
            includeFAQs,
            tone,
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      setGeneratedContent(data.content)
      setShowPreview(true)

    } catch (err: any) {
      setError(err.message || "Failed to generate content")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadMarkdown = () => {
    if (!generatedContent || !selectedTopic) return

    const blob = new Blob([generatedContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTopic.title.replace(/[^a-zA-Z0-9]/g, '-')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tax': return '📊'
      case 'investment': return '💰'
      case 'immigration': return '✈️'
      case 'guides': return '📘'
      case 'checklists': return '✅'
      default: return '📄'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-gold" />
          <h1 className="text-3xl font-bold text-navy">AI Content Generator</h1>
        </div>
        <p className="text-gray-600">
          Generate comprehensive PDF guides using AI. Select a topic, customize options, and create professional content in minutes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-navy">{suggestedTopics.length}</div>
            <p className="text-sm text-gray-600">Available Topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{recommendedTopics.length}</div>
            <p className="text-sm text-gray-600">Recommended</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <p className="text-sm text-gray-600">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">AI</div>
            <p className="text-sm text-gray-600">Powered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Topic Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search topics or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="immigration">Immigration</SelectItem>
                      <SelectItem value="guides">Guides</SelectItem>
                      <SelectItem value="checklists">Checklists</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Difficulty</Label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Topics ({filteredTopics.length})</CardTitle>
              <CardDescription>
                Select a topic to generate content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border-2 transition-all hover:border-navy hover:shadow-md",
                      selectedTopic?.id === topic.id
                        ? "border-navy bg-blue-50"
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(topic.category)}</span>
                        <h3 className="font-semibold text-navy">{topic.title}</h3>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        getPriorityColor(topic.priority)
                      )}>
                        {topic.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">{topic.category}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{topic.difficulty}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{topic.estimatedLength}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <strong>Audience:</strong> {topic.targetAudience.join(', ')}
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      {topic.outline.length} sections
                    </div>
                  </button>
                ))}

                {filteredTopics.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No topics found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Generation Options & Actions */}
        <div className="space-y-4">
          {selectedTopic ? (
            <>
              {/* Selected Topic Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Topic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xl font-bold text-navy mb-2">{selectedTopic.title}</div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {selectedTopic.category}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {selectedTopic.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Length:</strong> {selectedTopic.estimatedLength}
                  </div>

                  <div className="text-sm">
                    <strong className="text-gray-700">Outline:</strong>
                    <ul className="mt-2 space-y-1 text-xs text-gray-600">
                      {selectedTopic.outline.slice(0, 5).map((section, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{section}</span>
                        </li>
                      ))}
                      {selectedTopic.outline.length > 5 && (
                        <li className="text-gray-500 italic">
                          +{selectedTopic.outline.length - 5} more sections...
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generation Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Content Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="examples"
                        checked={includeExamples}
                        onCheckedChange={(checked) => setIncludeExamples(checked as boolean)}
                      />
                      <label htmlFor="examples" className="text-sm font-medium cursor-pointer">
                        Include examples & case studies
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="faqs"
                        checked={includeFAQs}
                        onCheckedChange={(checked) => setIncludeFAQs(checked as boolean)}
                      />
                      <label htmlFor="faqs" className="text-sm font-medium cursor-pointer">
                        Include FAQ section
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full"
                variant="cta"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Generation Failed</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {generatedContent && (
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowPreview(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Content
                  </Button>

                  <Button
                    onClick={handleDownloadMarkdown}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Markdown
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a topic to begin</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      {generatedContent && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTopic?.title} - Content Preview</DialogTitle>
              <DialogDescription>
                Review the generated content. You can download it as Markdown or copy to use elsewhere.
              </DialogDescription>
            </DialogHeader>

            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                {generatedContent}
              </pre>
            </div>

            <div className="flex gap-3 mt-4">
              <Button onClick={handleDownloadMarkdown} variant="cta">
                <Download className="h-4 w-4 mr-2" />
                Download Markdown
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent)
                  alert('Content copied to clipboard!')
                }}
                variant="outline"
              >
                Copy to Clipboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
