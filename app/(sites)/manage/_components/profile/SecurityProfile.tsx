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
import { User } from "@prisma/client";
import CompanyAccount from "./CompanyAccount";

interface SecurityProfileProps {
  user: User;
  position: string;
  isEmployerID: string;
}
const SecurityProfile = ({
  user,
  position,
  isEmployerID,
}: SecurityProfileProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/manage/profile/security";
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
                <BreadcrumbPage>Security</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/manage/profile"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Company Profile
          </Link>
          <Link
            href="/manage/profile/security"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Account Security
          </Link>
        </div>
      </div>
      <div>
        <CompanyAccount
          user={user}
          position={position as string}
          isEmployerID={isEmployerID as string}
        />
      </div>
    </>
  );
};

export default SecurityProfile;
