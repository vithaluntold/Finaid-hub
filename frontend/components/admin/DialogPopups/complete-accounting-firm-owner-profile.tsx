"use client";

import type React from "react";
import { useRef, useState } from "react";
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
}

export function CompleteAccountingFirmOwnerProfile({
  open,
  onOpenChange,
  setLocalLoading,
}: CreateContentDialogProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newAccountingFirmOwner, setNewAccountingFirmOwner] = useState({
    company_name: "",
    company_address: "",
    website: "",
    industry: "",
    firm_size: "",
    tax_id: "",
  });

  // functions

  const updateAccountingFirmOwner = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let response = await axios.put(
        `${backendBaseURL}/api/v1/users/complete-accounting-owner-profile`,
        newAccountingFirmOwner,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Create New accounting firm owner API response");
      if (response?.status === 200) {
        showToast({
          title: "Updated Successfully!",
          description: response?.data?.message,
        });
        onOpenChange(false);
        setLocalLoading((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to update accounting firm owner!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to update accounting firm owner!");
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAccountingFirmOwner({
      ...newAccountingFirmOwner,
      [name]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Complete Accounting Firm Owner Form</DialogTitle>
          <DialogDescription>Update Accouting firm owner.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company_name" className="text-right">
              Company Name
            </Label>
            <Input
              id="company_name"
              placeholder="Enter company name..."
              value={newAccountingFirmOwner.company_name}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, company_name: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company_address" className="text-right">
              Company Address
            </Label>
            <Input
              id="company_address"
              placeholder="Enter company address..."
              value={newAccountingFirmOwner.company_address}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, company_address: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input
              id="website"
              placeholder="Enter website..."
              value={newAccountingFirmOwner.website}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, website: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">
              Industry
            </Label>
            <Input
              id="industry"
              placeholder="Enter industry..."
              value={newAccountingFirmOwner.industry}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, industry: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firm_size" className="text-right">
              Firm Size
            </Label>
            <Input
              id="firm_size"
              placeholder="Enter firm size..."
              value={newAccountingFirmOwner.firm_size}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, firm_size: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tax_id" className="text-right">
              Tax ID
            </Label>
            <Input
              id="tax_id"
              placeholder="Enter Tax ID..."
              value={newAccountingFirmOwner.tax_id}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, tax_id: e.target.value };
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
            onClick={updateAccountingFirmOwner}
          >
            {isLoading ? "Loading..." : "Update Accounting Firm Owner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
