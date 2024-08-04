"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { AcceptToBeAssessed, AssessmentBanner } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import InitiatedInstant from "./InitiatedInstant";

interface AssessmentBannersProps {
  banner: AssessmentBanner;
  instantResults: AcceptToBeAssessed;
  instantID: string;
}
const InstantResultsBanner = ({
  banner,
  instantResults,
  instantID,
}: AssessmentBannersProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/site/assessments/${instantID}`;
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/site/jobs">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/site/assessments">Assessments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Result</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start gap-x-4 border-b border-gray-300">
          <Link
            href={`/site/assessments/${instantID}`}
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Assessments
          </Link>
          <Link
            href="/site/assessments/results"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Results
          </Link>
        </div>
      </div>
      <div>
        <InitiatedInstant banner={banner} instantResults={instantResults} />
      </div>
    </>
  );
};

export default InstantResultsBanner;
