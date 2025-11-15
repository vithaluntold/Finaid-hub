"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, FileText, Video, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"

// Sample knowledge base articles
const articles = [
  {
    id: "KB-001",
    title: "Getting Started with Fin(Ai)d Hub",
    category: "Getting Started",
    type: "guide",
    views: 1250,
    helpful: 95,
    lastUpdated: "2023-10-15",
  },
  {
    id: "KB-002",
    title: "How to Connect Your Accounting Software",
    category: "Integrations",
    type: "tutorial",
    views: 980,
    helpful: 92,
    lastUpdated: "2023-10-10",
  },
  {
    id: "KB-003",
    title: "Troubleshooting Common Connection Issues",
    category: "Troubleshooting",
    type: "guide",
    views: 1560,
    helpful: 88,
    lastUpdated: "2023-09-28",
  },
  {
    id: "KB-004",
    title: "Setting Up Team Permissions",
    category: "Administration",
    type: "tutorial",
    views: 750,
    helpful: 90,
    lastUpdated: "2023-10-05",
  },
  {
    id: "KB-005",
    title: "Understanding Fin(Ai)d Analytics",
    category: "Analytics",
    type: "guide",
    views: 820,
    helpful: 85,
    lastUpdated: "2023-09-20",
  },
  {
    id: "KB-006",
    title: "Customizing Your Dashboard",
    category: "Customization",
    type: "video",
    views: 1100,
    helpful: 94,
    lastUpdated: "2023-10-12",
  },
  {
    id: "KB-007",
    title: "Exporting Financial Reports",
    category: "Reporting",
    type: "tutorial",
    views: 890,
    helpful: 91,
    lastUpdated: "2023-09-25",
  },
  {
    id: "KB-008",
    title: "Security Best Practices",
    category: "Security",
    type: "guide",
    views: 1300,
    helpful: 96,
    lastUpdated: "2023-10-08",
  },
]

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<(typeof articles)[0] | null>(null)

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <BookOpen className="h-4 w-4" />
      case "tutorial":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search knowledge base..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedArticle ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="pl-0">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Articles
          </Button>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
              <Badge variant="outline" className="flex items-center gap-1">
                {getTypeIcon(selectedArticle.type)}
                <span className="capitalize">{selectedArticle.type}</span>
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div>Category: {selectedArticle.category}</div>
              <div>Views: {selectedArticle.views}</div>
              <div>Last Updated: {selectedArticle.lastUpdated}</div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <p>
                This is a sample article content. In a real application, this would contain the full content of the
                knowledge base article.
              </p>
              <h3>Introduction</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies,
                nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
              </p>
              <h3>Getting Started</h3>
              <p>
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
              </p>
              <h3>Advanced Usage</h3>
              <p>
                Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend
                leo. Quisque sit amet est et sapien ullamcorper pharetra.
              </p>
              <h3>Troubleshooting</h3>
              <p>
                Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget
                tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.
              </p>
            </div>

            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Was this article helpful?</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Yes
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4" />
                  No
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 p-2 rounded-md mt-0.5">{getTypeIcon(article.type)}</div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{article.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{article.views} views</span>
                          <span>•</span>
                          <span>{article.helpful}% found helpful</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles
                .filter((article) => article.type === "guide")
                .map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-2 rounded-md mt-0.5">{getTypeIcon(article.type)}</div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{article.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>{article.helpful}% found helpful</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles
                .filter((article) => article.type === "tutorial")
                .map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-2 rounded-md mt-0.5">{getTypeIcon(article.type)}</div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{article.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>{article.helpful}% found helpful</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles
                .filter((article) => article.type === "video")
                .map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-2 rounded-md mt-0.5">{getTypeIcon(article.type)}</div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{article.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>{article.helpful}% found helpful</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

