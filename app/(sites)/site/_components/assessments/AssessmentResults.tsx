"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { AllResults } from "./AllResults";
import { AssessmentStatus } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AssessmentResultsItems {
  id: string;
  userId: string;
  fullName: string;
  testCategory: string;
  completeTime: Date;
  testId: string;
  testName: string;
  status: AssessmentStatus;
  score: number;
  createdAt: Date;
}
interface AssessmentResultsProps {
  results: AssessmentResultsItems[];
}
const AssessmentResults = ({ results }: AssessmentResultsProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/assessments/results";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/site/jobs">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row mt-[10px] justify-start gap-x-4 border-b border-gray-300">
          <Link
            href="/site/assessments"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Assessments
          </Link>
          <Link
            href="/site/assessments/results"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Results
          </Link>
        </div>
      </div>
      <div className="mt-2">
        <AllResults results={results} />
      </div>
    </>
  );
};

export default AssessmentResults;
