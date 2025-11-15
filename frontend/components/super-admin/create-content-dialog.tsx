"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Video, Music, Code, Link, Youtube, ExternalLink } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CreateContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateContentDialog({ open, onOpenChange }: CreateContentDialogProps) {
  const [newContent, setNewContent] = useState({
    title: "",
    type: "article",
    category: "Getting Started",
    description: "",
    content: "",
    mediaType: "none", // none, upload, embed
    videoUrl: "",
    vimeoUrl: "",
    youtubeUrl: "",
    documentUrl: "",
    audioUrl: "",
    htmlContent: "",
  })

  const [selectedFiles, setSelectedFiles] = useState<{
    video: File | null
    audio: File | null
    document: File | null
    html: File | null
  }>({
    video: null,
    audio: null,
    document: null,
    html: null,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "audio" | "document" | "html") => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles({
        ...selectedFiles,
        [type]: e.target.files[0],
      })
    }
  }

  const handleCreateContent = () => {
    // In a real application, this would send the data to an API
    // including file uploads using FormData
    console.log("Creating new content:", newContent)
    console.log("Selected files:", selectedFiles)

    // Reset form and close dialog
    setNewContent({
      title: "",
      type: "article",
      category: "Getting Started",
      description: "",
      content: "",
      mediaType: "none",
      videoUrl: "",
      vimeoUrl: "",
      youtubeUrl: "",
      documentUrl: "",
      audioUrl: "",
      htmlContent: "",
    })
    setSelectedFiles({
      video: null,
      audio: null,
      document: null,
      html: null,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>Add new educational content to the platform</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media & Files</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newContent.type}
                  onValueChange={(value) =>
                    setNewContent({ ...newContent, type: value as "article" | "video" | "course" })
                  }
                >
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newContent.category}
                  onValueChange={(value) => setNewContent({ ...newContent, category: value })}
                >
                  <SelectTrigger id="category" className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Getting Started">Getting Started</SelectItem>
                    <SelectItem value="Tutorials">Tutorials</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Tax">Tax</SelectItem>
                    <SelectItem value="Client Management">Client Management</SelectItem>
                    <SelectItem value="Reporting">Reporting</SelectItem>
                    <SelectItem value="Ethics">Ethics</SelectItem>
                    <SelectItem value="Integrations">Integrations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Media Type</Label>
                <div className="col-span-3">
                  <RadioGroup
                    value={newContent.mediaType}
                    onValueChange={(value) => setNewContent({ ...newContent, mediaType: value })}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="media-none" />
                      <Label htmlFor="media-none">No Media</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upload" id="media-upload" />
                      <Label htmlFor="media-upload">Upload Files</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="embed" id="media-embed" />
                      <Label htmlFor="media-embed">Embed External Media</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {newContent.mediaType === "upload" && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="video-upload" className="text-right flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, "video")}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Supported formats: MP4, WebM, MOV (max 500MB)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="audio-upload" className="text-right flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          Audio
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="audio-upload"
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileChange(e, "audio")}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Supported formats: MP3, WAV, OGG (max 100MB)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="document-upload" className="text-right flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Document
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="document-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            onChange={(e) => handleFileChange(e, "document")}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (max 50MB)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="html-upload" className="text-right flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          HTML
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="html-upload"
                            type="file"
                            accept=".html,.htm"
                            onChange={(e) => handleFileChange(e, "html")}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Supported formats: HTML, HTM (max 10MB)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {newContent.mediaType === "embed" && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="youtube-url" className="text-right flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="youtube-url"
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={newContent.youtubeUrl}
                            onChange={(e) => setNewContent({ ...newContent, youtubeUrl: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Enter the full YouTube video URL</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vimeo-url" className="text-right flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Vimeo
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="vimeo-url"
                            type="url"
                            placeholder="https://vimeo.com/..."
                            value={newContent.vimeoUrl}
                            onChange={(e) => setNewContent({ ...newContent, vimeoUrl: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Enter the full Vimeo video URL</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="external-url" className="text-right flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          External URL
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="external-url"
                            type="url"
                            placeholder="https://..."
                            value={newContent.videoUrl}
                            onChange={(e) => setNewContent({ ...newContent, videoUrl: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Enter any external URL to embed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  className="col-span-3"
                  rows={10}
                  placeholder="Enter the main content text here..."
                />
              </div>

              {newContent.type === "article" && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="html-content" className="text-right pt-2">
                    HTML Content
                  </Label>
                  <Textarea
                    id="html-content"
                    value={newContent.htmlContent}
                    onChange={(e) => setNewContent({ ...newContent, htmlContent: e.target.value })}
                    className="col-span-3 font-mono text-sm"
                    rows={10}
                    placeholder="<p>Enter HTML content here...</p>"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleCreateContent}>
            Create Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

