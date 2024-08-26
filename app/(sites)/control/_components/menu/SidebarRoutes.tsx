"use client";
import {
  Briefcase,
  Building2,
  CircuitBoard,
  Edit,
  Flag,
  Gift,
  HardDriveUpload,
  LineChart,
  ShieldQuestion,
  SquareSlash,
  Users2,
  Wallet,
} from "lucide-react";
import React from "react";
import SidebarItem from "./SidebarItem";

const guestRoute = [
  {
    icon: LineChart,
    label: "Dashboard",
    href: "/control/dashboard",
  },
  {
    icon: Briefcase,
    label: "Jobs View",
    href: "/control/jobs",
  },
  {
    icon: HardDriveUpload,
    label: "Post Job",
    href: "/control/post-job",
  },
  {
    icon: CircuitBoard,
    label: "Unpublished",
    href: "/control/publication",
  },
  {
    icon: Flag,
    label: "Job Reports",
    href: "/control/reports",
  },
  {
    icon: Building2,
    label: "Companies",
    href: "/control/companies",
  },
  {
    icon: Users2,
    label: "Candidates",
    href: "/control/candidates",
  },
  {
    icon: SquareSlash,
    label: "The Plans",
    href: "/control/plans",
  },
  {
    icon: Wallet,
    label: "Transactions",
    href: "/control/transactions",
  },
  {
    icon: Gift,
    label: "Referrals",
    href: "/control/referrals",
  },
  {
    icon: Edit,
    label: "Assessments",
    href: "/control/assessments",
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
