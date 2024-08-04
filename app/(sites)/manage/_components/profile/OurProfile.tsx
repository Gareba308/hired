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
import CompanyProfile from "./CompanyProfile";
import { Company } from "@prisma/client";

interface OurProfileProps {
    profile: Company | null;
}
const OurProfile = ({ profile }: OurProfileProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/manage/profile";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/manage/jobs">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/manage/profile"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Company Profile
          </Link>
          <Link
            href="/manage/profile/security"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Account Security
          </Link>
        </div>
      </div>
      <div>
        <CompanyProfile profile={profile} />
      </div>
    </>
  );
};

export default OurProfile;
