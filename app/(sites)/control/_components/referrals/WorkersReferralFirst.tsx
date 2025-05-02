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
import { WorkerReferrals } from "./WorkerRefferrals";

interface CombinedDataItems {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    inviteeEmail: string;
    inviteeName: string | null;
    redeemed: boolean;
    credit: number;
    uniqueCode: string;
    myRole: string;
    hide: boolean;
    invitationCode: string | null;
    joined: boolean;
    approved: boolean;
    failed: boolean;
    createdAt: Date;
  }
interface WorkersReferralFirstProps {
  combinedData: CombinedDataItems[];
}
const WorkersReferralFirst = ({
  combinedData,
}: WorkersReferralFirstProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/referrals/worker";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/control/jobs">Homepage</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Workers Referral</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="border-b border-gray-300 mt-3 flex flex-row items-end justify-between gap-x-2">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/control/referrals"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Employers
            </Link>
            <Link
              href="/control/referrals/worker"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Workers
            </Link>
          </div>
        </div>
      </div>
      <div>
        <WorkerReferrals combinedData={combinedData} />
      </div>
    </>
  );
};

export default WorkersReferralFirst;
