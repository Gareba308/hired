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
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
