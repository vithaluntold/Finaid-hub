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
}

export function CreateAccountingFirm({
  open,
  onOpenChange,
  setLocalLoading,
}: CreateContentDialogProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newAccountingFirmOwner, setNewAccountingFirmOwner] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    country: "",
    countryCode: "",
    phone: "",
    position: "",
  });
  const [allCountries, setAllCountries] = useState([]);

  // functions

  const createNewAccountingFirmOwner = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (newAccountingFirmOwner?.countryCode) {
      newAccountingFirmOwner.phone =
        "+" +
        newAccountingFirmOwner?.countryCode +
        newAccountingFirmOwner?.phone;
    }

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/users/accounting-owner/invite`,
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
          title: "Created Successfully!",
          description: response?.data?.message,
        });
        onOpenChange(false);
        setLocalLoading((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description:
            "Error while trying to Create New accounting firm owner!",
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

  const handleSelectChange = (name: string, value: string) => {
    setNewAccountingFirmOwner({
      ...newAccountingFirmOwner,
      [name]: value,
    });
  };

  // renderings

  useEffect(() => {
    let allCountriesStorage = localStorage.getItem("allCountries")
      ? JSON.parse(localStorage.getItem("allCountries"))
      : "";
    setAllCountries(allCountriesStorage);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Accounting Firm Owner Form</DialogTitle>
          <DialogDescription>
            Create a New Accouting firm owner.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              First Name
            </Label>
            <Input
              id="first_name"
              placeholder="Enter first name..."
              value={newAccountingFirmOwner.first_name}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, first_name: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Last Name
            </Label>
            <Input
              id="last_name"
              placeholder="Enter last name..."
              value={newAccountingFirmOwner.last_name}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, last_name: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Ex. support@finaidhub.com"
              value={newAccountingFirmOwner.email}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, email: e.target.value };
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Select
              value={newAccountingFirmOwner?.country}
              onValueChange={(value) => handleSelectChange("country", value)}
            >
              <SelectTrigger id="country" className="col-span-3">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {allCountries?.length > 0 &&
                  allCountries?.map((eachCountry, index) => {
                    return (
                      <SelectItem value={eachCountry?.name}>
                        {eachCountry?.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Phone
            </Label>
            <div className="flex items-center gap-2 col-span-3">
              <Select
                value={newAccountingFirmOwner?.countryCode}
                onValueChange={(value) =>
                  handleSelectChange("countryCode", value)
                }
              >
                <SelectTrigger id="country" className="w-[100px] px-1">
                  <SelectValue placeholder="Country Code" />
                </SelectTrigger>
                <SelectContent>
                  {allCountries?.length > 0 &&
                    allCountries?.map((eachCountry, index) => {
                      const phoneCode = eachCountry?.phone_code;
                      if (!phoneCode) return null;
                      return (
                        <SelectItem key={phoneCode + index} value={phoneCode}>
                          {`${eachCountry?.name}(${phoneCode})`}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex. 8373524715"
                value={newAccountingFirmOwner?.phone}
                onChange={(e) =>
                  setNewAccountingFirmOwner((prev) => {
                    return { ...prev, phone: e.target.value };
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Position
            </Label>
            <Input
              id="position"
              placeholder="Ex. Managing partner"
              value={newAccountingFirmOwner.position}
              onChange={(e) =>
                setNewAccountingFirmOwner((prev) => {
                  return { ...prev, position: e.target.value };
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
            onClick={createNewAccountingFirmOwner}
          >
            {isLoading ? "Loading..." : "Create New Accounting Firm Owner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
