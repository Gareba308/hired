"use client";
import { Application, Job, JobView, SavedJobs } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { Bookmark, Building2, Loader2, MapPinIcon } from "lucide-react";
import QuillPreview from "@/components/QuillPreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  allJobs: Job[];
  popular: Job[];
  viewed: JobView[];
  viewID: string;
}

const building = (
  <svg
    fill="#9ca3af"
    className="h-[60px] w-[60px] text-gray-400"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M22,7H17V2a1,1,0,0,0-1-1H8A1,1,0,0,0,7,2V7H2A1,1,0,0,0,1,8V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V8A1,1,0,0,0,22,7ZM3,9H7V21H3ZM9,8V3h6V21H13V19a1,1,0,0,0-2,0v2H9ZM21,21H17V9h4ZM13,7H11V5h2Zm0,4H11V9h2Zm0,4H11V13h2ZM4,10H6v2H4Zm0,4H6v2H4Zm0,4H6v2H4Zm16-6H18V10h2Zm0,4H18V14h2Zm0,4H18V18h2Z"></path>
    </g>
  </svg>
);
const JobCard1 = ({ allJobs, popular, viewed, viewID }: JobCardProps) => {
  const router = useRouter();
  const [currentlyOpeningID, setCurrentlyOpeningID] = useState<string | null>(
    null
  );
  const [isJobViewed, setIsJobViewed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createJobView } = trpc.createView.useMutation({
    onMutate: ({ jobID }) => {
      setCurrentlyOpeningID(jobID);
      setIsLoading(true);
    },
    onSettled: () => {
      if (currentlyOpeningID) {
        setIsLoading(true);
        const navigatePromise = new Promise<void>((resolve, reject) => {
          router.push(`/home/jobs/${currentlyOpeningID}`);
          router.refresh();
        });
        navigatePromise
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error navigating:", error);
          });
      }
    },
  });

  const handleViewJob = (jobID: string) => {
    if (isLoading) {
      return;
    } else {
      setIsJobViewed((prev) => !prev);
      createJobView({ jobID, viewed: !isJobViewed });
    }
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

  return (
    <section className="max-w-screen-lg mx-auto">
      <ul className="space-y-4 lg:space-y-6">
        {allJobs.map((item, index) => {
          const isViewed = viewed.some(
            (viewedItem) =>
              viewedItem.jobID === item.id && viewedItem.viewID === viewID
          );
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
                  <h3
                    onClick={() => handleViewJob(item.id)}
                    className={cn(
                      "text-[17px] capitalize line-clamp-1 hover:underline hover:text-[#005580] cursor-pointer sm:text-[18px] font-semibold",
                      isViewed ? "text-slate-700" : "text-slate-600"
                    )}
                  >
                    {currentlyOpeningID === item.id && isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0" />
                        {(item.job_title).toLocaleLowerCase()}
                      </span>
                    ) : (
                      <>{(item.job_title).toLocaleLowerCase()}</>
                    )}
                  </h3>
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
                      <div
                        onClick={() => handleViewJob(item.id)}
                        className="hidden w-[60px] cursor-pointer py-1 px-0.5 h-[60px] border shadow-sm border-gray-300 bg-white/70 shrink-0 rounded-sm sm:flex items-center justify-center"
                      >
                        <Image
                          src={item.companyLogo as string}
                          alt="Logo"
                          height={66}
                          width={66}
                          quality={100}
                          className="shrink-0"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleViewJob(item.id)}
                      className="hidden w-[60px] cursor-pointer py-1 px-0.5 h-[60px] border shadow-sm border-gray-300 shrink-0  bg-white rounded-sm sm:flex items-center justify-center"
                    >
                      <div className="flex items-center justify-center shrink-0 w-full h-full">
                        <div className="text-2xl sm:text-3xl font-medium text-gray-600 shrink-0">
                          {getInitials(item.company_name as string)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="w-full flex items-start flex-col leading-tight">
                    <div className="hidden sm:flex items-center w-full justify-between gap-x-4">
                      <h3
                        onClick={() => handleViewJob(item.id)}
                        className={cn(
                          "text-[17px] capitalize line-clamp-1 hover:underline hover:text-[#005580] cursor-pointer sm:text-[18px] font-semibold",
                          isViewed ? "text-slate-700" : "text-slate-600"
                        )}
                      >
                        {currentlyOpeningID === item.id && isLoading ? (
                          <span className="flex items-center">
                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 animate-spin shrink-0" />
                            {(item.job_title).toLocaleLowerCase()}
                          </span>
                        ) : (
                          <>{(item.job_title).toLocaleLowerCase()}</>
                        )}
                      </h3>
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
                <div
                  onClick={() => handleViewJob(item.id)}
                  className="sm:text-base text-sm mt-0.5 font-normal text-gray-600 cursor-pointer line-clamp-3"
                >
                  <QuillPreview htmlContent={item.job_description} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default JobCard1;
