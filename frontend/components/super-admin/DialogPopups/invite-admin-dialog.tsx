"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Plus } from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type NewAdminType = {
  first_name: string;
  last_name: string;
  email: string;
};

export function InviteAdminDialog({
  open,
  onOpenChange,
}: CreateContentDialogProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdminType>({
    first_name: "",
    last_name: "",
    email: "",
  });

  async function inviteNewAdmin() {
    setIsLoading(true);

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/admins/invite`,
        newAdmin
      );
      if (response?.data?.status === "Success") {
        showToast({ title: "Success", description: response?.data?.message });
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to invite user!",
          // variant: "error",
        });
      }
      setIsLoading(false);
      console.log(response, "invite admin api response");
      setNewAdmin({
        first_name: "",
        last_name: "",
        email: "",
      });

      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.log("Invite user error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
          <DialogDescription>Invite New Admin Here</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Enter First Name
                </Label>
                <Input
                  id="text"
                  value={newAdmin.first_name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, first_name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Enter Last Name
                </Label>
                <Input
                  id="text"
                  value={newAdmin.last_name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, last_name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Enter Admin Email
                </Label>
                <Input
                  id="email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={inviteNewAdmin}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Invite Admin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
