"use client";

import type React from "react";
import { useEffect, useState } from "react";
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

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [userType, setUserType] = useState("super_admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allCountries, setAllCountries] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      type AuthResponse = {
        data: {
          data?: {
            token?: string;
            user?: { user_type?: string; [key: string]: any };
          };
          message?: string;
        };
      };

      let response: AuthResponse = await axios.post(`${backendBaseURL}/api/v1/auth`, {
        username: email,
        password,
      });

      if (response?.data?.data?.token) {
        localStorage.setItem("accessToken", response?.data?.data?.token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("allCountries", JSON.stringify(allCountries));
        localStorage.setItem(
          "userDetails",
          JSON.stringify(response?.data?.data?.user)
        );

        let user_role = response?.data?.data?.user?.user_type;
        if (userType === user_role) {
          switch (user_role) {
            case "super_admin":
              router.push("/super-admin/dashboard");
              break;
            case "admin":
              router.push("/admin/dashboard");
              break;
            case "accounting_firm_owner":
              router.push("/accounting-firm-owner/dashboard");
              break;
            case "accountant":
              router.push("/accountant/licenses");
              break;
            default:
              router.push("/");
          }
          showToast({
            title: "Successfully Logged In!",
            description: response?.data?.message ?? "Login successful.",
          });
        } else {
          showToast({
            title: "Unable to login!",
            description: "Please select the respective role!",
          });
        }
      } else {
        showToast({
          title: "Error",
          description: "Unable to login!",
        });
      }
      setIsLoading(false);
      console.log(response, "invite admin api response");
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Login API error");
    }
  };

  async function getAllCountries() {
    try {
      type CountriesResponse = {
        data: {
          status?: boolean;
          countries?: any[];
        };
      };

      let response: CountriesResponse = await axios.get(
        "https://comms.globalxchange.io/coin/vault/countries/data/get"
      );
      console.log(response, "get all countries API response");
      if (response?.data?.status && (response?.data?.countries?.length ?? 0) > 0) {
        setAllCountries(response?.data?.countries ?? []);
      } else {
        setAllCountries([]);
      }
    } catch (error) {
      console.log((error as any)?.message, "Get all countries API error");
    }
  }

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your Fin(Ai)d Hub account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-type">User Type</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger id="user-type">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="accounting_firm_owner">
                  Accounting Firm Owner
                </SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LockIcon className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type="password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardDescription
          className="pb-6 pr-6 text-right cursor-pointer hover:underline hover:underline-offset-1"
          onClick={() => router.push("/forget-password")}
        >
          Forget Password
        </CardDescription>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
