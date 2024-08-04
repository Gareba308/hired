"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { EmployerPlans } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AllPlans from "./AllPlans";

interface PlansProps {
  plans: EmployerPlans[];
}
const Plans = ({ plans }: PlansProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/plans";
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
                <BreadcrumbPage>All Plans</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="border-b border-gray-300 mt-2 flex flex-row items-end justify-between gap-x-2">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/control/plans"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              The Plans
            </Link>
            <Link
              href="/control/plans/create"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Create Plan
            </Link>
          </div>
        </div>
      </div>
      <div>
        <AllPlans plans={plans} />
      </div>
    </>
  );
};

export default Plans;
