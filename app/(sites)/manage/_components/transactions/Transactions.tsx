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
import { AllTransactions } from "./AllTransactions";

interface PaymentItems {
  id: string,
  userId: string,
  fullName: string,
  isEmployerID: string,
  planID: string,
  county: string,
  town: string | null,
  postal: string | null,
  zip: string | null,
  companyName: string,
  companyID: string,
  invoiceID: string,
  planName: string,
  planPrice: number,
  planUnits: number,
  createdAt: Date,
}
interface TransactionsProps {
  payments: PaymentItems[];
}
const Transactions = ({ payments }: TransactionsProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/manage/transactions";
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
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div>
        <AllTransactions payments={payments} />
      </div>
    </>
  );
};

export default Transactions;
