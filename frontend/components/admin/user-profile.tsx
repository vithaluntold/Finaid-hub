"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";

export function UserProfile() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [localRefresh, setLocalRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  // functions

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

  const handleFileChange = async (event: React.FormEvent) => {
    const file = event.target.files[0];
    if (file) {
      setUserProfile((prev) => {
        return { ...prev, user_profile_image: URL.createObjectURL(file) };
      }); // for preview if needed
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    // Loop over the keys dynamically
    Object.entries(userProfile).forEach(([key, value]) => {
      formData.append(key, value);
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
  }, [localRefresh]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
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
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current.click()}
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
                <Label htmlFor="bio">Bio</Label>
                {isLoading ? (
                  <div>
                    <Skeleton width={180} height={20} />
                  </div>
                ) : (
                  <Textarea
                    id="bio"
                    placeholder="Write a short bio about yourself"
                    value={userProfile?.short_bio}
                    onChange={(e) =>
                      setUserProfile((prev) => {
                        return {
                          ...prev,
                          short_bio: e.target.value,
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
              <Label htmlFor="phone">Phone Number</Label>
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
              <Label htmlFor="location">Location</Label>
              {isLoading ? (
                <div>
                  <Skeleton width={180} height={20} />
                </div>
              ) : (
                <Input
                  id="location"
                  value={userProfile?.country ? userProfile?.country : ""}
                  onChange={(e) =>
                    setUserProfile((prev) => {
                      return {
                        ...prev,
                        country: e.target.value,
                      };
                    })
                  }
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-max" disabled={isLoading} onClick={updateProfile}>
        Save Changes
      </Button>
    </div>
  );
}
