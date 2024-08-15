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
import { RedeemHistory } from "./RedeemHistory";

interface CombinedDataItems {
  id: string;
  fullName: string;
  paymentID: string;
  phoneNumber: string;
  paymentDate: Date;
  paymentPhone: string;
  userId: string;
  email: string;
  availablePoints: number;
  subtotal: number;
  tax: number;
  transactionFee: number;
  totalPayable: number;
  paid: boolean;
  hide: boolean;
  createdAt: Date;
}
interface RedeemHistoryFirstProps {
  history: CombinedDataItems[];
}
const RedeemsHistoryFirst = ({ history }: RedeemHistoryFirstProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/referrals/worker/payments";
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
                <BreadcrumbPage>Referral Payments</BreadcrumbPage>
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
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Workers
            </Link>
            <Link
              href="/control/referrals/worker/payments"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Redeems
            </Link>
          </div>
        </div>
      </div>
      <div>
        <RedeemHistory history={history} />
      </div>
    </>
  );
};

export default RedeemsHistoryFirst;
