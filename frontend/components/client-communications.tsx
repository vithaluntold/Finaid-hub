"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MessageSquare, Plus } from "lucide-react"

type Communication = {
  id: string
  type: "email" | "phone" | "meeting" | "note"
  subject: string
  content: string
  date: Date
  from: string
  to: string
  status: "sent" | "received" | "scheduled"
}

type ClientCommunicationsProps = {
  clientId: string
}

export default function ClientCommunications({ clientId }: ClientCommunicationsProps) {
  const { showToast } = useToast();
  const [communications, setCommunications] = useState<Communication[]>([])
  const [newNote, setNewNote] = useState("")

  // Dialog states
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);

  // Form states
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const [callForm, setCallForm] = useState({
    duration: "",
    notes: "",
    outcome: "",
  });

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    notes: "",
  });

  useEffect(() => {
    // In a real app, this would fetch from an API based on clientId
    const generateCommunications = () => {
      const types: Communication["type"][] = ["email", "phone", "meeting", "note"]
      const subjects = [
        "Payment reminder for Invoice INV-001",
        "Monthly check-in call",
        "Project status update",
        "Contract renewal discussion",
        "Payment received confirmation",
        "Meeting follow-up",
        "Service inquiry",
        "Technical support request",
      ]

      const contents = [
        "Discussed project timeline and deliverables. Client is satisfied with progress.",
        "Sent payment reminder for overdue invoice. Client confirmed payment will be processed this week.",
        "Scheduled follow-up meeting to review quarterly results.",
        "Client requested additional services for next quarter.",
        "Confirmed receipt of payment. Updated account balance.",
        "Addressed technical questions about the new system implementation.",
        "Provided pricing information for additional consulting hours.",
        "Reviewed contract terms for renewal period.",
      ]

      const people = ["Sarah Johnson", "John Smith", "Mike Chen", "System"]

      const result: Communication[] = []

      for (let i = 0; i < 20; i++) {
        const commDate = new Date()
        commDate.setDate(commDate.getDate() - Math.floor(Math.random() * 30))

        const type = types[Math.floor(Math.random() * types.length)]
        const from = Math.random() > 0.5 ? "Sarah Johnson" : "John Smith"
        const to = from === "Sarah Johnson" ? "John Smith" : "Sarah Johnson"

        const communication: Communication = {
          id: `${clientId}-comm-${i}`,
          type,
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          content: contents[Math.floor(Math.random() * contents.length)],
          date: commDate,
          from,
          to,
          status: Math.random() > 0.8 ? "scheduled" : Math.random() > 0.5 ? "sent" : "received",
        }

        result.push(communication)
      }

      return result.sort((a, b) => b.date.getTime() - a.date.getTime())
    }

    setCommunications(generateCommunications())
  }, [clientId])

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Communication = {
        id: `${clientId}-comm-${Date.now()}`,
        type: "note",
        subject: "Internal note",
        content: newNote,
        date: new Date(),
        from: "Sarah Johnson",
        to: "Internal",
        status: "sent",
      }

      setCommunications([note, ...communications])
      setNewNote("")
      showToast({
        title: "Success",
        description: "Note added successfully",
      })
    }
  }

  const handleSendEmail = () => {
    if (!emailForm.to || !emailForm.subject) {
      showToast({
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const email: Communication = {
      id: `${clientId}-comm-${Date.now()}`,
      type: "email",
      subject: emailForm.subject,
      content: emailForm.body,
      date: new Date(),
      from: "Sarah Johnson",
      to: emailForm.to,
      status: "sent",
    }

    setCommunications([email, ...communications])
    showToast({
      title: "Success",
      description: "Email sent successfully",
    })
    setIsEmailDialogOpen(false)
    setEmailForm({ to: "", subject: "", body: "" })
  }

  const handleLogCall = () => {
    if (!callForm.duration || !callForm.outcome) {
      showToast({
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const call: Communication = {
      id: `${clientId}-comm-${Date.now()}`,
      type: "phone",
      subject: `Phone call - ${callForm.duration} minutes`,
      content: `Outcome: ${callForm.outcome}\n\nNotes: ${callForm.notes}`,
      date: new Date(),
      from: "Sarah Johnson",
      to: "Client",
      status: "sent",
    }

    setCommunications([call, ...communications])
    showToast({
      title: "Success",
      description: "Call logged successfully",
    })
    setIsCallDialogOpen(false)
    setCallForm({ duration: "", notes: "", outcome: "" })
  }

  const handleScheduleMeeting = () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
      showToast({
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    const meeting: Communication = {
      id: `${clientId}-comm-${Date.now()}`,
      type: "meeting",
      subject: meetingForm.title,
      content: `Date: ${meetingForm.date} at ${meetingForm.time}\nDuration: ${meetingForm.duration}\n\nNotes: ${meetingForm.notes}`,
      date: new Date(),
      from: "Sarah Johnson",
      to: "Client",
      status: "sent",
    }

    setCommunications([meeting, ...communications])
    showToast({
      title: "Success",
      description: "Meeting scheduled successfully",
    })
    setIsMeetingDialogOpen(false)
    setMeetingForm({ title: "", date: "", time: "", duration: "", notes: "" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: Communication["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "meeting":
        return <MessageSquare className="h-4 w-4" />
      case "note":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: Communication["type"]) => {
    switch (type) {
      case "email":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Email
          </Badge>
        )
      case "phone":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Phone
          </Badge>
        )
      case "meeting":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Meeting
          </Badge>
        )
      case "note":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Note
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: Communication["status"]) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500">Sent</Badge>
      case "received":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Received
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Scheduled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Communication */}
      <Card>
        <CardHeader>
          <CardTitle>Add Communication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add a note about this client..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEmailDialogOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsCallDialogOpen(true)}>
                <Phone className="mr-2 h-4 w-4" />
                Log Call
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsMeetingDialogOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
            <Button onClick={handleAddNote} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {communications.map((comm) => (
                <div key={comm.id} className="flex space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {comm.from
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(comm.type)}
                        <h4 className="font-medium">{comm.subject}</h4>
                        {getTypeBadge(comm.type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(comm.status)}
                        <span className="text-sm text-muted-foreground">{formatDate(comm.date)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From: {comm.from} → To: {comm.to}
                    </p>
                    <p className="text-sm">{comm.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to the client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To (Email Address) *</Label>
              <Input
                id="email-to"
                type="email"
                placeholder="client@example.com"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                placeholder="Email subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                placeholder="Email message"
                value={emailForm.body}
                onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Call</DialogTitle>
            <DialogDescription>
              Record details of a phone call with the client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="call-duration">Duration (minutes) *</Label>
              <Input
                id="call-duration"
                type="number"
                placeholder="30"
                value={callForm.duration}
                onChange={(e) => setCallForm({ ...callForm, duration: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="call-outcome">Outcome *</Label>
              <Input
                id="call-outcome"
                placeholder="e.g., Resolved payment issue"
                value={callForm.outcome}
                onChange={(e) => setCallForm({ ...callForm, outcome: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="call-notes">Call Notes</Label>
              <Textarea
                id="call-notes"
                placeholder="Additional notes about the call"
                value={callForm.notes}
                onChange={(e) => setCallForm({ ...callForm, notes: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCallDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogCall}>Log Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Schedule a meeting with the client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title *</Label>
              <Input
                id="meeting-title"
                placeholder="e.g., Quarterly Review"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meeting-date">Date *</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="meeting-time">Time *</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingForm.time}
                  onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="meeting-duration">Duration (minutes)</Label>
              <Input
                id="meeting-duration"
                type="number"
                placeholder="60"
                value={meetingForm.duration}
                onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="meeting-notes">Agenda/Notes</Label>
              <Textarea
                id="meeting-notes"
                placeholder="Meeting agenda or notes"
                value={meetingForm.notes}
                onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMeetingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
