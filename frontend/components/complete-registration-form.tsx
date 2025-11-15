"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockIcon, MailIcon } from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type TemporaryCredentials = {
  email?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
};

export function CompleteRegistrationForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [userType, setUserType] = useState("super_admin");
  const [temporaryCredentials, setTemporaryCredentials] =
    useState<TemporaryCredentials>({});
  const [isLoading, setIsLoading] = useState(false);

  async function verifyUser(e: React.FormEvent) {
    e.preventDefault();
    if (
      temporaryCredentials?.new_password !==
      temporaryCredentials?.new_password_confirmation
    ) {
      showToast({
        title: "Error",
        description: "New passwords don't match!",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendBaseURL}/api/v1/verify`,
        temporaryCredentials
      );

      if (response?.data?.status === "Success") {
        showToast({
          title: "Success",
          description: response?.data?.message,
        });

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to verify user!",
        });
      }

      setIsLoading(false);
      setTemporaryCredentials({});
      console.log(response, "Verify user response");
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Error",
        description: "Something went wrong while verifying user.",
      });
      console.log("Invite user error", error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Registration</CardTitle>
        <CardDescription>Register your Fin(Ai)d Hub account</CardDescription>
      </CardHeader>
      <form onSubmit={verifyUser}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <MailIcon className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                value={temporaryCredentials?.email}
                onChange={(e) =>
                  setTemporaryCredentials((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_password">Temporary Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LockIcon className="h-4 w-4" />
              </div>
              <Input
                id="current_password"
                type="password"
                className="pl-10"
                value={temporaryCredentials?.current_password}
                onChange={(e) =>
                  setTemporaryCredentials((prev) => {
                    return { ...prev, current_password: e.target.value };
                  })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LockIcon className="h-4 w-4" />
              </div>
              <Input
                id="new_password"
                type="password"
                className="pl-10"
                value={temporaryCredentials?.new_password}
                onChange={(e) =>
                  setTemporaryCredentials((prev) => {
                    return { ...prev, new_password: e.target.value };
                  })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password_confirmation">
              Confirm New Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LockIcon className="h-4 w-4" />
              </div>
              <Input
                id="new_password_confirmation"
                type="password"
                className="pl-10"
                value={temporaryCredentials?.new_password_confirmation}
                onChange={(e) =>
                  setTemporaryCredentials((prev) => {
                    return {
                      ...prev,
                      new_password_confirmation: e.target.value,
                    };
                  })
                }
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
