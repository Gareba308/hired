import { Job } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface JobCardProps {
  allJobs: Job[];
  userId: string;
}
const JobCard1 = ({ allJobs, userId }: JobCardProps) => {
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
    <section className="max-w-screen-lg mx-auto">
      <ul className="space-y-3 lg:space-y-4">
        {allJobs.map((item) => {
          return (
            <li
              key={item.id}
              className="flex items-end px-2.5 w-full sm:px-4 pb-4 pt-3 sm:py-5 duration-150 border border-gray-300 rounded-lg"
            >
              <div className="mr-3 sm:mr-4">
                {item.companyLogo ? (
                  <div
                    onClick={() =>
                      router.push(
                        `/control/jobs/${item.id}?origin=control/jobs`
                      )
                    }
                    className="relative cursor-pointer flex items-center justify-center h-[60px] sm:h-[68px] w-[60px] sm:w-[68px] overflow-hidden rounded-sm lg:h-[74px] lg:w-[74px]"
                  >
                    <Image
                      src={item.companyLogo}
                      alt={`${item.company_name} logo`}
                      title={`${item.company_name}'s logo`}
                      quality={100}
                      style={{ objectFit: "contain" }}
                      fill
                      sizes="100%"
                      priority
                    />
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      router.push(
                        `/control/jobs/${item.id}?origin=control/jobs`
                      )
                    }
                    title={`${item.company_name}'s made up logo`}
                    className="lg:w-[74px] lg:h-[74px] h-[60px] w-[60px] sm:h-[68px] sm:w-[68px] cursor-pointer py-1 px-0.5 shrink-0 text-gray-600 border border-gray-300  bg-gray-200 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
                  >
                    <div className="flex items-center justify-center shrink-0 w-full h-full">
                      <div className="text-2xl sm:text-2xl font-semibold shrink-0">
                        {getInitials(item.company_name)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full leading-tighter">
                <div className="flex w-full items-center justify-between">
                  <div>
                    {item.ownPlatformMethod === "here" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="inline-flex items-center text-xs font-medium text-green-700">
                              Quick Apply
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
                            <span className="inline-flex items-center text-xs font-medium text-indigo-700">
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
                </div>
                <Link
                  href={`/control/jobs/${item.id}?origin=control/jobs`}
                  title={item.job_title}
                >
                  <div className="text-lg lg:text-[16.3px] w-full -mt-0.5 block cursor-pointer font-medium text-primary hover:text-[#005580]">
                    <span className="line-clamp-1 w-full">
                      {item.job_title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-x-4 w-full">
                    <div className="text-[13px] lg:mb-[1px] font-medium -mt-1 text-gray-600 line-clamp-1">
                      {item.company_name}
                    </div>
                    <div>
                      {item.rankTop ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="inline-flex items-center rounded-sm bg-red-100 px-1.5 sm:px-2 py-[2px] text-xs font-normal text-red-900">
                                <span className="animate-shake">Hot</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="text-gray-600 text-sm tracking-normal">
                              <p>We recommend you check out this job!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="text-xs sm:flex hidden font-normal text-gray-600 line-clamp-1">
                          <span
                            suppressHydrationWarning
                            className="line-clamp-1"
                          >
                            {formatDistanceToNowStrict(item.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex h-4 w-full items-center space-x-1.5">
                    <div className="flex items-center">
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
                        className="h-[14px] w-[14px] text-gray-500 mr-0.5 sm:mr-[3px]"
                      >
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <p className="text-xs font-normal text-gray-600 line-clamp-1">
                        {item.county}
                      </p>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="text-gray-500"
                    />
                    <p className="text-xs font-normal text-gray-600 line-clamp-1">
                      {item.job_type}
                    </p>
                    <Separator
                      orientation="vertical"
                      className="text-gray-500"
                    />
                    <p
                      suppressHydrationWarning
                      className="text-xs sm:hidden font-normal text-gray-600 line-clamp-1"
                    >
                      {formatDistanceToNowStrict(item.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="text-xs hidden sm:flex font-normal text-gray-600 line-clamp-1">
                      {item.possible_pay}
                    </p>
                  </div>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default JobCard1;
