"use client";
import {
  Briefcase,
  HelpCircle,
  HelpingHand,
} from "lucide-react";
import React from "react";
import SidebarItem from "./SidebarItem";

const guestRoute = [
  {
    icon: Briefcase,
    label: "All jobs",
    href: "/assign/jobs",
  },
  {
    icon: HelpingHand,
    label: "Help",
    href: "/assign/help",
  },
  {
    icon: HelpCircle,
    label: "FAQs",
    href: "/manage/profile",
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
