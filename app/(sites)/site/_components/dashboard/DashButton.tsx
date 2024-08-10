"use client"

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DashButton = () => {
    const pathname = usePathname();
    const isActive= pathname?.includes('/site/messaging')
  return (
    <Link prefetch={true} href="/site/messaging">
      <Button
        size="default"
        variant="ghost"
        className={cn("text-gray-700 hover:text-gray-700 text-sm hover:bg-secondary rounded-sm font-normal",
        isActive && "text-sky-700 bg-sky-200/20 border-sky-700 border-b-2 hover:bg-secondary hover:text-sky-700")}
      >
        <div className="flex flex-row gap-x-1 sm:my-1 items-center hover:opacity-80">
          <Mail className={cn("h-5 w-5 shrink-0 text-gray-600 font-normal", isActive && "text-sky-700")} />
          <span className="-mt-0.5 hidden text-gray-700 sm:flex">Messages</span>
        </div>
      </Button>
    </Link>
  );
};

export default DashButton;