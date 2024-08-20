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
import { Application } from "@prisma/client";
import ApplicationsRender from "./ApplicationsRender";

interface BetterApplicationProps {
  application: Application;
  applicationID: string;
}
const BetterApplication = ({
  application,
  applicationID,
}: BetterApplicationProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === `/manage/dashboard/applications/${applicationID}`;
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
                <BreadcrumbPage>Cover Letter</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href={`/manage/dashboard/applications/${applicationID}`}
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
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
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            <span className="hidden sm:flex">Uploaded & Tests</span>
            <span className="sm:hidden">Uploaded & Tests</span>
          </Link>
        </div>
      </div>
      <div>
        <ApplicationsRender application={application} />
      </div>
    </>
  );
};

export default BetterApplication;
