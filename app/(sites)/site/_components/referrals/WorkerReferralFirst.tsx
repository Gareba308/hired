"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Blogs, User } from "@prisma/client";
import WorkerReferrals from "./WorkerReferrals";

interface WorkerReferralFirstProps {
  user: User;
  blog:Blogs | null;
}
const WorkerReferralFirst = ({ user, blog }: WorkerReferralFirstProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/referrals";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/site/jobs">Homepage</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Referrals & Credit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="border-b border-gray-300 mt-3 flex flex-row items-end justify-between gap-x-2">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/site/referrals"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Refer & Earn
            </Link>
            <Link
              href="/site/referrals/my-referrals"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              My Referrals
            </Link>
          </div>
        </div>
      </div>
      <div>
        <WorkerReferrals user={user} blog={blog}/>
      </div>
    </>
  );
};

export default WorkerReferralFirst;
