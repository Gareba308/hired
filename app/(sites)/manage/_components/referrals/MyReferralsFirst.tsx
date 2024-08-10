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
import { ReferredEmployers } from "./ReferredEmployers";

interface CombinedDataItems {
    inviteeEmail: string;
    inviteeName: string | null;
    uniqueCode: string;
    joined: boolean;
    failed: boolean;
    approved: boolean;
    hide: boolean;
    createdAt: Date;
    credit: number;
    id: string;
  }
  
  interface ReferredEmployersProps {
    myReferrals: CombinedDataItems[];
  }
const MyReferralsFirst = ({
  myReferrals
}: ReferredEmployersProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/manage/referrals/my-referrals";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/manage/jobs">Homepage</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Referrals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="border-b border-gray-300 mt-3 flex flex-row items-end justify-between gap-x-2">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/manage/referrals"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Refer & Earn
            </Link>
            <Link
              href="/manage/referrals/my-referrals"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              My Referrals
            </Link>
          </div>
        </div>
      </div>
      <div>
        <ReferredEmployers
          myReferrals={myReferrals}
        />
      </div>
    </>
  );
};

export default MyReferralsFirst;
