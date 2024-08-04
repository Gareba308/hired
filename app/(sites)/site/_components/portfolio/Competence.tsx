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
import {
  About,
  Award,
  CertificationLicense,
  Language,
  Resume,
  Skills,
} from "@prisma/client";
import OnlyAboutAndSkills from "./OnlyAboutAndSkills";

interface CompetenceProps {
  about: About | null;
  resume: Resume | null;
  skills: Skills | null;
  certification: CertificationLicense[];
  awards: Award[];
  languages: Language[];
}
const Competence = ({
  about,
  resume,
  skills,
  certification,
  awards,
  languages,
}: CompetenceProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/portfolio";
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
                <BreadcrumbPage>Competence Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/site/portfolio"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
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
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Education
          </Link>
        </div>
      </div>
      <div>
        <OnlyAboutAndSkills
          about={about}
          resume={resume}
          skills={skills}
          certification={certification}
          awards={awards}
          languages={languages}
        />
      </div>
    </>
  );
};

export default Competence;
