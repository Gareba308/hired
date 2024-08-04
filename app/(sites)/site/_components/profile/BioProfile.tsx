"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { WorkerBio } from "@prisma/client";
import BioData from "./BioData";

interface BioProfileProps {
    profileBio: WorkerBio[];
}
const BioProfile = ({ profileBio, }: BioProfileProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/profile";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/site/jobs">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile Bio Data</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/site/profile"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Bio Data
          </Link>
          <Link
            href="/site/profile/desirable"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Desirable
          </Link>
          <Link
            href="/site/profile/contact"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Contact
          </Link>
          <Link
            href="/site/profile/security"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Security
          </Link>
        </div>
      </div>
      <div>
        <BioData profileBio={profileBio} />
      </div>
    </>
  );
};

export default BioProfile;
