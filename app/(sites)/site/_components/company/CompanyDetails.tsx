"use client";

import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Company, Job } from "@prisma/client";
import {
  BadgeCheck,
  BadgeX,
  Briefcase,
  CalendarClock,
  CornerUpLeft,
  Lock,
  Globe,
  Info,
  Mail,
  MapPinIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JobCard3 from "../job/JobCard3";
import { cn } from "@/lib/utils";
interface TopCompany {
  companyDetails: Company;
  vacanciesCount: number;
}
interface CompanyDetailsProps {
  company: Company;
  companyCounts: TopCompany[];
  allJobs: Job[];
}

const CompanyDetails = ({
  company,
  companyCounts,
  allJobs,
}: CompanyDetailsProps) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean>(
    company.verified || false
  );
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

  const thisCompanyCounts = companyCounts.filter(
    (item) => item.companyDetails.id === company.id
  );

  return (
    <>
      <main className="mx-auto lg:-mt-2 max-w-7xl">
        <section>
          <div className="flex flex-wrap">
            <div className="w-full min-h-[calc(100vh-100px)] lg:mt-2 px-4 pt-2 pb-4 mx-auto bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
              <div className="flex flex-row items-center border-b border-gray-200 pb-1">
                <a
                  className="hover:text-[#005580] cursor-pointer"
                  onClick={() => router.push("/site/companies")}
                >
                  <CornerUpLeft className="h-6 w-6 mr-2 shrink-0" />
                </a>
                <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
                  Company&apos;s Profile
                </h2>
              </div>
              <div className="lg:col-span-3 mt-2 lg:mt-3 lg:pb-2">
                <div>
                  <>
                    <div className="border-b border-gray-200 pb-2">
                      <div className="flex flex-row gap-x-4 w-full justify-between item-start">
                        <div className="w-full mt-0">
                          {company?.company_name && (
                            <h3 className="font-bold flex items-center gap-x-1 text-gray-600 tracking-tight text-[17.5px] sm:text-xl lg:text-2xl">
                              {company?.company_name}{" "}
                              {isVerified &&
                                !company.suspended &&
                                !company.special && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeCheck className="h-[22px] w-[22px] fill-[#b45309] text-primary-foreground text-base" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                        The checkmark indicates that the admin
                                        did a background check to verify
                                        authenticity of this company.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              {company.suspended &&
                                isVerified &&
                                !company.special && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeCheck className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                        The checkmark indicates that the company
                                        is verified although at the moment it
                                        has been suspended.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              {company.suspended &&
                                isVerified &&
                                company.special && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeCheck className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                        The checkmark indicates that the company
                                        is verified although at the moment it
                                        has been suspended.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              {!company.suspended &&
                                isVerified &&
                                company.special && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeCheck className="h-[22px] w-[22px] fill-green-700 text-primary-foreground text-base" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                        The checkmark indicates that the company
                                        is verified although at the moment it
                                        has been suspended.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              {company.special &&
                                !company.suspended &&
                                !company.verified && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeCheck className="h-[22px] w-[22px] fill-green-700 text-primary-foreground text-base" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                        The checkmark indicates that the company
                                        is verified although at the moment it
                                        has been suspended.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              {company.suspended &&
                                !isVerified &&
                                !company.special && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <BadgeX className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                        The mark indicates that the company has
                                        been suspended and it hasn&apos;t been
                                        verified.
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                            </h3>
                          )}
                          {company?.category && (
                            <h2 className="text-lg font-medium shrink-0 tracking-tight leading-tight text-gray-600">
                              {company?.category}
                            </h2>
                          )}
                          {company?.county && (
                            <p className="flex items-center text-sm text-gray-500 font-normal">
                              <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-500" />{" "}
                              {company?.county && (
                                <span className="mr-1">{company?.town},</span>
                              )}
                              <span>{company.county}</span>
                            </p>
                          )}
                          <div className="flex item-center">
                            {company?.established && (
                              <div className="flex items-center mr-4 text-sm font-normal text-gray-500">
                                <CalendarClock className="h-4 w-4 mr-1.5 text-gray-500" />{" "}
                                {company.established && (
                                  <span className="mr-1">
                                    {company.established}
                                  </span>
                                )}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4 ml-0.5 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                      Represents the year when this company was
                                      established.
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                            {company.suspended && (
                              <span className="inline-flex items-center rounded-sm bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                Suspended
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex justify-end">
                          <div>
                            {company.logo ? (
                              <div className="relative cursor-pointer shrink-0 border border-gray-200 bg-gray-200 h-[96px] w-[96px] overflow-hidden rounded-sm">
                              <Image
                                src={company.logo}
                                alt={company.company_name as string}
                                title={company.company_name as string}
                                quality={100}
                                fill
                                sizes="100%"
                                priority
                              />
                            </div>
                          ) : (
                            <div
                              title={`${company.company_name as string}'s made up logo`}
                              className="h-[96px] w-[96px] cursor-pointer py-1 px-0.5 shrink-0 text-gray-600 border border-gray-200  bg-gray-200 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
                            >
                              <div className="flex items-center justify-center shrink-0 w-full h-full">
                                <div className="text-2xl sm:text-2xl font-semibold shrink-0">
                                  {getInitials(company.company_name as string)}
                                </div>
                              </div>
                            </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center mt-1.5 w-full justify-between text-base">
                        {company.employerPhone && (
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => {
                              const mailtoLink = `mailto:${company.secondaryEmail}`;
                              window.location.href = mailtoLink;
                            }}
                            className="rounded-sm font-normal text-sm border text-primary hover:text-primary hover:bg-secondary bg-white border-gray-200 hover:border-gray-200"
                          >
                            <a
                              target="_blank"
                              href={`tel:${company.employerPhone}`}
                              className="flex items-center text-sm"
                            >
                              <Mail className="w-4 h-4 mr-1.5 font-semibold" />
                              Email
                            </a>
                          </Button>
                        )}
                        {company.website && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              let url: string | null = company.website;
                              if (url) {
                                if (!url.startsWith("https://www.")) {
                                  url = `https://www.${url}`;
                                }
                                window.open(
                                  url,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }
                            }}
                            className="rounded-sm text-sm font-normal text-blue-700 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-800"
                          >
                            <Globe className="w-4 h-4 mr-1.5" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                  <div className="lg:col-span-2 lg:col-start-1 mt-4">
                    <>
                      {company && (
                        <div className="w-full">
                          <div className="flex items-center justify-between border-b border-gray-200 mb-1 pb-1">
                            <h3 className="text-xl font-medium text-gray-700">
                              Company&apos;s Description
                            </h3>
                          </div>
                          {company.company_description && (
                            <div className="text-gray-600 text-base">
                              <Preview
                                value={
                                  company.company_description as string
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  </div>
                  <div className="lg:col-span-2 lg:col-start-1 mt-6">
                    <div className="text-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-medium text-gray-700">
                          Our Latest Jobs
                        </h3>
                        <div>
                          {thisCompanyCounts.flatMap((top) => (
                            <div
                              key={top.companyDetails.id}
                              className="flex flex-row items-center"
                            >
                              <h3 className="text-3xl font-medium text-sky-700 mr-1">
                                {top.vacanciesCount}
                              </h3>{" "}
                              <h3 className="flex flex-col leading-tight text-sm">
                                <span className="text-sky-700">
                                  available vacancies
                                </span>{" "}
                                <span>in this organization</span>
                              </h3>
                            </div>
                          ))}
                        </div>
                      </div>

                      {allJobs.length !== 0 ? (
                        <div className="mt-1 text-base text-gray-700">
                          <JobCard3 allJobs={allJobs} />
                        </div>
                      ) : (
                        <section className="relative max-w-screen-xl mx-auto border-t border-gray-200 mt-1.5 pb-4">
                          <div className="relative z-10 lg:gap-x-4 items-center lg:items-start lg:flex">
                            <div className="flex-1 max-w-full sm:max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
                              <h3 className="text-xl text-center lg:text-start tracking-tight text-gray-600 font-bold sm:text-2xl">
                                No available jobs
                              </h3>
                              <p className="text-gray-700 text-base leading-normal mt-2">
                                We currently do not have any active job
                                openings, kindly check back later if there will
                                be an update. Or find a job by clicking{" "}
                                <span className="font-bold">Explore Jobs</span>.
                              </p>
                              <div className="flex flex-col sm:gap-x-6 sm:flex-row  lg:flex-col items-start gap-y-4 xl:gap-x-4 xl:flex-row mt-4">
                                <div className="flex w-full items-center justify-center lg:justify-start">
                                  <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() =>
                                      router.push(
                                        origin
                                          ? `/${origin}`
                                          : "/site/companies"
                                      )
                                    }
                                    type="button"
                                    className="bg-secondary hover:opacity-90 hover:bg-slate-200 w-full lg:w-48"
                                  >
                                    To Companies
                                  </Button>
                                </div>
                                <div className="flex w-full items-center justify-center lg:justify-start">
                                  <Button
                                    size="lg"
                                    variant="default"
                                    onClick={() => router.push("/site/jobs")}
                                    type="button"
                                    className="hover:bg-primary w-full lg:w-48 hover:opacity-90 font-normal"
                                  >
                                    Explore Jobs
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center relative lg:mt-0 lg:w-auto">
                              <Image
                                src="https://res.cloudinary.com/dx0i37cyd/image/upload/v1711533885/bwink_ppl_01_single_01_sppekj.jpg"
                                alt="Start Messaging"
                                height={320}
                                width={320}
                                quality={100}
                                priority={true}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm leading-normal italic">
                              <span className="font-medium not-italic mr-1.5">
                                Note:
                              </span>
                              Please be aware that certain details about the
                              company may have been omitted in this section. For
                              comprehensive information, please visit the
                              company&apos;s{" "}
                              <a
                                onClick={() => {
                                  let url: string | null = company.website;
                                  if (url) {
                                    if (!url.startsWith("https://www.")) {
                                      url = `https://www.${url}`;
                                    }
                                    window.open(
                                      url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }
                                }}
                                className={cn(
                                  company.website
                                    ? "text-blue-700 cursor-pointer"
                                    : ""
                                )}
                              >
                                website
                              </a>
                              .
                            </p>
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
              <div className="flex flex-col w-full h-full">
                <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                  <div className="flex justify-between gap-y-6 flex-col">
                    <div className="hidden rounded-sm lg:block lg:pb-4 lg:space-y-2 lg:bg-slate-200 lg:border px-4 border-slate-200 lg:shadow-sm lg:pt-2.5">
                      <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                        <Briefcase className="h-10 w-10" />
                      </h2>

                      <p className="flex items-start gap-2 text-gray-700">
                        <span className="text-base">
                          A job posting will remain visible until the
                          application deadline is reached.
                        </span>
                      </p>

                      <p className="flex items-start mt-3 gap-2 text-gray-700">
                        <span className="text-base">
                          Submit your application promptly to ensure you
                          don&apos;t miss the opportunity.
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col h-full justify-center">
                      <div className="hidden lg:block rounded-sm lg:pb-4 lg:space-y-2 lg:bg-slate-200 lg:border px-4 border-slate-200 lg:shadow-sm lg:pt-2.5">
                        <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                          <Lock className="h-10 w-10" />
                        </h2>

                        <p className="flex items-start gap-2 text-gray-700">
                          <span className="text-base">
                            To ensure the safety of job seekers on our platform,
                            we conduct thorough background checks to verify the
                            credibility of companies.
                          </span>
                        </p>

                        <p className="flex items-start mt-3 gap-2 text-gray-700">
                          <span className="text-base">
                            Any concerns regarding a company can be discreetly
                            reported to us via email or direct message.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CompanyDetails;
