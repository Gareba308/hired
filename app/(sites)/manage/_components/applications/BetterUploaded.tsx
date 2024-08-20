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
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { Application,  AssessmentStatus } from "@prisma/client";
import PDFResumeRender from "./PDFResumeRender";

interface BetterUploadItems {
  id: string;
  userId: string;
  fullName: string;
  testName: string;
  testCategory: string;
  myAttempts: number;
  completeTime: Date;
  status: AssessmentStatus;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
interface BetterUploadedProps {
  application: Application;
  applicationID: string;
  applicantAssessmentResults: BetterUploadItems[];
}
const BetterUploaded = ({
  application,
  applicationID,
  applicantAssessmentResults,
}: BetterUploadedProps) => {
  const pathname = usePathname();
  const isActive =
    pathname ===
    `/manage/dashboard/applications/${applicationID}/uploaded-resume`;
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
                <BreadcrumbPage>Uploaded Resume & Tests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href={`/manage/dashboard/applications/${applicationID}`}
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Cover Letter
          </Link>
          <Link
            href={`/manage/dashboard/applications/${applicationID}/resume`}
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            <span className="hidden sm:flex">Generated Resume</span>
            <span className="sm:hidden">Generated</span>
          </Link>
          <Link
            href={`/manage/dashboard/applications/${applicationID}/uploaded-resume`}
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            <span className="hidden sm:flex">Uploaded & Tests</span>
            <span className="sm:hidden">Uploaded & Tests</span>
          </Link>
        </div>
      </div>
      <div>
        <PDFResumeRender
          application={application}
          applicantAssessmentResults={applicantAssessmentResults}
        />
      </div>
    </>
  );
};

export default BetterUploaded;
