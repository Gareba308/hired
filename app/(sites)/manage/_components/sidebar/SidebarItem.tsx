"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(href)

  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-gray-700 text-sm font-normal pl-6 hover:text-gray-700 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 border-r-4 border-sky-700 hover:bg-sky-200/20 hover:text-sky-700 transition-all"
      )}
      style={{ transitionProperty: "border-radius" }}
    >
      <div className="flex items-center gap-x-2 py-3.5">
        <Icon
          size={20}
          className={cn("text-gray-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
    </button>
  );
};

export default SidebarItem;
