"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [state, setState] = useState(false);
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
        { title: "Job Seekers Blog", path: "/home/blogs/job-seekers" },
        { title: "Employers Blog", path: "/home/blogs/employers" },
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
      <nav className="relative items-center pt-3 px-4 mx-auto max-w-screen-xl md:px-6 md:flex md:space-x-6">
        <div className="flex justify-between">
          <Link href="/" className="rounded-md">
            <Image
              src={
                "https://res.cloudinary.com/dx0i37cyd/image/upload/v1722608373/Hired-_Kenya_3_tyegve.png"
              }
              height={70}
              width={74}
              alt="Logo"
              title="Logo"
              className="rounded-sm"
              quality={100}
              priority={true}
            />
          </Link>
          <button
            className="text-gray-500 outline-none md:hidden"
            onClick={() => setState(!state)}
          >
            {state ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
        <ul
          className={`flex-1 justify-between z-50 mt-0 text-sm sm:text-[15px] md:font-medium md:flex md:mt-0 ${
            state
              ? "absolute inset-x-0 px-4 border-b rounded-b-lg shadow-sm md:shadow-none bg-white md:border-none md:static"
              : "hidden"
          }`}
        >
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
          <div className="flex flex-col pt-4 md:pt-0 pb-4 md:pb-0 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 lg:space-x-4 sm:items-center">
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
