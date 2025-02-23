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
  Link as Links,
  Mail,
  Share2,
} from "lucide-react";
import { Job } from "@prisma/client";
import JobsSide from "./JobsSide";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Preview } from "@/components/Preview";
import { useEffect, useState } from "react";
import RecentlyViewedLoader from "@/components/RecentlyViewedLoader";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";

const AdSenseAd = dynamic(() => import("@/components/Adsense"), { ssr: false });

interface PopularJob {
  id: string;
  job_title: string;
  company_name: string;
  companyLogo: string | null;
  createdAt: Date;
}
interface JobDetailsProps {
  job: Job;
  similarJobs: Job[];
  popularJobs: PopularJob[];
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

  const maxItems = 3;
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

  const goodRecentlyViewed: Job[] = recentlyViewedJobs
    .map((recentJob) => allJobs.find((job) => job.id === recentJob.id))
    .filter((job): job is Job => job !== undefined);

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

  const handleCopyClick = async () => {
    let currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Job link copied",
        description:
          "The job's URL link has been copied to clipboard. You may share around the job.",
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Was unable to copy the job's URL link",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="md:border-b md:border-gray-200 md:pb-3 bg-white md:shadow-md md:sticky md:px-4 md:pt-4 md:top-0 md:z-10">
          <div className="flex gap-x-4 w-full justify-between">
            <div>
              <h2
                title="Job title"
                className="text-xl font-bold tracking-tight sm:text-2xl text-gray-600"
              >
                {job.job_title}
              </h2>
              <h2 className="flex items-center text-gray-600 shrink-0 text-lg font-medium">
                <Building2 className="sm:h-5 h-4 sm:w-5 w-4 mr-1.5 shrink-0" />{" "}
                <span className="text-primary hover:underline">
                  {job.company_name}
                </span>
              </h2>
              <p className="flex items-center text-gray-600 shrink-0 text-base font-normal">
                <Briefcase className="sm:h-5 h-4 sm:w-5 w-4 mr-1.5 shrink-0" />
                {job.category}
              </p>
              <p
                suppressHydrationWarning
                className="flex items-center text-gray-600 shrink-0 text-base font-normal"
              >
                <Calendar className="sm:h-5 h-4 sm:w-5 w-4 mr-1.5 shrink-0" />
                {formatDistanceToNowStrict(job.createdAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex-shrink-0 flex justify-end">
              {job.companyLogo ? (
                <div className="relative cursor-pointer h-[80px] w-[80px] md:h-[96px] md:w-[96px] overflow-hidden rounded-sm">
                  <Image
                    src={job.companyLogo}
                    alt={job.company_name}
                    title={job.company_name}
                    quality={100}
                    style={{ objectFit: "contain" }}
                    fill
                    sizes="100%"
                    priority
                  />
                </div>
              ) : (
                <div
                  title={`${job.company_name}'s made up logo`}
                  className=" h-[80px] w-[80px] md:h-[96px] md:w-[96px] cursor-pointer py-1 px-0.5 text-gray-600 border border-gray-200  bg-gray-200 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-2xl sm:text-2xl font-semibold">
                      {getInitials(job.company_name)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mt-1.5 text-base">
            <Button
              variant="secondary"
              type="button"
              title="Save job"
              onClick={() =>
                router.push(`/home/login?origin=site/jobs/${job.id}`)
              }
              className="rounded-none border hover:text-primary hover:bg-primary/10 border-gray-200 hover:border-gray-200"
            >
              <>
                <Bookmark className="h-5 w-5 font-normal mr-1" />
                Save
              </>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/home/login?origin=site/jobs/${job.id}`)
              }
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
                  title="Onsite job application"
                  onClick={() =>
                    router.push(`/home/login?origin=site/jobs/apply/${job.id!}`)
                  }
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
                    title="Job application via email"
                    onClick={() =>
                      router.push(`/home/login?origin=site/jobs/${job.id!}`)
                    }
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
                    title="Job application via link"
                    onClick={() =>
                      router.push(`/home/login?origin=site/jobs/${job.id!}`)
                    }
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
              <h2 className="text-xl text-gray-700 font-bold flex items-center justify-between gap-x-3">
                <span>Job Overview</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={handleCopyClick}
                >
                  <Share2 className="h-4 w-4 mr-1.5 shrink-0" />
                  Share
                </Button>
              </h2>

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
                  <span
                    suppressHydrationWarning
                    className="ml-4 font-normal text-base text-gray-700"
                  >
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
              <div className="text-gray-700 w-full">
                <h3 className="text-xl font-medium text-gray-700">
                  Job Description
                </h3>

                <div className="mt-1 -mb-2 text-base w-full text-gray-700">
                  <Preview value={job.job_description as string} />
                </div>
              </div>
            )}
            {job.responsibilities && (
              <div className="mt-5">
                <h3 className="text-xl font-medium text-gray-700">
                  Job Responsibilities
                </h3>

                <div className="text-base text-gray-700">
                  <Preview value={job.responsibilities as string} />
                </div>
              </div>
            )}

            {job.requirement && (
              <div className="mt-3">
                <h3 className="text-xl font-medium text-gray-700">
                  Qualification Requirements
                </h3>
                <div className="text-base text-gray-700">
                  <Preview value={job.requirement as string} />
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
                      <li
                        className="list-disc"
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 400,
                          lineHeight: "1.35rem",
                        }}
                      >
                        {skill}
                      </li>
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
                      <li
                        className="list-disc"
                        style={{
                          fontSize: "0.88rem",
                          lineHeight: "1.35rem",
                        }}
                      >
                        {benefit}
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            )}

            {job.ownPlatformMethod === "own" && (
              <div className="mt-5 text-gray-700" id="instructionsSection">
                <h3 className="text-xl font-medium">How to apply</h3>
                <div className="mt-1 text-gray-700 text-base break-words">
                  {job.platform === "email" && (
                    <p>
                      <span className="font-medium">Email application to:</span>{" "}
                      <span className="text-blue-700 font-medium break-words">
                        {job.emailPlatform}
                      </span>
                    </p>
                  )}
                  {job.platform === "link" && (
                    <p>
                      <span className="font-medium">
                        Open the URL link to apply:
                      </span>{" "}
                      <Link
                        className="text-blue-700 font-medium text-lg"
                        title="Apply for a job"
                        target="_blank"
                        href={`https://${job.linkPlatform}`}
                      >
                        Apply Now
                      </Link>
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
                        <p className="my-3 text-sm italic">
                          <b className="text-red-700 not-italic">Note: </b>Never pay to
                          apply for a job. Report fraudulent listings using the
                          &apos;Report&apos; button above.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {job.company_description && (
              <div className="text-gray-700">
                <h3 className="text-lg font-medium text-gray-700">
                  <span>About Us</span>
                </h3>

                <div className="mt-1 -mb-2 line-clamp-4 text-base text-gray-700">
                  <Preview value={job.company_description} />
                </div>
              </div>
            )}

            <div className="mt-6 border border-gray-200 rounded-md px-3 pt-3">
              <h2 className="text-xl mb-2 text-gray-600 font-semibold">
                Similar Jobs
              </h2>

              {similarJobs.length !== 0 ? (
                <div className="mt-1">
                  <ul role="list" className="">
                    {similarJobs?.map((job, index) => (
                      <li
                        key={job.id}
                        className={`mb-4 ${
                          index !== similarJobs.length - 1
                            ? "border-b border-body-color pb-4 border-opacity-10"
                            : ""
                        }`}
                      >
                        <JobsSide
                          title={job.job_title}
                          company={job.company_name}
                          image={job.companyLogo as string}
                          slug={`/home/jobs/${job.id}`}
                          detailJobID={job.id}
                          jobID={job.id}
                          date={`${format(job.createdAt, "PPP")}`}
                        />
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

            <div className="mt-6 border border-gray-200 rounded-md px-3 pt-3">
              <h2 className="text-xl mb-2 text-gray-600 font-semibold ">
                Popular Jobs
              </h2>

              {popularJobs.length !== 0 ? (
                <div className="mt-1">
                  <ul role="list" className="">
                    {popularJobs?.map((job, index) => (
                      <li
                        key={job.id}
                        className={`mb-4 ${
                          index !== popularJobs.length - 1
                            ? "border-b border-body-color pb-4 border-opacity-10"
                            : ""
                        }`}
                      >
                        <JobsSide
                          title={job.job_title}
                          company={job.company_name}
                          image={job.companyLogo as string}
                          slug={`/home/jobs/${job.id}`}
                          detailJobID={job.id}
                          jobID={job.id}
                          date={`${format(job.createdAt, "PPP")}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="text-gray-500 italic font-normal text-base">
                  Popular jobs will appear here
                </span>
              )}
            </div>

            {viewID && (
              <div className="mt-6 border border-gray-200 rounded-md px-3 pt-3">
                <h2 className="text-xl mb-2 text-gray-600 font-semibold">
                  Recently Viewed
                </h2>

                {loading ? (
                  <span className="pb-3">
                    <RecentlyViewedLoader />
                  </span>
                ) : (
                  <>
                    {goodRecentlyViewed.length !== 0 ? (
                      <div className="mt-1">
                        <ul role="list" className="">
                          {goodRecentlyViewed?.map((job, index) => (
                            <li
                              key={job.id}
                              className={`mb-4 ${
                                index !== goodRecentlyViewed.length - 1
                                  ? "border-b border-body-color pb-4 border-opacity-10"
                                  : ""
                              }`}
                            >
                              <JobsSide
                                title={job.job_title}
                                company={job.company_name}
                                image={job.companyLogo as string}
                                slug={`/home/jobs/${job.id}`}
                                detailJobID={job.id}
                                jobID={job.id}
                                date={`${format(job.createdAt, "PPP")}`}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic font-normal text-base">
                        No recently viewed jobs
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
            <AdSenseAd />
          </div>
        </div>
      </div>
    </>
  );
}
