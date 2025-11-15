"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TeamMembers({ accountantList }) {
  return (
    <div className="space-y-4">
      {accountantList?.length > 0 &&
        accountantList?.map((member) => (
          <div
            key={member?._id}
            className="flex items-center gap-4 p-2 rounded-md hover:bg-muted"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40`}
                alt={member?.first_name}
              />
              <AvatarFallback>{member?.first_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium">
                {member?.first_name + " " + member?.last_name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {/* Accountant • {member.team} */}
                Accountant • {member?.email}
              </div>
            </div>
            <Badge
              // variant={member?.status === "online" ? "default" : "outline"}
              variant={member?.status === "invited" ? "default" : "outline"}
              className="ml-auto"
            >
              {member?.status}
            </Badge>
          </div>
        ))}
    </div>
  );
}
