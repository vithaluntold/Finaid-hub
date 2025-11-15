"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Users,
  Settings,
  CreditCard,
  UserCog,
  Layers,
  Phone,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Home,
  User,
  Search,
  UserPlus,
} from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { useEffect } from "react";
import { Input } from "./ui/input";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "super_admin" | "admin" | "accounting_firm_owner" | "accountant";
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

export function DashboardLayout({
  children,
  userType,
  searchQuery,
  setSearchQuery,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  const superAdminNavItems = [
    {
      title: "Dashboard",
      href: "/super-admin/dashboard",
      icon: Home,
    },
    // {
    //   title: "Enterprise Analytics",
    //   href: "/super-admin/enterprise",
    //   icon: BarChart3,
    // },
    // {
    //   title: "SME Analytics",
    //   href: "/super-admin/sme",
    //   icon: Building2,
    // },
    {
      title: "Marketplace",
      href: "/super-admin/marketplace",
      icon: ShoppingCart,
    },
    {
      title: "Accounting Firms",
      href: "/super-admin/accounting-firms",
      icon: Users,
    },
    // {
    //   title: "Educational Content",
    //   href: "/super-admin/content",
    //   icon: BookOpen,
    // },
    {
      title: "Admins",
      href: "/super-admin/admins",
      icon: UserPlus,
    },
    // {
    //   title: "Settings",
    //   href: "/super-admin/settings/account",
    //   icon: Settings,
    // },
  ];

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    // {
    //   title: "Enterprise Analytics",
    //   href: "/super-admin/enterprise",
    //   icon: BarChart3,
    // },
    // {
    //   title: "SME Analytics",
    //   href: "/super-admin/sme",
    //   icon: Building2,
    // },
    {
      title: "Marketplace",
      href: "/admin/marketplace",
      icon: ShoppingCart,
    },
    {
      title: "Accounting Firms",
      href: "/admin/accounting-firms",
      icon: Users,
    },
    // {
    //   title: "Educational Content",
    //   href: "/super-admin/content",
    //   icon: BookOpen,
    // },
    // {
    //   title: "Admins",
    //   href: "/super-admin/admins",
    //   icon: UserPlus,
    // },
    // {
    //   title: "Settings",
    //   href: "/super-admin/settings/account",
    //   icon: Settings,
    // },
  ];

  const accountingFirmOwnerTwoNavItems = [
    {
      title: "Dashboard",
      href: "/accounting-firm-owner/dashboard",
      icon: Home,
    },
    {
      title: "Accountants",
      href: "/accounting-firm-owner/accountants",
      icon: UserCog,
    },
    // {
    //   title: "Teams",
    //   href: "/accounting-firm-owner/teams",
    //   icon: Users,
    // },
    // {
    //   title: "Fin(Ai)d Sandbox",
    //   href: "/accounting-firm-owner/sandbox",
    //   icon: Layers,
    // },
    // {
    //   title: "Support",
    //   href: "/accounting-firm-owner/support",
    //   icon: Phone,
    // },
    {
      title: "Marketplace",
      href: "/accounting-firm-owner/marketplace",
      icon: ShoppingCart,
    },
    {
      title: "Licenses",
      href: "/accounting-firm-owner/licenses",
      icon: CreditCard,
    },
    // {
    //   title: "Training",
    //   href: "/accounting-firm-owner/training",
    //   icon: GraduationCap,
    // },
    {
      title: "Clients",
      href: "/accounting-firm-owner/clients",
      icon: Briefcase,
    },
    // {
    //   title: "Profile",
    //   href: "/accounting-firm-owner/profile",
    //   icon: User,
    // },
  ];

  const accountantTwoNavItems = [
    {
      title: "Licenses",
      href: "/accountant/licenses",
      icon: CreditCard,
    },

    {
      title: "Clients",
      href: "/accountant/clients",
      icon: Briefcase,
    },
  ];

  const navItems =
    userType === "super_admin"
      ? superAdminNavItems
      : userType === "admin"
      ? adminNavItems
      : userType === "accounting_firm_owner"
      ? accountingFirmOwnerTwoNavItems
      : userType === "accountant"
      ? accountantTwoNavItems
      : [];

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userTypeGlobal = localStorage.getItem("userType");

    if (!token || userType !== userTypeGlobal) {
      router.push("/");
    }
  }, [router, userType]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
            <div className="flex items-center gap-2 pr-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  FH
                </span>
              </div>
              <div className="font-semibold">
                Fin<span className="text-primary">(Ai)</span>d Hub
              </div>
            </div>
            {/* <SidebarTrigger /> */}
            <div className="flex-1" />
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
              />
            </div>
            <ModeToggle />
          </header>
          <div className="flex">
            <Sidebar>
              <SidebarContent>
                <SidebarGroup>
                  {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href}
                            className={`${
                              pathname === item.href ? "text-primary" : ""
                            }`}
                          >
                            <Link href={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="border-t p-4">
                <UserNav userType={userType} />
              </SidebarFooter>
            </Sidebar>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
