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
  id: string;
  userId: string;
  isEmployerID: string;
  fullName: string;
  userEmail: string;
  companyID: string;
  companyName: string;
  mPesaID: string;
  paymentPhone: string;
  amount: number;
  createdAt: Date;
}
interface TransactionsProps {
  payments: PaymentItems[];
  countPayments: number;
  percentagePayments: string;
  countPaymentSuccess: number;
  percentagePaymentSuccess: string;
  countPaymentWeek: number;
  percentagePaymentWeek: string;
  countPaymentPending: number;
  percentagePaymentPending: string;
}
const Transactions = ({
  payments,
  countPayments,
  percentagePayments,
  countPaymentSuccess,
  percentagePaymentSuccess,
  countPaymentWeek,
  percentagePaymentWeek,
  countPaymentPending,
  percentagePaymentPending,
}: TransactionsProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/transactions";
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
                <BreadcrumbPage>MPesa Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="border-b border-gray-300 mt-2 flex flex-row items-end justify-between gap-x-2">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/control/transactions"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Payments
            </Link>
            <Link
              href="/control/transactions/account"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
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
        <AllTransactions
          payments={payments}
          countPayments={countPayments}
          percentagePayments={percentagePayments}
          countPaymentSuccess={countPaymentSuccess}
          percentagePaymentSuccess={percentagePaymentSuccess}
          countPaymentWeek={countPaymentWeek}
          percentagePaymentWeek={percentagePaymentWeek}
          countPaymentPending={countPaymentPending}
          percentagePaymentPending={percentagePaymentPending}
        />
      </div>
    </>
  );
};

export default Transactions;
