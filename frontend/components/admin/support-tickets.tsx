"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { EyeIcon, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"

// Sample ticket data
const tickets = [
  {
    id: "TKT-001",
    subject: "Cannot connect Fin(Ai)d to QuickBooks",
    client: "Acme Corporation",
    clientAvatar: "/placeholder.svg?height=32&width=32",
    status: "open",
    priority: "high",
    createdAt: "2023-11-08T14:32:15",
    lastUpdated: "2023-11-09T10:15:22",
    assignedTo: "John Doe",
    messages: [
      {
        id: "MSG-001",
        sender: "Jane Smith",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "We're having trouble connecting our Fin(Ai)d to our QuickBooks account. We keep getting an authentication error.",
        timestamp: "2023-11-08T14:32:15",
        isClient: true,
      },
      {
        id: "MSG-002",
        sender: "John Doe",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "I'll look into this right away. Could you please provide your QuickBooks account ID and the exact error message you're seeing?",
        timestamp: "2023-11-09T10:15:22",
        isClient: false,
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Need help with tax automation setup",
    client: "Globex Inc",
    clientAvatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
    priority: "medium",
    createdAt: "2023-11-07T09:45:30",
    lastUpdated: "2023-11-08T11:20:15",
    assignedTo: "Sarah Johnson",
    messages: [
      {
        id: "MSG-003",
        sender: "Michael Bolton",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "We need assistance setting up the tax automation feature for our business. We have specific requirements for our industry.",
        timestamp: "2023-11-07T09:45:30",
        isClient: true,
      },
      {
        id: "MSG-004",
        sender: "Sarah Johnson",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "I'd be happy to help with your tax automation setup. Could you please provide more details about your industry and specific requirements?",
        timestamp: "2023-11-08T11:20:15",
        isClient: false,
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "Error when generating monthly report",
    client: "Umbrella Corp",
    clientAvatar: "/placeholder.svg?height=32&width=32",
    status: "open",
    priority: "medium",
    createdAt: "2023-11-09T16:20:45",
    lastUpdated: "2023-11-09T16:20:45",
    assignedTo: "Unassigned",
    messages: [
      {
        id: "MSG-005",
        sender: "Albert Wesker",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "We're getting an error when trying to generate our monthly financial report. The system shows 'Error: Data inconsistency detected'.",
        timestamp: "2023-11-09T16:20:45",
        isClient: true,
      },
    ],
  },
  {
    id: "TKT-004",
    subject: "Need to add more users to our account",
    client: "Stark Industries",
    clientAvatar: "/placeholder.svg?height=32&width=32",
    status: "resolved",
    priority: "low",
    createdAt: "2023-11-05T11:10:25",
    lastUpdated: "2023-11-06T14:35:40",
    assignedTo: "Emily Davis",
    messages: [
      {
        id: "MSG-006",
        sender: "Tony Stark",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "We need to add 5 more users to our account. How do we proceed with this?",
        timestamp: "2023-11-05T11:10:25",
        isClient: true,
      },
      {
        id: "MSG-007",
        sender: "Emily Davis",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "I can help you add more users to your account. I've sent you an invoice for the additional user licenses. Once payment is processed, the users will be added automatically.",
        timestamp: "2023-11-06T09:22:18",
        isClient: false,
      },
      {
        id: "MSG-008",
        sender: "Tony Stark",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content: "Payment has been sent. Thank you for your help!",
        timestamp: "2023-11-06T13:45:30",
        isClient: true,
      },
      {
        id: "MSG-009",
        sender: "Emily Davis",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "The payment has been received and the additional users have been added to your account. Please let me know if you need anything else!",
        timestamp: "2023-11-06T14:35:40",
        isClient: false,
      },
    ],
  },
  {
    id: "TKT-005",
    subject: "Feature request: Custom dashboard widgets",
    client: "Wayne Enterprises",
    clientAvatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
    priority: "low",
    createdAt: "2023-11-06T15:30:20",
    lastUpdated: "2023-11-07T09:15:10",
    assignedTo: "Michael Wilson",
    messages: [
      {
        id: "MSG-010",
        sender: "Bruce Wayne",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "We would like to request a feature for custom dashboard widgets. Our team needs to monitor specific metrics that aren't currently available.",
        timestamp: "2023-11-06T15:30:20",
        isClient: true,
      },
      {
        id: "MSG-011",
        sender: "Michael Wilson",
        senderAvatar: "/placeholder.svg?height=32&width=32",
        content:
          "Thank you for your feature request. I've forwarded this to our product team for consideration. They'll evaluate the request and get back to you with more information about potential implementation.",
        timestamp: "2023-11-07T09:15:10",
        isClient: false,
      },
    ],
  },
]

export function SupportTickets() {
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleViewDetails = (ticket: (typeof tickets)[0]) => {
    setSelectedTicket(ticket)
    setIsDetailsOpen(true)
  }

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return

    // In a real app, this would send the reply to an API
    console.log(`Sending reply to ticket ${selectedTicket.id}: ${replyText}`)

    // Reset the reply text
    setReplyText("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <div>{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground">{ticket.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={ticket.clientAvatar} alt={ticket.client} />
                    <AvatarFallback>{ticket.client.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>{ticket.client}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={ticket.status === "open" ? "default" : ticket.status === "pending" ? "outline" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(ticket.status)}
                  <span className="capitalize">{ticket.status}</span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    ticket.priority === "high"
                      ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                      : ticket.priority === "medium"
                        ? "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
                        : "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                  }
                >
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(ticket.lastUpdated)}</TableCell>
              <TableCell>{ticket.assignedTo}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(ticket)}>
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Reply</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Ticket Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>View and respond to support ticket</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <Tabs defaultValue="conversation" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="conversation">Conversation</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="conversation" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.isClient ? "flex-row" : "flex-row-reverse"}`}
                    >
                      <Avatar className="h-10 w-10 mt-0.5">
                        <AvatarImage src={message.senderAvatar} alt={message.sender} />
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 rounded-lg p-4 ${
                          message.isClient ? "bg-muted" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{message.sender}</div>
                          <div className="text-xs opacity-70">{formatDate(message.timestamp)}</div>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-between">
                      <Button variant="outline">Attach File</Button>
                      <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Ticket ID</div>
                    <div>{selectedTicket.id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Status</div>
                    <Badge
                      variant={
                        selectedTicket.status === "open"
                          ? "default"
                          : selectedTicket.status === "pending"
                            ? "outline"
                            : "secondary"
                      }
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(selectedTicket.status)}
                      <span className="capitalize">{selectedTicket.status}</span>
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Created</div>
                    <div>{formatDate(selectedTicket.createdAt)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Last Updated</div>
                    <div>{formatDate(selectedTicket.lastUpdated)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Client</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedTicket.clientAvatar} alt={selectedTicket.client} />
                        <AvatarFallback>{selectedTicket.client.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedTicket.client}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Assigned To</div>
                    <div>{selectedTicket.assignedTo}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Priority</div>
                    <Badge
                      variant="outline"
                      className={
                        selectedTicket.priority === "high"
                          ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                          : selectedTicket.priority === "medium"
                            ? "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
                            : "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                      }
                    >
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="text-sm font-medium">Subject</div>
                  <div className="text-lg">{selectedTicket.subject}</div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Change Status
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Assign Ticket
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Change Priority
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

