"use client";

import {
  ArrowDown,
  ArrowUpRightSquare,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Edit,
  Eye,
  Flag,
  HelpCircle,
  Info,
  Link as Links,
  Mail,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Job } from "@prisma/client";
import { format, formatDistance } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import QuillPreview from "@/components/QuillPreview";
import { Preview } from "@/components/Preview";
import { useEffect, useState } from "react";
import RecentlyViewedLoader from "@/components/RecentlyViewedLoader";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";

interface JobDetailsProps {
  job: Job;
  similarJobs: Job[];
  popularJobs: Job[];
  allJobs: Job[];
  viewID: string;
}

interface StoredJob {
  id: string;
  job_title: string;
}

const STORAGE_KEY_PREFIX = "recentlyViewedJobs";
export const addToRecentlyViewed = (userId: string, job: Job): void => {
  const storageKey = `${STORAGE_KEY_PREFIX}_${userId}`;
  const storedData = localStorage.getItem(storageKey);
  let recentlyViewedJobs: StoredJob[] = storedData
    ? JSON.parse(storedData)
    : [];

  const { id, job_title } = job;

  const existingJobIndex = recentlyViewedJobs.findIndex((j) => j.id === id);
  if (existingJobIndex !== -1) {
    recentlyViewedJobs.splice(existingJobIndex, 1);
  }

  recentlyViewedJobs.unshift({
    id,
    job_title,
  });

  const maxItems = 7;
  recentlyViewedJobs = recentlyViewedJobs.slice(0, maxItems);
  localStorage.setItem(storageKey, JSON.stringify(recentlyViewedJobs));
};

export const getRecentlyViewedJobs = (userId: string): Job[] => {
  if (typeof window !== "undefined") {
    const storageKey = `${STORAGE_KEY_PREFIX}_${userId}`;
    const storedData = localStorage.getItem(storageKey);
    return storedData ? JSON.parse(storedData) : [];
  } else {
    return [];
  }
};

export default function JobDetails({
  job,
  similarJobs,
  popularJobs,
  allJobs,
  viewID,
}: JobDetailsProps) {
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = viewID;

    if (userId) {
      addToRecentlyViewed(userId, job!);

      const userRecentlyViewedJobs = getRecentlyViewedJobs(userId);
      setRecentlyViewedJobs(userRecentlyViewedJobs);
    }
  }, [job, viewID]);

  useEffect(() => {
    const fetchRecentlyViewedJobs = () => {
      try {
        const userId = viewID;
        const fetchedRecentlyViewedJobs = getRecentlyViewedJobs(userId);
        setRecentlyViewedJobs(fetchedRecentlyViewedJobs);
      } catch (error) {
        console.error("Error fetching recently viewed jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentlyViewedJobs();
  }, [viewID]);

  const filterJobs = (jobsA: Job[], jobsB: Job[]): Job[] => {
    const idsFromA = new Set(jobsA.map((jobA) => jobA.id));
    const filteredJobs = jobsB.filter((jobB) => idsFromA.has(jobB.id));

    return filteredJobs;
  };
  const goodRecentlyViewed: Job[] = filterJobs(allJobs, recentlyViewedJobs);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="md:border-b md:border-gray-200 md:pb-3 md:shadow-md md:sticky md:px-4 md:pt-4 md:top-0 md:z-10">
          <div className="flex gap-x-4 w-full justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-gray-600">
                {job.job_title}
              </h2>
              <h2
                className="flex items-center text-gray-600 shrink-0 text-lg font-medium"
              >
                <Building2 className="h-5 w-5 mr-1.5" />{" "}
                <span className="text-primary hover:underline">
                  {job.company_name}
                </span>
              </h2>
              <p className="flex items-center text-gray-600 shrink-0 text-base font-normal">
                <Briefcase className="h-5 w-5 mr-1.5" />
                {job.category}
              </p>
              <p className="flex items-center text-gray-600 shrink-0 text-base font-normal">
                <Calendar className="h-5 w-5 mr-1.5" />
                {formatDistance(
                  new Date(job.createdAt.toString() as string),
                  Date.now(),
                  {
                    addSuffix: true,
                  }
                )}
              </p>
            </div>
            <div className="flex-shrink-0 flex justify-end">
              <div className="flex-none w-16 h-16 border border-gray-200 md:hidden bg-gray-200 text-gray-700 flex items-center justify-center">
                <Image src={job.logo2!} alt="Logo" width={64} height={64} />
              </div>
              <div className="hidden flex-none w-20 h-20 border border-gray-200 bg-gray-200 text-gray-700 md:flex items-center justify-center">
                <Image src={job.logo2!} alt="Logo" width={80} height={80} />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mt-1.5 text-base">
            <Button
              variant="secondary"
              type="button"
              title="Save job"
              onClick={() => router.push(`/home/login?origin=site/jobs/${job.id}`)}
              className="rounded-none border hover:text-primary hover:bg-primary/10 border-gray-200 hover:border-gray-200"
            >
              <>
                <Bookmark className="h-5 w-5 font-normal mr-1" />
                Save
              </>
            </Button>
            <Button
              variant="outline"
              onClick={() => {}}
              className="rounded-none text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground"
            >
              <Flag className="w-4 h-4 mr-1.5" />
              Report
            </Button>
          </div>
          <div className=" pt-3">
            <>
              {job.ownPlatformMethod === "here" && (
                <button
                  type="button"
                  onClick={() => router.push(`/home/jobs/apply/${job.id!}`)}
                  className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 text-base font-normal text-white hover:opacity-90 focus:outline-none"
                >
                  <Edit className="w-4 h-4 mr-1 font-normal" />
                  Apply Now
                </button>
              )}

              {job.ownPlatformMethod === "own" &&
                job.platform === "email" &&
                job.emailPlatform && (
                  <button
                    type="button"
                    onClick={() => {
                      const emailSubject = encodeURIComponent(
                        `Application for ${job.job_title}`
                      );

                      const mailtoLink = `mailto:${job.emailPlatform}?subject=${emailSubject}`;

                      window.location.href = mailtoLink;
                    }}
                    className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 text-base font-normal text-white hover:opacity-90 focus:outline-none"
                  >
                    <Mail className="w-4 h-4 mr-1.5" />
                    Apply Via Email
                  </button>
                )}

              {job.ownPlatformMethod === "own" &&
                job.platform === "link" &&
                job.linkPlatform && (
                  <button
                    type="button"
                    onClick={() => {
                      const linkUrl = `https://${job.linkPlatform}`;
                      window.open(linkUrl, "_blank");
                    }}
                    className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 text-base font-normal text-white hover:opacity-90 focus:outline-none"
                  >
                    <ArrowUpRightSquare className="w-4 h-4 mr-1.5" />
                    Apply Via Link
                  </button>
                )}

              {job.ownPlatformMethod === "own" &&
                job.platform === "office" &&
                job.otherPlatform && (
                  <button
                    type="button"
                    onClick={() => {
                      const instructionsSection = document.getElementById(
                        "instructionsSection"
                      );

                      if (instructionsSection) {
                        const headerHeight = 70;

                        window.scrollTo({
                          top: instructionsSection.offsetTop - headerHeight,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 text-base font-normal text-primary-foreground hover:opacity-90 focus:outline-none"
                  >
                    <ArrowDown className="w-5 h-5 mr-1" />
                    Read Instructions To Apply
                  </button>
                )}
            </>
          </div>
        </div>

        {/* Options */}
        <div className="md:overflow-y-auto md:px-4">
          <div className="mt-4">
            <div className="border-slate-100">
              <h2 className="text-xl text-gray-700 font-bold">Job Overview</h2>

              {job.county && (
                <p className="flex flex-1 text-gray-700 mt-1 text-base font-medium">
                  County:{" "}
                  <span className="ml-4 font-normal text-gray-700 text-base">
                    {job.county}
                  </span>
                </p>
              )}

              {job.job_type && (
                <p className="flex flex-1 mt-1 text-gray-700 text-base font-medium">
                  Employment type:{" "}
                  <span className="ml-4 font-normal text-gray-700 text-base">
                    {job.job_type}
                  </span>
                </p>
              )}

              {job.numberOfPositions && (
                <p className="flex flex-1 mt-1 text-gray-700 text-base font-medium">
                  Vacancies:{" "}
                  <span className="ml-4 font-normal text-gray-700 text-base">
                    {job.numberOfPositions} position(s)
                  </span>
                </p>
              )}

              {job.experience && (
                <p className="flex items-center mt-1 text-gray-700 text-base font-medium">
                  Experience:{" "}
                  <span className="ml-4 font-normal text-gray-700 text-base">
                    {job.experience}
                    <>
                      {job.experienceDesired === "Required" && (
                        <span className="text-red-600 text-lg pl-0.5">*</span>
                      )}
                    </>
                  </span>
                </p>
              )}

              {job.academic && (
                <p className="flex items-center mt-1 text-gray-700 text-base font-medium">
                  Academic:{" "}
                  <span className="ml-4 font-normal text-gray-700 text-base">
                    {job.academic}
                    <>
                      {job.academicDesired === "Required" && (
                        <span className="text-red-600 text-lg pl-0.5">*</span>
                      )}
                    </>
                  </span>
                </p>
              )}

              {job.possible_pay && (
                <p className="flex flex-1 mt-1 text-gray-700 text-base font-medium">
                  Remuneration:{" "}
                  <span className="ml-4 font-normal text-base text-gray-700">
                    {job.possible_pay}
                  </span>
                </p>
              )}

              {job.deadline && (
                <p className="flex flex-1 mt-1 text-gray-700 text-base font-medium">
                  Deadline:{" "}
                  <span className="ml-4 font-normal text-base text-gray-700">
                    {format(job.deadline!, "PPP")}
                  </span>
                </p>
              )}
            </div>
            {job.academicDesired === "Required" ||
            job.experienceDesired === "Required" ? (
              <div className="-mt-1">
                <p className="text-sm">
                  <span className="text-base">Note:</span>{" "}
                  <span className="text-red-600 text-xl">*</span> means
                  it&apos;s a{" "}
                  <span className="font-bold">minimum requirement</span>!
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="py-4">
            {job.job_description && (
              <div className="text-gray-700">
                <h3 className="text-xl font-medium text-gray-700">
                  Job Description
                </h3>

                <div className="mt-1 -mb-2 text-base text-gray-700">
                  <QuillPreview htmlContent={job.job_description} />
                </div>
              </div>
            )}

            {job.responsibilities && (
              <div className="mt-5">
                <h3 className="text-xl font-medium text-gray-700">
                  Job Responsibilities
                </h3>

                <div className="text-base text-gray-700">
                  <Preview value={job.responsibilities} />
                </div>
              </div>
            )}

            {job.requirement && (
              <div className="mt-3">
                <h3 className="text-xl font-medium text-gray-700">
                  Qualification Requirements
                </h3>
                <div className="text-base text-gray-700">
                  <Preview value={job.requirement} />
                </div>
              </div>
            )}

            {job.personal_skills.length !== 0 && (
              <div className="mt-3">
                <h3 className="text-xl font-medium text-gray-700">
                  Skills Requirements
                </h3>
                <div className="text-base grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2 md:gap-x-0 md:grid-cols-1">
                  {job.personal_skills?.map((skill) => (
                    <ul key={skill} className="ml-5 text-gray-700">
                      <li className="list-disc">{skill}</li>
                    </ul>
                  ))}
                </div>
              </div>
            )}

            {job.benefits.length !== 0 && (
              <div className="mt-5 text-gray-700">
                <h3 className="text-xl font-medium">Benefits</h3>
                <div className="text-base grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2 md:gap-x-0 md:grid-cols-1">
                  {job.benefits?.map((benefit) => (
                    <ul key={benefit} className="ml-5 text-gray-700">
                      <li className="list-disc">{benefit}</li>
                    </ul>
                  ))}
                </div>
              </div>
            )}

            {job.ownPlatformMethod === "own" && (
              <div className="mt-5 text-gray-700" id="instructionsSection">
                <h3 className="text-xl font-medium">How to apply</h3>
                <div className="mt-1 text-gray-700 text-base">
                  {job.platform === "email" && (
                    <p>
                      <span className="font-medium">Email application to:</span>{" "}
                      <span className="text-primary">{job.emailPlatform}</span>
                    </p>
                  )}
                  {job.platform === "link" && (
                    <p>
                      <span className="font-medium">
                        Open the URL link to apply:
                      </span>{" "}
                      <a
                        className="text-primary"
                        target="_blank"
                        href={`https://${job.linkPlatform}`}
                      >{`https://${job.linkPlatform}`}</a>
                    </p>
                  )}
                  {job.platform === "office" && (
                    <p>
                      <span className="font-medium">To apply: </span>
                      <span className="text-gray-600 italic">
                        {job.otherPlatform}
                      </span>
                    </p>
                  )}

                  {job.instructions && (
                    <div className="mt-1.5">
                      <h3 className="text-lg font-medium">Instructions</h3>
                      <div className="text-base text-gray-700 -mt-2 -mb-2">
                        <Preview value={job.instructions} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-gray-200 pt-3">
              <h2 className="text-xl text-gray-700 font-semibold flex items-center">
                Similar Jobs
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-0.5 text-gray-500 font-normal" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-600 tracking-normal">
                      <p className="font-normal leading-tight">
                        Maximum of upto 7 jobs in similar category as{" "}
                        <span className="font-medium">{job.job_title}</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h2>

              {similarJobs.length !== 0 ? (
                <div className="mt-2">
                  <ul role="list" className="list-disc pl-4 text">
                    {similarJobs?.map((similarJob) => (
                      <li
                        key={similarJob.id}
                        className="text-gray-600 text-base hover:text-primary"
                      >
                        <Link
                          href={`/home/jobs/${similarJob.id}`}
                          className="hover:underline text-base cursor-pointer"
                        >
                          {similarJob.job_title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="text-gray-500 italic font-normal text-base">
                  No similar jobs available.
                </span>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl text-gray-700 font-semibold flex items-center">
                Popular Jobs
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-0.5 text-gray-500 font-normal" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-600 tracking-normal">
                      <p className="font-normal leading-tight">
                        Maximum of upto 7 jobs that are currently receiving high
                        number of applications.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h2>

              {popularJobs.length !== 0 ? (
                <div className="mt-2">
                  <ul role="list" className="pl-4 list-disc">
                    {popularJobs?.map((popularJob) => (
                      <li
                        key={popularJob.id}
                        className="text-gray-600 hover:text-primary"
                      >
                        <Link
                          href={`/home/jobs/${popularJob.id}`}
                          className="hover:underline text-base cursor-pointer"
                        >
                          {popularJob.job_title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="text-gray-500 italic font-normal text-base">
                  Popular jobs will appear here.
                </span>
              )}
            </div>

            {viewID && (
              <div className="mt-4">
                <h2 className="text-xl text-gray-700 font-semibold flex items-center">
                  Recently Viewed
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 ml-0.5 text-gray-500 font-normal" />
                      </TooltipTrigger>
                      <TooltipContent className="text-gray-600 tracking-normal">
                        <p className="font-normal leading-tight">
                          A maximum of upto 7 jobs that you have recently opened
                          to view details.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h2>

                {loading ? (
                  <>
                    <RecentlyViewedLoader />
                  </>
                ) : (
                  <>
                    {goodRecentlyViewed.length !== 0 ? (
                      <div className="mt-2">
                        <ul role="list" className="pl-4 list-disc">
                          {goodRecentlyViewed?.map((recentlyViewedJob) => (
                            <li
                              key={recentlyViewedJob.id}
                              className="text-gray-600 hover:text-primary"
                            >
                              <Link
                                href={`/home/jobs/${recentlyViewedJob.id}`}
                                className="hover:underline text-base cursor-pointer"
                              >
                                {recentlyViewedJob.job_title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic font-normal text-base">
                        Some of the recently viewed jobs will appear here.
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
