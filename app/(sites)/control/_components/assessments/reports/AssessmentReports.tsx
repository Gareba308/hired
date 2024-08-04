"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";
import { AllReports } from "./AllReports";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface AssessmentReportItems {
  id: string;
  userId: string;
  initiateID: string;
  fullName: string;
  email: string;
  assessmentCategory: string;
  assessmentName: string;
  questionID: string;
  subject: string;
  report: string;
  sorted: boolean;
  createdAt: Date;
}
interface AssessmentReportProps {
  reports: AssessmentReportItems[];
}
const AssessmentReports = ({ reports }: AssessmentReportProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/assessments/reports";
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
                <BreadcrumbPage>Problem Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/control/assessments"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Tests
          </Link>
          <Link
            href="/control/assessments/create-assessment"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Quiz
          </Link>
          <Link
            href="/control/assessments/create-assessment/banner"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Banner
          </Link>
          <Link
            href="/control/assessments/reports"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Reports
          </Link>
        </div>
      </div>
      <div>
        <AllReports reports={reports} />
      </div>
    </>
  );
};

export default AssessmentReports;
