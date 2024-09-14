"use client";
import {
  Briefcase,
  GalleryHorizontal,
  ArrowUpSquare,
  ArrowRightSquare,
  Newspaper,
} from "lucide-react";
import React from "react";
import SidebarItem from "./SidebarItem";

const guestRoute = [
  {
    icon: Briefcase,
    label: "Explore Jobs",
    href: "/home/jobs",
  },
  {
    icon: Newspaper,
    label: "Hiring Insight",
    href: "/home/blogs/employers",
  },
  {
    icon: GalleryHorizontal,
    label: "Career Advice",
    href: "/home/blogs/job-seekers",
  },
  {
    icon: ArrowRightSquare,
    label: "Employer Login",
    href: "/home/login/enterprises",
  },
  {
    icon: ArrowUpSquare,
    label: "Job Seeker Login",
    href: "/home/login",
  },
];

interface SidebarProps {
  onClose: () => void;
}
const SidebarRoutes: React.FC<SidebarProps> = ({ onClose }) => {
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