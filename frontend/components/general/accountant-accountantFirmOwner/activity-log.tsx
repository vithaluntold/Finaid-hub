"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

type LogEntry = {
  id: number
  timestamp: Date
  action: string
  status: "completed" | "in-progress" | "failed"
  details: string
}

export default function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    // In a real app, this would be populated from an API or websocket
    const initialLogs: LogEntry[] = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 2 * 60000),
        action: "Reconciled bank accounts",
        status: "completed",
        details: "Successfully matched 24 transactions",
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 15 * 60000),
        action: "Generated Q2 financial report",
        status: "completed",
        details: "Report saved to documents folder",
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 45 * 60000),
        action: "Processed expense receipts",
        status: "completed",
        details: "Added 5 new expense entries",
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 120 * 60000),
        action: "Tax calculation",
        status: "completed",
        details: "Estimated quarterly taxes for Q2",
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 180 * 60000),
        action: "Anomaly detection",
        status: "completed",
        details: "Flagged 2 unusual transactions for review",
      },
      {
        id: 6,
        timestamp: new Date(),
        action: "Analyzing cash flow",
        status: "in-progress",
        details: "Preparing 6-month projection",
      },
    ]

    setLogs(initialLogs)

    // Simulate new log entries being added
    const interval = setInterval(() => {
      const actions = [
        "Updating transaction categories",
        "Checking for duplicate entries",
        "Verifying account balances",
        "Scanning new receipts",
        "Preparing monthly summary",
      ]

      const randomAction = actions[Math.floor(Math.random() * actions.length)]

      setLogs((prevLogs) => [
        {
          id: prevLogs.length + 1,
          timestamp: new Date(),
          action: randomAction,
          status: "in-progress",
          details: "Processing...",
        },
        ...prevLogs,
      ])

      // After 3 seconds, mark it as completed
      setTimeout(() => {
        setLogs((prevLogs) => {
          const updatedLogs = [...prevLogs]
          if (updatedLogs[0]) {
            updatedLogs[0] = {
              ...updatedLogs[0],
              status: "completed",
              details: "Task completed successfully",
            }
          }
          return updatedLogs
        })
      }, 3000)
    }, 15000) // Add a new log every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: LogEntry["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <ScrollArea className="h-[calc(100vh-30rem)]">
      <div className="space-y-4 pr-4">
        {logs.map((log) => (
          <div key={log.id} className="border-b pb-3 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{log.action}</span>
              <span className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{log.details}</p>
              {getStatusBadge(log.status)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
