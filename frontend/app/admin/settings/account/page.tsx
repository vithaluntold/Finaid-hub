"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Bell,
  Globe,
  Palette,
  Database,
  Key,
  Upload,
  Save,
  RefreshCw,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  AlertTriangle,
  Clock,
  Sliders,
  Download,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InviteAdminDialog } from "@/components/super-admin/DialogPopups/invite-admin-dialog";
import { ContentList } from "@/components/super-admin/content-list";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for type safety
interface UserProfile {
  user_profile_image?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  designation?: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localRefresh, setLocalRefresh] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  // functions

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserProfile((prev) => {
        return { ...prev, user_profile_image: URL.createObjectURL(file) };
      }); // for preview if needed
    }
  };

  async function getProfileInfo() {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.status === 200 && response?.data?.status === "Success") {
        setUserProfile(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get profile response");
    } catch (error) {
      setIsLoading(false);
      console.log("Get profile error", error);
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    // Loop over the keys dynamically
    Object.entries(userProfile).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      let response = await axios.put(
        `${backendBaseURL}/api/v1/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "Update Profile API response");
      if (response?.status === 200) {
        showToast({
          title: response?.data?.message,
          description: response?.data?.message,
        });
        setLocalRefresh((prev) => !prev);
        // window.location.reload();
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to update profile!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to update profile!");
    }
  };

  //rendering

  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <>
      {/* Account Settings */}
      <TabsContent value="account">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        userProfile?.user_profile_image
                          ? userProfile?.user_profile_image
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
                    title="Select profile image"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Avatar
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      {isLoading ? (
                        <div>
                          <Skeleton width={180} height={20} />
                        </div>
                      ) : (
                        <Input
                          id="first-name"
                          value={userProfile?.first_name}
                          onChange={(e) =>
                            setUserProfile((prev) => {
                              return {
                                ...prev,
                                first_name: e.target.value,
                              };
                            })
                          }
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      {isLoading ? (
                        <div>
                          <Skeleton width={180} height={20} />
                        </div>
                      ) : (
                        <Input
                          id="last-name"
                          value={userProfile?.last_name}
                          onChange={(e) =>
                            setUserProfile((prev) => {
                              return {
                                ...prev,
                                last_name: e.target.value,
                              };
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isLoading ? (
                      <div>
                        <Skeleton width={180} height={20} />
                      </div>
                    ) : (
                      <Input
                        id="email"
                        type="email"
                        value={userProfile?.email}
                        onChange={(e) =>
                          setUserProfile((prev) => {
                            return {
                              ...prev,
                              email: e.target.value,
                            };
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    {isLoading ? (
                      <div>
                        <Skeleton width={180} height={20} />
                      </div>
                    ) : (
                      <Input
                        id="title"
                        value={userProfile?.designation}
                        onChange={(e) =>
                          setUserProfile((prev) => {
                            return {
                              ...prev,
                              designation: e.target.value,
                            };
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isLoading ? (
                    <div>
                      <Skeleton width={180} height={20} />
                    </div>
                  ) : (
                    <Input
                      id="phone"
                      type="tel"
                      value={userProfile?.phone}
                      onChange={(e) =>
                        setUserProfile((prev) => {
                          return {
                            ...prev,
                            phone: e.target.value,
                          };
                        })
                      }
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="alt-email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Alternative Email
                  </Label>
                  {isLoading ? (
                    <div>
                      <Skeleton width={180} height={20} />
                    </div>
                  ) : (
                    <Input
                      id="alt-email"
                      type="email"
                      value={userProfile?.email}
                      onChange={(e) =>
                        setUserProfile((prev) => {
                          return {
                            ...prev,
                            email: e.target.value,
                          };
                        })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company
                </Label>
                {isLoading ? (
                  <div>
                    <Skeleton width={180} height={20} />
                  </div>
                ) : (
                  <Input id="company" defaultValue="Fin(Ai)d Hub Inc." />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                {isLoading ? (
                  <div>
                    <Skeleton width={180} height={20} />
                  </div>
                ) : (
                  <Textarea
                    id="address"
                    value={userProfile?.address}
                    onChange={(e) =>
                      setUserProfile((prev) => {
                        return {
                          ...prev,
                          address: e.target.value,
                        };
                      })
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="america-los_angeles">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-los_angeles">
                      Pacific Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="america-new_york">
                      Eastern Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="america-chicago">
                      Central Time (US & Canada)
                    </SelectItem>
                    <SelectItem value="europe-london">London</SelectItem>
                    <SelectItem value="asia-tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mm-dd-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-max"
            disabled={isLoading}
            onClick={updateProfile}
          >
            Save Changes
          </Button>
        </div>
      </TabsContent>
    </>
  );
}
