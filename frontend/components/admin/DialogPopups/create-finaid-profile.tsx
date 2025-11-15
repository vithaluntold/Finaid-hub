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

interface PlatformModel {
  identifier: string;
  display_name: string;
  [key: string]: any;
}

interface PlatformIntegration {
  identifier: string;
  display_name: string;
  [key: string]: any;
}

interface Platform {
  models: PlatformModel[];
  integrations: PlatformIntegration[];
  [key: string]: any;
}

interface PlatformData {
  [key: string]: Platform;
}

interface FinaidProfile {
  name?: string;
  desc?: string;
  image?: File;
  platform?: {
    key: string;
    [key: string]: any;
  };
  model?: PlatformModel;
  integration?: PlatformIntegration;
  [key: string]: any;
}

export function CreateFinaidProfile({
  open,
  onOpenChange,
  setLocalLoading,
}: CreateContentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // const [allDropdown, setAllDropdown] = useState({
  //   model_types: [
  //     {
  //       id: "m_claude",
  //       display_name: "Claude Sonnet 3.7",
  //     },
  //     {
  //       id: "m_gpt4",
  //       display_name: "OpenAI GPT 4",
  //     },
  //   ],
  //   input_types: [
  //     {
  //       id: "i_csv",
  //       display_name: "CSV",
  //     },
  //     {
  //       id: "i_quickbooks",
  //       display_name: "QuickBooks",
  //     },
  //   ],
  //   output_types: [
  //     {
  //       id: "o_csv",
  //       display_name: "CSV",
  //     },
  //     {
  //       id: "o_quickbooks",
  //       display_name: "QuickBooks",
  //     },
  //   ],
  // });
  const [newFinaidProfile, setNewFinaidProfile] = useState<FinaidProfile>({});
  const [imageTempURL, setImageTempURL] = useState("");

  const [platformData, setPlatformData] = useState<PlatformData>({});
  const [selectedPlatformKey, setSelectedPlatformKey] = useState("");
  const [selectedModel, setSelectedModel] = useState<PlatformModel | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<PlatformIntegration | null>(null);

  // functions

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageTempURL(URL.createObjectURL(file)); // for preview if needed
      setNewFinaidProfile((prev) => {
        return { ...prev, image: file };
      });
    }
  };

  const createNewFinaidProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newFinaidProfile.name || !newFinaidProfile.name.trim()) {
      showToast({
        title: "Error",
        description: "Profile name is required",
      });
      return;
    }

    if (!selectedPlatformKey) {
      showToast({
        title: "Error",
        description: "Please select a platform",
      });
      return;
    }

    if (!selectedModel) {
      showToast({
        title: "Error",
        description: "Please select a model",
      });
      return;
    }

    if (!selectedIntegration) {
      showToast({
        title: "Error",
        description: "Please select an integration",
      });
      return;
    }

    setIsLoading(true);

    // Prepare the data to send (no FormData for now, just JSON)
    const profileData = {
      name: newFinaidProfile.name,
      description: newFinaidProfile.desc || '',
      platform: selectedPlatformKey,
      model: selectedModel,
      integration: selectedIntegration,
      category: 'general',
      features: []
    };

    // console.log(profileData, "profileData to send");

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/finaid-profiles`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Create New Finaid Profile API response");
      if (response?.status === 200 || response?.status === 201) {
        showToast({
          title: "Created Successfully!",
          description: response?.data?.message,
        });
        onOpenChange(false);
        setLocalLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to Create New Finaid!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create Finaid profile",
      });
      setIsLoading(false);
      console.log(error, "Error while trying to Create New Finaid!");
    }
  };

  // renderings

  // Fetch from API on mount
  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const res = await axios.get(
          "https://finaid.marketsverse.com/api/v1/predictor/get-supported-configs"
        );
        // console.log(res, "test response");
        setPlatformData(res?.data?.data);
      } catch (err) {
        console.error("Error fetching platform data:", err);
      }
    };

    fetchPlatformData();
  }, []);

  const currentPlatform = platformData[selectedPlatformKey];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Finaid</DialogTitle>
          <DialogDescription>Create a New Finaid profile.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  imageTempURL
                    ? imageTempURL
                    : "/placeholder.svg?height=96&width=96"
                }
                alt="Profile"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload profile image"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Avatar
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newFinaidProfile.name}
              onChange={(e) =>
                setNewFinaidProfile((prev) => {
                  return { ...prev, name: e.target.value };
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
              value={newFinaidProfile.desc}
              onChange={(e) =>
                setNewFinaidProfile((prev) => {
                  return { ...prev, desc: e.target.value };
                })
              }
              placeholder="Enter description here..."
              rows={3}
            />
          </div>

          {/* Platform Selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Select Platform
            </Label>
            <Select
              value={selectedPlatformKey}
              onValueChange={(value) => {
                setSelectedPlatformKey(value);
                setSelectedModel(null);
                setSelectedIntegration(null);

                // Update full object in newFinaidProfile
                setNewFinaidProfile((prev) => ({
                  ...prev,
                  platform: { key: value, ...platformData[value] },
                  // platform: { ...platformData[value] },
                  model: null,
                  integration: null,
                }));
              }}
            >
              <SelectTrigger id="platform" className="col-span-3">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(platformData).map((key) => (
                  <SelectItem value={key} key={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selector */}
          <div
            className={`grid grid-cols-4 items-center gap-4 ${
              !currentPlatform?.models && "pointer-events-none opacity-30"
            }`}
          >
            <Label htmlFor="model" className="text-right">
              Select Model
            </Label>
            <Select
              value={selectedModel?.identifier || ""}
              onValueChange={(value) => {
                const model = currentPlatform.models.find(
                  (m: PlatformModel) => m.identifier === value
                );
                setSelectedModel(model || null);

                // Update model in newFinaidProfile
                setNewFinaidProfile((prev) => ({
                  ...prev,
                  model: model || null,
                }));
              }}
            >
              <SelectTrigger id="model" className="col-span-3">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {currentPlatform?.models?.length > 0 &&
                  currentPlatform?.models.map((model: PlatformModel) => (
                    <SelectItem value={model.identifier} key={model.identifier}>
                      {model.display_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Integration Selector */}
          <div
            className={`grid grid-cols-4 items-center gap-4 ${
              !currentPlatform?.integrations && "pointer-events-none opacity-30"
            }`}
          >
            <Label htmlFor="integration" className="text-right">
              Select Integration
            </Label>
            <Select
              value={selectedIntegration?.identifier || ""}
              onValueChange={(value) => {
                const integration = currentPlatform.integrations.find(
                  (i: PlatformIntegration) => i.identifier === value
                );
                setSelectedIntegration(integration || null);

                // Update integration in newFinaidProfile
                setNewFinaidProfile((prev) => ({
                  ...prev,
                  integration: integration || null,
                }));
              }}
            >
              <SelectTrigger id="integration" className="col-span-3">
                <SelectValue placeholder="Select Integration" />
              </SelectTrigger>
              <SelectContent>
                {currentPlatform?.integrations?.length > 0 &&
                  currentPlatform?.integrations?.map((integration: PlatformIntegration) => (
                    <SelectItem
                      value={integration.identifier}
                      key={integration.identifier}
                    >
                      {integration.display_options.join(" → ")}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-lead" className="text-right">
              Select Model
            </Label>
            <Select
              // value={newTeam.lead}
              // onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}
              value={newFinaidProfile.platform}
              onValueChange={(value) =>
                setNewFinaidProfile((prev) => {
                  return { ...prev, platform: value };
                })
              }
            >
              <SelectTrigger id="team-lead" className="col-span-3">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {allDropdown?.model_types?.map((eachItem) => {
                  return (
                    <SelectItem value={eachItem} key={eachItem?.id}>
                      {eachItem?.display_name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-lead" className="text-right">
              Select Input Type
            </Label>
            <Select
              // value={newTeam.lead}
              // onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}
              value={newFinaidProfile.model}
              onValueChange={(value) =>
                setNewFinaidProfile((prev) => {
                  return { ...prev, model: value };
                })
              }
            >
              <SelectTrigger id="team-lead" className="col-span-3">
                <SelectValue placeholder="Select Input Type" />
              </SelectTrigger>
              <SelectContent>
                {allDropdown?.input_types?.map((eachItem) => {
                  return (
                    <SelectItem value={eachItem} key={eachItem?.id}>
                      {eachItem?.display_name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team-lead" className="text-right">
              Select Output Type
            </Label>
            <Select
              // value={newTeam.lead}
              // onValueChange={(value) => setNewTeam({ ...newTeam, lead: value })}
              value={newFinaidProfile.integration}
              onValueChange={(value) =>
                setNewFinaidProfile((prev) => {
                  return { ...prev, integration: value };
                })
              }
            >
              <SelectTrigger id="team-lead" className="col-span-3">
                <SelectValue placeholder="Select Output Type" />
              </SelectTrigger>
              <SelectContent>
                {allDropdown?.output_types?.map((eachItem) => {
                  return (
                    <SelectItem value={eachItem} key={eachItem?.id}>
                      {eachItem?.display_name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div> */}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={createNewFinaidProfile}
          >
            {isLoading ? "Loading..." : "Create Finaid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
