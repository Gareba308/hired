"use client";
import {
  Briefcase,
  Coins,
  Combine,
  Edit,
  Gem,
  Gift,
  HardDriveUpload,
  LineChart,
  User2,
  Users2,
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
    icon: Users2,
    label: "Candidates",
    href: "/manage/candidates",
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

interface SidebarRoutesProps {
  onClose: () => void;
}

const SidebarRoutes = ({ onClose }: SidebarRoutesProps) => {
  const routes = guestRoute;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
