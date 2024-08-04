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
import Education from "./Education";
import { SecondaryEducation, TertiaryEducation } from "@prisma/client";

interface EducationPortfolioProps {
  secondaryEducation: SecondaryEducation | null;
  tertiaryEducation: TertiaryEducation[];
}
const EducationPortfolio = ({
  secondaryEducation,
  tertiaryEducation,
}: EducationPortfolioProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/portfolio/education";
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
                <BreadcrumbPage>Education Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/site/portfolio"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Competence
          </Link>
          <Link
            href="/site/portfolio/experience"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Experience
          </Link>
          <Link
            href="/site/portfolio/education"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Education
          </Link>
        </div>
      </div>
      <div>
        <Education
          secondaryEducation={secondaryEducation}
          tertiaryEducation={tertiaryEducation}
        />
      </div>
    </>
  );
};

export default EducationPortfolio;
