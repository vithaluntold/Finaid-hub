"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Edit, Trash2, FileText, Video, BookOpen, BarChart, Music, File } from "lucide-react"

// Sample content data
const allContent = [
  {
    id: "CONT-001",
    title: "Introduction to Fin(Ai)d Hub",
    type: "article",
    category: "Getting Started",
    author: "John Smith",
    publishDate: "2023-10-15",
    status: "published",
    views: 1250,
    avgEngagement: "3.2m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "Learn the basics of Fin(Ai)d Hub and how it can transform your accounting processes.",
    content: "Fin(Ai)d Hub is a revolutionary platform that combines AI with accounting expertise...",
  },
  {
    id: "CONT-002",
    title: "Setting Up Your First Fin(Ai)d",
    type: "video",
    category: "Tutorials",
    author: "Jane Doe",
    publishDate: "2023-09-28",
    status: "published",
    views: 3450,
    avgEngagement: "5.7m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "A step-by-step guide to setting up and deploying your first Fin(Ai)d agent.",
    content: "https://example.com/videos/setting-up-finaid",
  },
  {
    id: "CONT-003",
    title: "Advanced Bookkeeping with AI",
    type: "course",
    category: "Advanced",
    author: "Robert Johnson",
    publishDate: "2023-08-15",
    status: "published",
    views: 2100,
    avgEngagement: "12.5m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "Master advanced bookkeeping techniques using Fin(Ai)d Hub's AI capabilities.",
    content: "This comprehensive course covers advanced bookkeeping techniques...",
  },
  {
    id: "CONT-004",
    title: "Tax Automation Strategies",
    type: "article",
    category: "Tax",
    author: "Emily Davis",
    publishDate: "2023-10-05",
    status: "published",
    views: 1850,
    avgEngagement: "4.1m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "Learn how to automate tax preparation and filing using Fin(Ai)d Hub.",
    content: "Tax season doesn't have to be stressful. With Fin(Ai)d Hub's automation capabilities...",
  },
  {
    id: "CONT-005",
    title: "Client Onboarding Best Practices",
    type: "video",
    category: "Client Management",
    author: "Michael Wilson",
    publishDate: "2023-09-10",
    status: "published",
    views: 2750,
    avgEngagement: "6.3m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "Discover the most effective ways to onboard new clients to your Fin(Ai)d Hub system.",
    content: "https://example.com/videos/client-onboarding",
  },
  {
    id: "CONT-006",
    title: "Financial Reporting Mastery",
    type: "course",
    category: "Reporting",
    author: "Sarah Johnson",
    publishDate: "2023-07-20",
    status: "published",
    views: 1950,
    avgEngagement: "15.2m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "A comprehensive course on creating and analyzing financial reports with Fin(Ai)d Hub.",
    content: "This course will teach you everything you need to know about financial reporting...",
  },
  {
    id: "CONT-007",
    title: "AI Ethics in Accounting",
    type: "article",
    category: "Ethics",
    author: "David Brown",
    publishDate: "2023-10-12",
    status: "draft",
    views: 0,
    avgEngagement: "0m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "Explore the ethical considerations of using AI in accounting and financial services.",
    content: "As AI becomes more prevalent in accounting, it's important to consider the ethical implications...",
  },
  {
    id: "CONT-008",
    title: "Integrating Fin(Ai)d with QuickBooks",
    type: "video",
    category: "Integrations",
    author: "Lisa Chen",
    publishDate: "2023-09-05",
    status: "published",
    views: 3200,
    avgEngagement: "7.8m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "Learn how to seamlessly integrate Fin(Ai)d Hub with your existing QuickBooks setup.",
    content: "https://example.com/videos/quickbooks-integration",
  },
  {
    id: "CONT-009",
    title: "Understanding Financial Statements",
    type: "audio",
    category: "Tutorials",
    author: "Mark Thompson",
    publishDate: "2023-08-22",
    status: "published",
    views: 1850,
    avgEngagement: "8.3m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "A comprehensive audio guide to understanding financial statements.",
    content: "https://example.com/audio/financial-statements",
  },
  {
    id: "CONT-010",
    title: "Tax Filing Checklist",
    type: "document",
    category: "Tax",
    author: "Jennifer Adams",
    publishDate: "2023-09-18",
    status: "published",
    views: 2450,
    avgEngagement: "2.1m",
    thumbnail: "/placeholder.svg?height=32&width=32",
    description: "A downloadable checklist for tax filing season.",
    content: "https://example.com/documents/tax-checklist.pdf",
  },
]

interface ContentListProps {
  contentType?: "article" | "video" | "course" | "audio" | "document"
}

export function ContentList({ contentType }: ContentListProps) {
  const [selectedContent, setSelectedContent] = useState<(typeof allContent)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter content based on type if contentType is provided
  const content = contentType ? allContent.filter((item) => item.type === contentType) : allContent

  const handleViewDetails = (contentItem: (typeof allContent)[0]) => {
    setSelectedContent(contentItem)
    setIsDetailsOpen(true)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "document":
        return <File className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.thumbnail} alt={item.title} />
                    <AvatarFallback>{getContentTypeIcon(item.type)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      By {item.author} • {item.publishDate}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "published" ? "default" : item.status === "draft" ? "outline" : "secondary"}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.views.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(item)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Content Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
            <DialogDescription>View and manage content details</DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedContent.thumbnail} alt={selectedContent.title} />
                    <AvatarFallback className="text-lg">{getContentTypeIcon(selectedContent.type)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedContent.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      By {selectedContent.author} • {selectedContent.publishDate}
                    </p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedContent.type}
                      </Badge>
                      <Badge
                        variant={
                          selectedContent.status === "published"
                            ? "default"
                            : selectedContent.status === "draft"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {selectedContent.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                    <p className="text-sm">{selectedContent.description}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedContent.views.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total Views</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedContent.avgEngagement}</div>
                        <p className="text-xs text-muted-foreground">Avg. Engagement</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedContent.category}</div>
                        <p className="text-xs text-muted-foreground">Category</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    {selectedContent.type === "video" ? (
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <span className="sr-only">Video content</span>
                      </div>
                    ) : selectedContent.type === "audio" ? (
                      <div className="bg-muted rounded-md p-6 flex items-center justify-center">
                        <Music className="h-12 w-12 text-muted-foreground" />
                        <span className="sr-only">Audio content</span>
                      </div>
                    ) : selectedContent.type === "document" ? (
                      <div className="bg-muted rounded-md p-6 flex items-center justify-center">
                        <File className="h-12 w-12 text-muted-foreground" />
                        <span className="sr-only">Document content</span>
                      </div>
                    ) : (
                      <div className="prose max-w-none dark:prose-invert">
                        <p>{selectedContent.content}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                      <div className="text-center">
                        <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Content analytics visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

