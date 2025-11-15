"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UsersIcon, Edit, Trash2, Plus, UserPlus } from "lucide-react"

// Sample team data
const teams = [
  {
    id: "TEAM001",
    name: "Bookkeeping Team",
    lead: "Emily Davis",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    members: 8,
    clients: 24,
    status: "active",
  },
  {
    id: "TEAM002",
    name: "Tax Team",
    lead: "Michael Wilson",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    members: 6,
    clients: 18,
    status: "active",
  },
  {
    id: "TEAM003",
    name: "Audit Team",
    lead: "Sarah Johnson",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    members: 5,
    clients: 12,
    status: "active",
  },
  {
    id: "TEAM004",
    name: "Advisory Team",
    lead: "Robert Brown",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    members: 4,
    clients: 10,
    status: "active",
  },
  {
    id: "TEAM005",
    name: "Client Onboarding",
    lead: "Jennifer Lee",
    leadAvatar: "/placeholder.svg?height=32&width=32",
    members: 3,
    clients: 0,
    status: "inactive",
  },
]

export function TeamManagement() {
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false)
  const [teamList, setTeamList] = useState(teams)
  const [newTeam, setNewTeam] = useState({
    name: "",
    lead: "",
  })

  const handleAddTeam = () => {
    const team = {
      id: `TEAM${String(teamList.length + 1).padStart(3, "0")}`,
      name: newTeam.name,
      lead: newTeam.lead,
      leadAvatar: "/placeholder.svg?height=32&width=32",
      members: 1,
      clients: 0,
      status: "active",
    }

    setTeamList([...teamList, team])
    setNewTeam({
      name: "",
      lead: "",
    })
    setIsAddTeamDialogOpen(false)
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeamList(teamList.filter((team) => team.id !== teamId))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team List</h2>
          <p className="text-sm text-muted-foreground">Manage your teams and their assignments</p>
        </div>
        <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team and assign a team lead. You can add more members later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team-name" className="text-right">
                  Team Name
                </Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team-lead" className="text-right">
                  Team Lead
                </Label>
                <Select value={newTeam.lead} onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}>
                  <SelectTrigger id="team-lead" className="col-span-3">
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                    <SelectItem value="Michael Wilson">Michael Wilson</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Robert Brown">Robert Brown</SelectItem>
                    <SelectItem value="Jennifer Lee">Jennifer Lee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTeam}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Team Lead</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamList.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <UsersIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>{team.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={team.leadAvatar} alt={team.lead} />
                    <AvatarFallback>{team.lead.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>{team.lead}</div>
                </div>
              </TableCell>
              <TableCell>{team.members}</TableCell>
              <TableCell>{team.clients}</TableCell>
              <TableCell>
                <Badge
                  variant={team.status === "active" ? "default" : team.status === "inactive" ? "outline" : "secondary"}
                >
                  {team.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <UserPlus className="h-4 w-4" />
                    <span className="sr-only">Add member</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTeam(team.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

