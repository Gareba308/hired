"use client";
import React, { Fragment } from "react";
import SidebarRoutes from "./SidebarRoutes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlignEndHorizontal,
  ChevronsUp,
  Edit,
  Cable,
  FolderEdit,
  ScrollText,
} from "lucide-react";
import { Menu, Transition } from "@headlessui/react";

interface SidebarProps {
  onClose: () => void;
}
const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const isActive =
    pathname?.includes("/control/marketing") ||
    pathname?.includes("control/blogs") ||
    pathname?.includes("/control/email") || 
    pathname?.includes("/control/seo");

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handleItemClick = () => {
    onClose();
  };
  return (
    <div className="h-full flex flex-col border-r justify-between gap-y-3 border-gray-200 bg-[#ffffff]">
      <div className="flex flex-col">
        <div className="h-[70px] border-b border-gray-200 flex my-auto items-center pl-4">
          <Link href="/control" title="Logo link">
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

      <div className="flex flex-col border-r  bg-secondary">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className={cn(
                "flex items-center justify-between w-full gap-x-2  text-gray-800 text-sm font-normal pl-6 pt-4 pb-4 transition-all hover:text-gray-700 hover:bg-slate-300/20",
                isActive
                  ? "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700 border-r-4 border-sky-700 transition-all"
                  : "border border-gray-200"
              )}
              title="Open Marketing Plan"
              style={{ transitionProperty: "border-radius" }}
            >
              <div className="flex items-center gap-x-2.5">
                <AlignEndHorizontal
                  size={20}
                  className={cn("text-gray-500", isActive && "text-sky-700")}
                />
                <div>Marketing Plan</div>
              </div>
              <ChevronsUp
                className={cn(
                  "h-4 w-4 text-gray-500 mr-1.5",
                  isActive && "text-sky-700"
                )}
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-2 divide-y divide-gray-200 bottom-full z-10 mb-1 w-[calc(100%-8px)] origin-bottom-right rounded-lg bg-white shadow-top-md border border-gray-300 focus:outline-none">
              <div className="bg-slate-200 rounded-tl-lg rounded-tr-lg">
                <h2 className="px-4 font-medium text-base text-gray-600 py-2">
                  Marketing Options
                </h2>
              </div>
              <div className="pt-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/control/blogs/create"
                      title="Open Create Job Blog"
                      onClick={handleItemClick}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "px-4 py-2.5 flex items-center cursor-pointer text-sm"
                      )}
                    >
                      <Edit className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                      Create Job Blog
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/control/blogs/posts"
                      title="Open Job Blog Post"
                      onClick={handleItemClick}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex items-center cursor-pointer px-4 py-2.5 text-sm"
                      )}
                    >
                      <ScrollText className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                      Job Blog Post
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/control/email"
                      onClick={handleItemClick}
                      title="Open Email Marketing"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex items-center cursor-pointer px-4 py-2.5 text-sm"
                      )}
                    >
                      <FolderEdit className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                      Email Marketing
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/control/seo"
                      onClick={handleItemClick}
                      title="Open SEO"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex items-center cursor-pointer px-4 py-2.5 text-sm"
                      )}
                    >
                      <Cable className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                      Search Optimization
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
