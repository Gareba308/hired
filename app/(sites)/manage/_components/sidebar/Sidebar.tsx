"use client";
import React from "react";
import SidebarRoutes from "./SidebarRoutes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname?.includes("/manage/help");
  return (
    <div className="h-full flex flex-col border-r justify-between gap-y-3 border-gray-200 bg-white/75">
      <div className="flex flex-col">
        <div className="p-6 ">
          <h2 className="text-xl font-medium text-gray-800 md:hidden">
            Employer
          </h2>
          <Link href="/manage" className="hidden md:flex">
            <Image
              src={
                "https://res.cloudinary.com/dx0i37cyd/image/upload/v1722608373/Hired-_Kenya_3_tyegve.png"
              }
              height={58}
              width={58}
              alt="Logo"
              title="Logo"
              quality={100}
              className="rounded-md"
              priority={true}
            />
          </Link>
        </div>
        <div className="flex flex-col w-full">
          <SidebarRoutes />
        </div>
      </div>

      <div className="flex flex-col border-r  bg-secondary">
        <button
          type="button"
          onClick={() => router.push("/manage/help")}
          className={cn(
            "flex items-center justify-between w-full gap-x-2 border border-gray-200 text-gray-800 text-sm font-normal pl-6 pt-6 pb-6 transition-all hover:text-gray-700 hover:bg-slate-300/20",
            isActive &&
              "text-sky-700 bg-secondary hover:bg-sky-200/20 hover:text-sky-700"
          )}
        >
          <div className="flex items-center gap-x-2">
            <HelpCircle
              size={20}
              className={cn("text-gray-500", isActive && "text-sky-700")}
            />
            <div>Help Center</div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-gray-500 mr-1.5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
