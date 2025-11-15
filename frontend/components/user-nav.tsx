"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  BookOpen,
  Building2,
  Settings,
  Users,
  Layers,
  Phone,
  GraduationCap,
  User,
  Home,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserNavProps {
  userType: "super_admin" | "admin" | "accounting_firm_owner" | "accountant";
}

interface UserDetails {
  name?: string;
  first_name?: string;
  email?: string;
}

export function UserNav({ userType }: UserNavProps) {
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetails>({});

  const userTypeLabels = {
    super_admin: "Super Admin",
    admin: "Admin",
    accounting_firm_owner: "Accounting Firm Owner",
    accountant: "Accountant",
    client: "Client",
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleProfile = () => {
    router.push(`/${userType}/profile`);
  };

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      try {
        const userdata = JSON.parse(storedUserDetails);
        setUserDetails(userdata);
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }
  }, []);

  const allNavItems =
    userType === "super_admin"
      ? [
          {
            title: "Enterprise Analytics",
            href: "/super-admin/enterprise",
            icon: BarChart3,
          },
          {
            title: "SME Analytics",
            href: "/super-admin/sme",
            icon: Building2,
          },
          {
            title: "Educational Content",
            href: "/super-admin/content",
            icon: BookOpen,
          },
          {
            title: "Settings",
            href: "/super-admin/settings/account",
            icon: Settings,
          },
        ]
      : userType === "admin"
      ? [
          {
            title: "Enterprise Analytics",
            href: "/admin/enterprise",
            icon: BarChart3,
          },
          {
            title: "SME Analytics",
            href: "/admin/sme",
            icon: Building2,
          },
          {
            title: "Educational Content",
            href: "/admin/content",
            icon: BookOpen,
          },
          {
            title: "Settings",
            href: "/admin/settings/account",
            icon: Settings,
          },
        ]
      : userType === "accounting_firm_owner"
      ? [
          {
            title: "Teams",
            href: "/accounting-firm-owner/teams",
            icon: Users,
          },
          {
            title: "Fin(Ai)d Sandbox",
            href: "/accounting-firm-owner/sandbox",
            icon: Layers,
          },
          {
            title: "Support",
            href: "/accounting-firm-owner/support",
            icon: Phone,
          },
          {
            title: "Training",
            href: "/accounting-firm-owner/training",
            icon: GraduationCap,
          },
          {
            title: "Profile",
            href: "/accounting-firm-owner/profile",
            icon: User,
          },
        ]
      : userType === "accountant"
      ? [
          {
            title: "Dashboard",
            href: "/accountant/dashboard",
            icon: Home,
          },
          {
            title: "Accountants",
            href: "/accountant/accountants",
            icon: UserCog,
          },

          {
            title: "Marketplace",
            href: "/accountant/marketplace",
            icon: ShoppingCart,
          },
          {
            title: "Teams",
            href: "/accountant/teams",
            icon: Users,
          },
          {
            title: "Fin(Ai)d Sandbox",
            href: "/accountant/sandbox",
            icon: Layers,
          },
          {
            title: "Support",
            href: "/accountant/support",
            icon: Phone,
          },
          {
            title: "Training",
            href: "/accountant/training",
            icon: GraduationCap,
          },
          {
            title: "Profile",
            href: "/accountant/profile",
            icon: User,
          },
        ]
      : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-full justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">
              {userType === "super_admin"
                ? (userDetails?.name || userDetails?.first_name || "Super Admin")
                : userDetails?.first_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {userTypeLabels[userType]}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userType === "super_admin"
                ? "Vithal Valluri"
                : userDetails?.first_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userType === "super_admin"
                ? "vithal@finacegroup.com"
                : userDetails?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {allNavItems?.length > 0 &&
            allNavItems?.map((item, index) => {
              return (
                <DropdownMenuItem key={item.href}>
                  <Link href={item.href} className="flex gap-2 items-center">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          {/* <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
