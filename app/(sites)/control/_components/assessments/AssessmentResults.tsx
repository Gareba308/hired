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
  myAttempts: number;
  completeTime: Date;
  testCategory: string;
  testId: string;
  testName: string;
  status: AssessmentStatus;
  score: number;
  createdAt: Date;
}
interface AssessmentResultsProps {
  results: AssessmentResultsItems[];
  assessmentID: string;
}
const AssessmentResults = ({
  results,
  assessmentID,
}: AssessmentResultsProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/control/assessments/${assessmentID}/results`;
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
                <BreadcrumbLink href="/control/assessments">
                  Tests
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/control/assessments/${assessmentID}`}>
                  Questions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 sm:mt-[9px] gap-x-4 border-b border-gray-300">
          <Link
            href={`/control/assessments/${assessmentID}`}
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Questions
          </Link>
          <Link
            href={`/control/assessments/${assessmentID}/results`}
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
      <div>
        <AllResults results={results} />
      </div>
    </>
  );
};

export default AssessmentResults;
