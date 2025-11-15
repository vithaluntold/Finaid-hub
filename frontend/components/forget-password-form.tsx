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
import { LockIcon, MailIcon, ArrowLeft } from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type ResetPassword = {
  email?: string;
  otp?: string;
  new_password?: string;
  new_password_confirmation?: string;
};

type ResetResponse = {
  success: boolean;
  message: string;
  data?: {
    email: string;
    dev_otp?: string;
    message: string;
  };
  dev_otp?: string;
};

export function ForgetPasswordForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [resetPasswordStep, setResetPasswordStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [updatePasswordDetails, setUpdatePasswordDetails] =
    useState<ResetPassword>({
      email: "",
      otp: "",
      new_password: "",
      new_password_confirmation: ""
    });
  const [isLoading, setIsLoading] = useState(false);

  const resetPasswordTokenGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let response = await axios.post<ResetResponse>(`${backendBaseURL}/api/v1/reset`, {
        email: email,
      });

      if (response?.status === 200) {
        const responseData = response.data as ResetResponse;
        const otpFromServer = responseData?.data?.dev_otp || responseData?.dev_otp || "";
        setGeneratedOTP(otpFromServer);
        
        showToast({
          title: "OTP Generated!",
          description: `For testing, use OTP: ${otpFromServer}`,
        });
        setResetPasswordStep(2);
      } else {
        showToast({
          title: "Error",
          description: "Unable to reset password!",
        });
      }
      setIsLoading(false);
      console.log(response, "Reset password api response");
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message || "Unable to reset password!",
      });
      setIsLoading(false);
      console.log(error, "Reset password error");
    }
  };

  const updateResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      updatePasswordDetails?.new_password !==
      updatePasswordDetails?.new_password_confirmation
    ) {
      showToast({
        title: "Error",
        description: "Passwords don't match!",
      });
      return;
    }

    updatePasswordDetails.email = email;

    setIsLoading(true);

    try {
      let response = await axios.put<ResetResponse>(
        `${backendBaseURL}/api/v1/reset`,
        updatePasswordDetails
      );
      console.log(response, "Reset password api response");
      if (response?.status === 200) {
        const responseData = response.data as ResetResponse;
        showToast({
          title: "Success!",
          description: responseData?.message || "Password reset successful!",
        });
        router.push("/");
      } else {
        showToast({
          title: "Error",
          description: "Unable to reset password!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message || "Unable to reset password!",
      });
      setIsLoading(false);
      console.log(error, "Reset password error");
    }
  };

  return (
    <Card className="w-full">
      {resetPasswordStep === 1 ? (
        <>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Password reset for your Fin(Ai)d Hub account
            </CardDescription>
          </CardHeader>
          <form onSubmit={resetPasswordTokenGenerate}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="grid">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push(`/`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </CardFooter>
          </form>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Update New Password for your Fin(Ai)d Hub account
            </CardDescription>
          </CardHeader>
          <form onSubmit={updateResetPassword}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                {generatedOTP && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700 font-medium">
                      🔑 Test OTP: <span className="font-mono text-lg">{generatedOTP}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Copy this OTP to the field below (Development Mode)
                    </p>
                  </div>
                )}
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    className="pl-2"
                    placeholder="Enter the 6-digit OTP"
                    value={updatePasswordDetails?.otp || ""}
                    onChange={(e) =>
                      setUpdatePasswordDetails((prev) => {
                        return { ...prev, otp: e.target.value };
                      })
                    }
                    required
                  />
                </div>
                {generatedOTP && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={() =>
                      setUpdatePasswordDetails((prev) => ({
                        ...prev,
                        otp: generatedOTP
                      }))
                    }
                  >
                    Click to auto-fill OTP
                  </button>
                )}
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
                    value={updatePasswordDetails?.new_password || ""}
                    onChange={(e) =>
                      setUpdatePasswordDetails((prev) => {
                        return { ...prev, new_password: e.target.value };
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password_confirmation">
                  Confirm Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <Input
                    id="new_password_confirmation"
                    type="password"
                    className="pl-10"
                    value={updatePasswordDetails?.new_password_confirmation || ""}
                    onChange={(e) =>
                      setUpdatePasswordDetails((prev) => {
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
                {isLoading ? "Logging in..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        </>
      )}
    </Card>
  );
}
