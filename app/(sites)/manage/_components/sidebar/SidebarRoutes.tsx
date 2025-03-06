"use client";
import {
  Briefcase,
  Combine,
  Edit,
  Gem,
  Gift,
  HardDriveUpload,
  LineChart,
  User2,
  Wallet,
} from "lucide-react";
import React from "react";
import SidebarItem from "./SidebarItem";

const guestRoute = [
  {
    icon: LineChart,
    label: "Dashboard",
    href: "/manage/dashboard",
  },
  {
    icon: Briefcase,
    label: "All Jobs",
    href: "/manage/jobs",
  },
  {
    icon: HardDriveUpload,
    label: "Post Job",
    href: "/manage/create-job",
  },
  {
    icon: Combine,
    label: "My Jobs",
    href: "/manage/my-jobs",
  },
  {
    icon: Gem,
    label: "The Pricing",
    href: "/manage/pricing",
  },
  {
    icon: Wallet,
    label: "Transactions",
    href: "/manage/transactions",
  },
  {
    icon: User2,
    label: "User Profile",
    href: "/manage/profile",
  },
  {
    icon: Gift,
    label: "Refer & Earn",
    href: "/manage/referrals",
  },
  {
    icon: Edit,
    label: "Assessments",
    href: "/manage/assessments",
  },
];

const SidebarRoutes = () => {
  const routes = guestRoute;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
