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
import { AllAccounts } from "./AllAccounts";

interface TransactionAccountsItems {
  id: string;
  userId: string;
  fullName: string;
  isEmployerID: string;
  planID: string;
  companyID: string;
  companyName: string;
  planPrice: number;
  planName: string;
  planUnits: number;
  invoiceID: string;
  createdAt: Date;
}
interface TransactionAccountsProps {
  purchases: TransactionAccountsItems[];
}
const TransactionAccounts = ({ purchases }: TransactionAccountsProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/transactions/account";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/control/jobs">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Unit Purchases</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="border-b border-gray-300 mt-2 flex flex-row items-end justify-between gap-x-2">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/control/transactions"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Payments
            </Link>
            <Link
              href="/control/transactions/account"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Purchases
            </Link>
            <Link
              href="/control/transactions/pending"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Pending
            </Link>
          </div>
        </div>
      </div>
      <div>
        <AllAccounts purchases={purchases} />
      </div>
    </>
  );
};

export default TransactionAccounts;
