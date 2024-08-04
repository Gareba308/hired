"use client";

import QuillPreview from "@/components/QuillPreview";
import { Company, Job } from "@prisma/client";
import { BadgeCheck, BadgeX, Briefcase, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopEmployer {
  companyDetails: Company;
  vacanciesCount: number;
  openings: number;
  individualJobs: Job[];
}

interface CompanyCardProps {
  combinedData: TopEmployer[];
}

const CompanyCard = ({ combinedData }: CompanyCardProps) => {
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

  return (
    <div className="mx-auto max-w-2xl md:max-w-7xl">
      <>
        <div className="max-w-screen-xl mx-auto">
          <div className="mt-3 lg:mt-0">
            <div className="grid gap-4 xl:grid-cols-2">
              {combinedData.flatMap((item) => (
                <div
                  key={item.companyDetails.id}
                  className="border w-full border-gray-200 pt-2 pb-2.5 px-2.5 lg:px-3 rounded-lg"
                >
                  <div className="flex items-center w-full gap-x-3 justify-between">
                    <div className="flex items-center">
                      {item.companyDetails.company_name && (
                        <Link
                          prefetch={true}
                          href={`/site/companies/${item.companyDetails.id}?origin=site/companies`}
                          className="text-gray-600 hover:underline line-clamp-1 font-semibold text-[17.5px]"
                        >
                          {item.companyDetails.company_name}
                        </Link>
                      )}
                      {item.companyDetails.verified &&
                        !item.companyDetails.suspended &&
                        !item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-[#b45309] text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the admin did a
                                background check to verify authenticity of this
                                company.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.suspended &&
                        item.companyDetails.verified &&
                        !item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                verified although at the moment it has been
                                suspended.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.suspended &&
                        item.companyDetails.verified &&
                        item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                verified although at the moment it has been
                                suspended.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {!item.companyDetails.suspended &&
                        item.companyDetails.verified &&
                        item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-green-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                verified and is a special category of company.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.special &&
                        !item.companyDetails.verified &&
                        !item.companyDetails.suspended && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-green-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                a special category of company.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.suspended &&
                        !item.companyDetails.verified &&
                        !item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeX className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The mark indicates that the company has been
                                suspended and it hasn&apos;t been verified.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                    </div>
                  </div>
                  <Link
                    prefetch={true}
                    href={`/site/companies/${item.companyDetails.id}?origin=site/companies`}
                    className="flex items-start w-full mb-1 gap-x-2.5"
                  >
                    <div>
                      {item.companyDetails.logo ? (
                        <div>
                          <div className="w-[74px] cursor-pointer py-1 px-0.5 h-[74px] border border-zinc-200 bg-white/70 shrink-0 rounded-sm flex items-center justify-center">
                            <Image
                              src={item.companyDetails.logo as string}
                              alt={item.companyDetails.company_name as string}
                              height={74}
                              width={74}
                              quality={100}
                              className="shrink-0"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-[72px] cursor-pointer py-1 px-0.5 h-[72px] border border-zinc-200 shrink-0  bg-white/70 rounded-sm flex items-center justify-center">
                          <div className="flex items-center justify-center shrink-0 w-full h-full">
                            <div className="text-2xl sm:text-3xl font-medium text-gray-600 shrink-0">
                              {getInitials(
                                item.companyDetails.company_name as string
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="-space-y-1 w-full">
                      {item.companyDetails.category && (
                        <p className="text-gray-700 flex items-center text-sm font-normal pb-1 line-clamp-1">
                          <Briefcase className="h-4 w-4 mr-1 shrink-0 text-gray-500" />
                          <span className="line-clamp-1">
                            {item.companyDetails.category}
                          </span>
                        </p>
                      )}
                      {item.companyDetails.county && (
                        <p className="text-gray-700 text-sm line-clamp-1 flex items-center pb-0.5">
                          <MapPinIcon className="h-4 w-4 mr-1 shrink-0 text-gray-500" />
                          <span className="line-clamp-1">
                            {item.companyDetails.town}
                            {item.companyDetails.county && (
                              <>, {item.companyDetails.county}</>
                            )}
                          </span>
                        </p>
                      )}
                      {item && (
                        <p className="text-gray-700 text-sm flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1 line-clamp-1 text-gray-500"
                          >
                            <rect
                              width="18"
                              height="11"
                              x="3"
                              y="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                          </svg>
                          <span className="line-clamp-1">
                            {item.openings} vacancies in{" "}
                            {item.vacanciesCount} openings.
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                  {item.companyDetails.company_description && (
                    <>
                      <div className="flex items-center justify-between gap-x-4 w-full mb-0.5">
                        <span className="font-medium text-base text-gray-600">
                          Description:
                        </span>
                        {item.companyDetails.suspended && (
                          <span className="inline-flex items-center rounded-sm bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            Suspended
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/site/companies/${item.companyDetails.id}?origin=site/companies`}
                        className="text-gray-700 text-sm -mt-1 font-normal line-clamp-2"
                      >
                        <QuillPreview
                          htmlContent={
                            item.companyDetails.company_description as string
                          }
                        />
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default CompanyCard;
