"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface CompanyJob {
  company_name: string;
  companyLogo: string | null;
  company_description: string | null;
  companyCategory: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  numberOfOccurrence: number;
  latestUpdatedAt: Date;
}
interface TopCompaniesProps {
  companies: CompanyJob[];
}

const AllCompanies = ({ companies }: TopCompaniesProps) => {
  const slugify = (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, (char) => encodeURIComponent(char))
      .replace(/\s+/g, "_")
      .replace(/__+/g, "_");
  };

  function getInitials(fullName: string): string {
    const nameParts = fullName.split(" ");

    if (nameParts.length >= 2) {
      const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
      return initials.toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  }

  const router = useRouter();
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">
        Employer Companies
      </h1>
      <p className='text-sm mb-2 text-gray-700'>These are employer companies that are currently hiring. Browse through to find a job from your favorite company</p>
      <div className="mt-4 sm:mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {companies
          .sort((a, b) => b.numberOfOccurrence - a.numberOfOccurrence)
          .map((company, index) => (
            <li
              key={`${slugify(company.company_name)}-${index}`}
              className="flex items-center px-3 w-full sm:px-4 pb-4 pt-3 sm:py-5 duration-150 border border-gray-200 rounded-lg"
            >
              <div className="mr-3.5 sm:mr-4">
                {company.companyLogo ? (
                  <div
                    onClick={() =>
                      router.push(
                        `/site/companies/${slugify(
                          company.company_name
                        )}?origin=site/companies`
                      )
                    }
                    className="relative cursor-pointer flex items-center justify-center h-[54px] sm:h-[60px] w-[54px] sm:w-[60px] overflow-hidden rounded-md"
                  >
                    <Image
                      src={company.companyLogo}
                      alt={`${company.company_name} logo`}
                      title={`${company.company_name}'s logo`}
                      quality={100}
                      fill
                      sizes="100%"
                      style={{ objectFit: "contain" }}
                      priority
                    />
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      router.push(
                        `/site/companies/${slugify(
                          company.company_name
                        )}?origin=site/companies`
                      )
                    }
                    title={`${company.company_name}'s made up logo`}
                    className="h-[54px] w-[54px] sm:h-[60px] sm:w-[60px] cursor-pointer py-1 px-0.5 shrink-0 text-gray-600 border border-gray-300  bg-gray-200 hover:bg-secondary rounded-md sm:flex items-center justify-center"
                  >
                    <div className="flex items-center justify-center shrink-0 w-full h-full">
                      <div className="text-2xl sm:text-2xl font-semibold shrink-0">
                        {getInitials(company.company_name)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full leading-tighter">
                <Link
                  title={company.company_name}
                  href={`/site/companies/${slugify(
                    company.company_name
                  )}?origin=site/companies`}
                >
                  <div className="text-lg lg:text-[16.3px] w-full block cursor-pointer font-medium text-primary hover:text-[#005580]">
                    <span className="line-clamp-1 text-gray-600 w-full">
                      {company.company_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-x-4 w-full">
                    <div className="text-[13px] font-medium text-gray-600 line-clamp-1">
                      Vacancies: {company.numberOfOccurrence}
                    </div>
                  </div>
                </Link>
              </div>
            </li>
          ))}
      </div>
    </>
  );
};

export default AllCompanies;
