"use client";
import {
  BookOpenCheck,
  Briefcase,
  Building2,
  Edit,
  FolderOpen,
  Gift,
  Import,
  LineChart,
  Network,
  User2,
} from "lucide-react";
import React from "react";
import SidebarItem from "./SidebarItem";

const guestRoute = [
  {
    icon: LineChart,
    label: "Dashboard",
    href: "/site/dashboard",
  },
  {
    icon: Briefcase,
    label: "All Jobs",
    href: "/site/jobs",
  },
  {
    icon: Import,
    label: "Saved Jobs",
    href: "/site/saved-jobs",
  },
  {
    icon: Building2,
    label: "Companies",
    href: "/site/companies",
  },
  {
    icon: BookOpenCheck,
    label: "Portfolio",
    href: "/site/portfolio",
  },
  {
    icon: User2,
    label: "User Profile",
    href: "/site/profile",
  },
  {
    icon: FolderOpen,
    label: "Documents",
    href: "/site/documents",
  },
  {
    icon: Network,
    label: "Career Point",
    href: "/site/career-point",
  },
  {
    icon: Gift,
    label: "My Referrals",
    href: "/site/referrals",
  },
  {
    icon: Edit,
    label: "Assessments",
    href: "/site/assessments",
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
