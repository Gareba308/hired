"use client";

import { Button } from "@/components/ui/button";
import { Mail, HelpCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DashButton = () => {
  const pathname = usePathname();
  const isActive = pathname?.includes("/control/messages");
  const isActiveHelp = pathname?.includes("/control/help/jobseeker");
  return (
    <div className="flex items-center flex-row">
      <Link title="Messaging section" href="/control/messages">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "text-gray-700 hover:text-gray-700 text-sm hover:bg-secondary rounded-sm font-normal",
            isActive &&
              "text-sky-700 bg-sky-200/20 border-sky-700 border-b-2 hover:bg-secondary hover:text-sky-700"
          )}
        >
          <div className="flex flex-row sm:my-[1px] items-end hover:opacity-80">
            <Mail
              className={cn(
                "h-5 w-5 shrink-0 sm:mr-1.5 text-gray-600 font-normal",
                isActive && "text-sky-700"
              )}
            />
            <span className="-mt-0.5 hidden text-gray-700 sm:flex">
              Messages
            </span>
          </div>
        </Button>
      </Link>
      <Link title="Help center" href="/control/help/jobseeker">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "text-gray-700 hover:text-gray-700 text-sm hover:bg-secondary rounded-sm font-normal",
            isActiveHelp &&
              "text-sky-700 bg-sky-200/20 border-sky-700 border-b-2 hover:bg-secondary hover:text-sky-700"
          )}
        >
          <div className="flex flex-row sm:my-[1px] items-end hover:opacity-80">
            <HelpCircle
              className={cn(
                "h-5 w-5 shrink-0 sm:mr-1.5 text-gray-600 font-normal",
                isActiveHelp && "text-sky-700"
              )}
            />
            <span className="-mt-0.5 hidden text-gray-700 sm:flex">Help</span>
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default DashButton;
