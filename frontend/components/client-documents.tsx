"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Download, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Document = {
  id: string
  name: string
  type: "contract" | "invoice" | "receipt" | "statement" | "other"
  size: string
  uploadDate: Date
  uploadedBy: string
}

type ClientDocumentsProps = {
  clientId: string
}

export default function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const { showToast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "other" as Document["type"],
    file: null as File | null,
  })

  useEffect(() => {
    // In a real app, this would fetch from an API based on clientId
    const generateDocuments = () => {
      const types: Document["type"][] = ["contract", "invoice", "receipt", "statement", "other"]
      const names = [
        "Service Agreement 2023.pdf",
        "Invoice INV-001.pdf",
        "Payment Receipt.pdf",
        "Monthly Statement.pdf",
        "Tax Documents.pdf",
        "Project Proposal.docx",
        "Meeting Notes.docx",
        "Contract Amendment.pdf",
        "Purchase Order.pdf",
        "Expense Report.xlsx",
      ]

      const uploaders = ["Sarah Johnson", "Mike Chen", "System", "John Doe"]

      const result: Document[] = []

      for (let i = 0; i < 12; i++) {
        const uploadDate = new Date()
        uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 60))

        const document: Document = {
          id: `${clientId}-doc-${i}`,
          name: names[Math.floor(Math.random() * names.length)],
          type: types[Math.floor(Math.random() * types.length)],
          size: `${Math.floor(Math.random() * 5000 + 100)} KB`,
          uploadDate,
          uploadedBy: uploaders[Math.floor(Math.random() * uploaders.length)],
        }

        result.push(document)
      }

      return result
    }

    setDocuments(generateDocuments())
  }, [clientId])

  const handleUploadDocument = () => {
    if (!uploadForm.name || !uploadForm.file) {
      showToast({
        title: "Error",
        description: "Please fill in all required fields and select a file",
      })
      return
    }

    const newDocument: Document = {
      id: `${clientId}-doc-${Date.now()}`,
      name: uploadForm.name,
      type: uploadForm.type,
      size: `${Math.round(uploadForm.file.size / 1024)} KB`,
      uploadDate: new Date(),
      uploadedBy: "Current User",
    }

    setDocuments([newDocument, ...documents])
    showToast({
      title: "Success",
      description: "Document uploaded successfully",
    })
    setIsUploadDialogOpen(false)
    setUploadForm({ name: "", type: "other", file: null })
  }

  const handleDeleteDocument = (documentId: string, documentName: string) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId))
    showToast({
      title: "Success",
      description: `"${documentName}" deleted successfully`,
    })
  }

  const handleDownloadDocument = (documentName: string) => {
    showToast({
      title: "Download Started",
      description: `Downloading "${documentName}"`,
    })
  }

  const handleViewDocument = (documentName: string) => {
    showToast({
      title: "Opening Document",
      description: `Opening "${documentName}"`,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTypeBadge = (type: Document["type"]) => {
    switch (type) {
      case "contract":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Contract
          </Badge>
        )
      case "invoice":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Invoice
          </Badge>
        )
      case "receipt":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Receipt
          </Badge>
        )
      case "statement":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Statement
          </Badge>
        )
      case "other":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Other
          </Badge>
        )
      default:
        return null
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return <FileText className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Documents</CardTitle>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(document.name)}
                  <div>
                    <h4 className="font-medium">{document.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{document.size}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(document.uploadDate)}</span>
                      <span>•</span>
                      <span>by {document.uploadedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeBadge(document.type)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDocument(document.name)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadDocument(document.name)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteDocument(document.id, document.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document for this client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-name">Document Name *</Label>
              <Input
                id="document-name"
                placeholder="e.g., Service Agreement 2024.pdf"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="document-type">Document Type *</Label>
              <Select
                value={uploadForm.type}
                onValueChange={(value) => setUploadForm({ ...uploadForm, type: value as Document["type"] })}
              >
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="statement">Statement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="document-file">File *</Label>
              <Input
                id="document-file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setUploadForm({ ...uploadForm, file })
                }}
              />
              {uploadForm.file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {uploadForm.file.name} ({Math.round(uploadForm.file.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
