"use client";
import React from "react";
import SidebarRoutes from "./SidebarRoutes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUp, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname?.includes("/manage/help");
  return (
    <div className="h-full flex flex-col border-r justify-between gap-y-3 border-gray-200 bg-[#ffffff]">
      <div className="flex flex-col">
        <div className="h-[70px] flex my-auto items-center pl-6">
          <Link href="/manage">
            <Image
              src={
                "https://res.cloudinary.com/dx0i37cyd/image/upload/v1723627737/veryHired_lo5n1w.png"
              }
              height={70}
              width={85}
              alt="Logo"
              title="Logo"
              quality={100}
              className="rounded-sm"
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
          title="Open Blog Articles"
          onClick={() => router.push("/manage/blogs")}
          className={cn(
            "flex items-center justify-between w-full gap-x-2 border border-gray-200 text-gray-800 text-sm font-normal pl-6 pt-4 pb-4 transition-all hover:text-gray-700 hover:bg-slate-300/20",
            isActive &&
              "text-sky-700 bg-secondary hover:bg-sky-200/20 hover:text-sky-700"
          )}
        >
          <div className="flex items-center gap-x-2.5">
            <Newspaper
              size={20}
              className={cn("text-gray-500", isActive && "text-sky-700")}
            />
            <div>Blog Articles</div>
          </div>
          <ChevronsUp className="h-4 w-4 text-gray-500 mr-1.5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
