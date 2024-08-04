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
import CreateBanner from "./CreateBanner";

const CreateAssessmentBanner = () => {
  const pathname = usePathname();
  const isActive = pathname === "/control/assessments/create-assessment/banner";
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
                <BreadcrumbPage>Create Banner</BreadcrumbPage>
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
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Banner
          </Link>
          <Link
            href="/control/assessments/reports"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Reports
          </Link>
        </div>
      </div>
      <div>
        <CreateBanner />
      </div>
    </>
  );
};

export default CreateAssessmentBanner;
