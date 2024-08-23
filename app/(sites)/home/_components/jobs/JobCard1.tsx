"use client";
import { Job } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { Bookmark, Building2, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface JobCardProps {
  allJobs: Job[];
  popular: Job[];
}
const JobCard1 = ({ allJobs, popular }: JobCardProps) => {
  const router = useRouter();

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
    <section className="max-w-screen-lg mx-auto">
      <ul className="space-y-4 lg:space-y-6">
        {allJobs.map((item, index) => {
          const thePopular = popular.some(
            (newPopular) => newPopular.id === item.id
          );
          return (
            <li
              key={item.id}
              className="px-3 sm:px-4 py-3 sm:py-[17px] duration-150 border border-gray-300 rounded-lg"
            >
              <div className="">
                <div className="sm:hidden flex mb-0.5 items-center justify-between w-full gap-x-4">
                  <Link
                    href={`/home/jobs/${item.id}`}
                    title="Open job details"
                    className="text-[17px] capitalize line-clamp-1 text-slate-700 hover:underline hover:text-[#005580] cursor-pointer sm:text-[18px] font-semibold"
                  >
                    {item.job_title.toLocaleLowerCase()}
                  </Link>
                  <span>
                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      size="icon"
                      type="button"
                      className="h-7 w-7 hover:bg-inherit"
                    >
                      <Bookmark className="h-5 w-5 text-gray-500 font-normal" />
                    </Button>
                  </span>
                </div>

                <div className="flex items-center mb-0.5 sm:gap-x-2">
                  {item.companyLogo ? (
                    <div>
                      <Link
                        href={`/home/jobs/${item.id}`}
                        title="Open job details"
                        className="hidden w-[60px] cursor-pointer py-1 px-0.5 h-[60px] border shadow-sm border-gray-300 bg-gray-200 shrink-0 rounded-lg sm:flex items-center justify-center"
                      >
                        <Image
                          src={item.companyLogo as string}
                          alt="Logo"
                          height={66}
                          width={66}
                          quality={100}
                          title="Company logo"
                          className="shrink-0 rounded-lg"
                        />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/home/jobs/${item.id}`}
                      title="Open job details"
                      className="hidden w-[60px] cursor-pointer py-1 px-0.5 h-[60px] border shadow-sm border-gray-300 shrink-0 bg-gray-200 rounded-lg sm:flex items-center justify-center"
                    >
                      <div className="flex items-center justify-center shrink-0 w-full h-full">
                        <div className="text-2xl font-semibold text-gray-700 shrink-0">
                          {getInitials(item.company_name as string)}
                        </div>
                      </div>
                    </Link>
                  )}
                  <div className="w-full flex items-start flex-col leading-tight">
                    <div className="hidden sm:flex items-center w-full justify-between gap-x-4">
                      <Link
                        href={`/home/jobs/${item.id}`}
                        title="Open job details"
                        className="text-[17px] capitalize line-clamp-1 text-slate-700 hover:underline hover:text-[#005580] cursor-pointer sm:text-[18px] font-semibold"
                      >
                        {item.job_title.toLocaleLowerCase()}
                      </Link>
                      <span>
                        <Button
                          variant="ghost"
                          onClick={() => {}}
                          size="icon"
                          type="button"
                          className="h-7 w-7 hover:bg-inherit"
                        >
                          <Bookmark className="h-5 w-5 text-gray-500 font-normal" />
                        </Button>
                      </span>
                    </div>
                    <span
                      onClick={() =>
                        router.push(`/site/companies/${item.companyId}`)
                      }
                      className="cursor-pointer flex items-center hover:text-[#005580] text-sm sm:-mt-0.5 text-gray-600 font-medium"
                    >
                      <Building2 className="h-4 w-4 text-gray-500 mr-1" />
                      {item.company_name}
                    </span>
                    <div className="flex items-center w-full justify-between gap-x-4">
                      <span className="flex items-center gap-x-1 text-sm text-gray-500 font-normal">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-gray-500"
                        >
                          <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
                          <circle cx="12" cy="8" r="2" />
                          <path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835" />
                        </svg>
                        {item.county}
                      </span>
                      <div>
                        {thePopular && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="inline-flex items-center rounded-sm bg-orange-100 px-2 py-1 text-xs font-medium text-orange-900">
                                  <span className="animate-shake">Popular</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal">
                                <p>
                                  This job is getting high amount of
                                  applications right now!
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-0.5 w-full flex items-center gap-x-2 sm:gap-3">
                  <div className="flex items-center flex-row gap-5">
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-gray-500"
                      >
                        <path d="M12 12h.01" />
                        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                        <rect width="20" height="14" x="2" y="6" rx="2" />
                      </svg>
                      {item.job_type}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-gray-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {formatDistanceToNowStrict(item.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <Link
                  href={`/home/jobs/${item.id}`}
                  title="Open job details"
                  className="sm:text-base text-sm mt-0.5 font-normal text-gray-600 cursor-pointer line-clamp-2"
                >
                  {item.summaryDescription}
                </Link>
                {item.ownPlatformMethod === "here" ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="inline-flex items-center mt-0.5 text-[13px] font-medium text-green-700">
                          <Zap className="h-4 w-4 mr-1.5 shrink-0" /> Quick
                          Apply
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="text-gray-600 text-sm tracking-normal">
                        <p>
                          The application process is on this platform and
                          simplified
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="inline-flex items-center mt-0.5 text-[13px] font-medium text-indigo-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1.5 shrink-0"
                          >
                            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                            <path d="m21 3-9 9" />
                            <path d="M15 3h6v6" />
                          </svg>
                          External Apply
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="text-gray-600 text-sm tracking-normal">
                        <p>
                          The application process is on an external platform
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default JobCard1;
