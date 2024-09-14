"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import MobileSidebar from "@/app/(sites)/home/_components/menu/MobileSidebar";

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredMenu(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 200);
  };

  const navigation = [
    { title: "Jobs", path: "/home/jobs" },
    {
      title: "Resources",
      submenu: [
        { title: "Career Advice", path: "/home/blogs/job-seekers" },
        { title: "Hiring Insight", path: "/home/blogs/employers" },
      ],
    },
    { title: "About Us", path: "/home/about" },
    {
      title: "FAQs",
      submenu: [
        { title: "Job Seekers FAQs", path: "/home/faqs/job-seekers" },
        { title: "Employers FAQs", path: "/home/faqs/employers" },
      ],
    },
  ];

  return (
    <div className="border border-b border-gray-200 pb-1.5 h-[70px]">
      <nav className="relative items-center pt-3 px-4 h-full mx-auto max-w-screen-xl md:px-6 md:flex md:space-x-6">
        <div className="flex h-full justify-between">
          <Link href="/" className="rounded-md flex items-center">
            <Image
              src={
                "https://res.cloudinary.com/dx0i37cyd/image/upload/v1723627737/veryHired_lo5n1w.png"
              }
              height={70}
              width={85}
              alt="Logo"
              title="Logo"
              className="rounded-sm hidden md:flex"
              quality={100}
              priority={true}
            />
            <Image
              src={
                "https://res.cloudinary.com/dx0i37cyd/image/upload/v1723627737/veryHired_lo5n1w.png"
              }
              height={55}
              width={65}
              alt="Logo"
              title="Logo"
              className="rounded-sm md:hidden"
              quality={100}
              priority={true}
            />
          </Link>
          <div className="flex items-center">
            <Link
              href="/home/jobs"
              className="text-gray-500 text-[14.3] flex items-center hover:text-sky-700 font-medium md:hidden mr-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[18px] w-[18px] mr-1.5 shrink-0"
              >
                <path d="M12 12h.01" />
                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              All Jobs
            </Link>
            <MobileSidebar />
          </div>
        </div>
        <ul className="hidden flex-1 justify-between z-50 mt-0 w-full text-sm sm:text-[15px] md:font-medium md:flex md:mt-0">
          <div className="items-center space-y-4 md:flex md:space-x-4 md:space-y-0">
            {navigation.map((item, idx) => (
              <li
                key={idx}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                {item.submenu ? (
                  <>
                    <div className="flex items-center">
                      <button className="text-gray-500 hover:text-sky-700 focus:outline-none flex items-center">
                        {item.title}
                        <span className="ml-0.5">
                          {hoveredMenu === item.title ? (
                            <ChevronUp className="h-[16px] w-[16px] text-sky-700" />
                          ) : (
                            <ChevronDown className="h-[16px] w-[16px] text-gray-500" />
                          )}
                        </span>
                      </button>
                    </div>
                    {hoveredMenu === item.title && (
                      <ul
                        className="absolute top-full left-0 mt-2 py-2 w-48 bg-white border border-gray-200 shadow-lg rounded-sm z-10"
                        onMouseEnter={() => handleMouseEnter(item.title)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.submenu.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              href={subItem.path}
                              className="block px-4 py-[9px] text-gray-500 hover:text-sky-700 hover:bg-secondary text-sm font-normal"
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className="text-gray-500 hover:text-sky-700 focus:outline-none flex items-center"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </div>
          <div className="flex flex-col pt-4 w-full md:w-fit md:pt-0 pb-4 md:pb-0 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 lg:space-x-4 sm:items-center">
            <li className="order-2 md:py-0">
              <Link
                href={"/home/login"}
                className="py-2 px-5 rounded-sm w-full font-medium text-primary bg-gray-300 hover:bg-gray-300 hover:opacity-90 hover:text-sky-700 text-center border border-gray-200 hover:bg-opacity-90 duration-150 block md:py-3 md:inline"
              >
                Job Seekers
              </Link>
            </li>
            <li className="order-2 md:py-0">
              <Link
                href={"/home/login/enterprises"}
                className="py-2 px-5 rounded-sm font-medium w-full text-white text-center bg-slate-800 hover:bg-opacity-90 active:bg-slate-800 duration-150 block md:py-3 md:inline"
              >
                For Employers
              </Link>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;