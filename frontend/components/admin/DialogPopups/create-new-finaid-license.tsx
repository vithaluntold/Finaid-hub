"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Plus, Upload } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { backendBaseURL } from "@/assets/constants/constant";
import { useToast } from "@/hooks/use-toast";

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setLocalLoading: (open: boolean) => void;
  finaidProfileID: string;
}

export function CreateNewFinaidLicense({
  open,
  onOpenChange,
  setLocalLoading,
  finaidProfileID,
}: CreateContentDialogProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newFinaidProfileLicense, setnewFinaidProfileLicenseLicense] = useState(
    {}
  );

  // functions

  const createNewFinaidLicense = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    newFinaidProfileLicense.finaid_profile_id = finaidProfileID;

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/licensing-master`,
        newFinaidProfileLicense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Create New Finaid license API response");
      if (response?.data?.data?._id) {
        showToast({
          title: "Created Successfully!",
          description: response?.data?.message,
        });
        onOpenChange(false);
        setLocalLoading((prev) => !prev);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to Create New Finaid license!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to Create New Finaid!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Finaid License</DialogTitle>
          {/* <DialogDescription>Create a New Finaid License.</DialogDescription> */}
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={newFinaidProfileLicense.name}
              onChange={(e) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, title: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="flex space-y-2 items-center gap-6">
            <Label htmlFor="name" className="text-right">
              Description
            </Label>
            <Textarea
              className="w-full"
              id="description"
              value={newFinaidProfileLicense.description}
              onChange={(e) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }
              placeholder="Enter description here..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <Input
              id="name"
              value={newFinaidProfileLicense.amount}
              onChange={(e) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, amount: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Frequency
            </Label>
            <Select
              value={newFinaidProfileLicense?.currency}
              onValueChange={(value) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, currency: value };
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Currency
            </Label>

            <Select
              value={newFinaidProfileLicense?.frequency}
              onValueChange={(value) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, frequency: value };
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_month">Per Month</SelectItem>
                <SelectItem value="per_execution">Per Execution</SelectItem>
                <SelectItem value="per_transaction">Per Transaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Duration in Days
            </Label>
            <Input
              id="name"
              value={newFinaidProfileLicense?.duration_in_days}
              onChange={(e) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, duration_in_days: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Request Limit
            </Label>
            <Input
              id="name"
              value={newFinaidProfileLicense?.request_limit}
              onChange={(e) =>
                setnewFinaidProfileLicenseLicense((prev) => {
                  return { ...prev, request_limit: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={createNewFinaidLicense}
          >
            {isLoading ? "Loading..." : "Create Finaid License"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
