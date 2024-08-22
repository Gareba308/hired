"use client";
import React from "react";
import SidebarRoutes from "./SidebarRoutes";
import Link from "next/link";
import Image from "next/image";


interface SidebarProps {
  onClose: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col border-r justify-between gap-y-3 border-gray-200 bg-[#ffffff]">
      <div className="flex flex-col">
        <div className="h-[70px] flex my-auto items-center border-b border-gray-300 pl-4">
          <Link href="/">
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
          <SidebarRoutes onClose={onClose}/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;