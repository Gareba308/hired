"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRightSquare,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Edit,
  Eye,
  Flag,
  HelpCircle,
  Link as Links,
  Mail,
  Share2,
} from "lucide-react";
import { Application, Company, Job } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Preview } from "@/components/Preview";
import { useEffect, useState } from "react";
import RecentlyViewedLoader from "@/components/RecentlyViewedLoader";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import JobReportModal from "./JobReportModal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import JobsSide from "./JobsSide";

interface JobDetailsProps {
  job: Job;
  companyProfile: Company | null;
  similarJobs: Job[];
  popularJobs: Job[];
  userID: string;
  allJobs: Job[];
  jobId: string;
  isSaved: boolean;
  thisApplication: Application | null;
  reportJobID: string;
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
  companyProfile,
  similarJobs,
  popularJobs,
  userID,
  allJobs,
  jobId,
  isSaved,
  thisApplication,
  reportJobID,
}: JobDetailsProps) {
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

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

  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [isAddingToSaved, setIsAddingToSaved] = useState<boolean>(
    isSaved || false
  );
  const reportOnClose = () => setReportOpen((current) => !current);
  const reportOnConfirm = () => setReportOpen((current) => !current);

  useEffect(() => {
    const userId = userID;

    if (userId) {
      addToRecentlyViewed(userId, job!);

      const userRecentlyViewedJobs = getRecentlyViewedJobs(userId);
      setRecentlyViewedJobs(userRecentlyViewedJobs);
    }
  }, [job, userID]);

  useEffect(() => {
    const fetchRecentlyViewedJobs = () => {
      try {
        const userId = userID;
        const fetchedRecentlyViewedJobs = getRecentlyViewedJobs(userId);
        setRecentlyViewedJobs(fetchedRecentlyViewedJobs);
      } catch (error) {
        console.error("Error fetching recently viewed jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentlyViewedJobs();
  }, [userID]);

  const goodRecentlyViewed: Job[] = recentlyViewedJobs
    .map((recentJob) => allJobs.find((job) => job.id === recentJob.id))
    .filter((job): job is Job => job !== undefined);

  const { mutate: saveJob } = trpc.workerSaveJob.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description:
          "There was an error making save changes on this job. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  const submitSave = () => {
    setIsAddingToSaved((prev) => !prev);
    if (!isAddingToSaved) {
      toast({
        title: "Success",
        description: "This job has been added in your saved jobs list.",
        variant: "default",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "This job has been removed from your saved jobs list",
        variant: "default",
        duration: 3000,
      });
    }
    saveJob({ jobID: jobId, saved: !isAddingToSaved });
  };

  const handleCopyClick = async () => {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace("/site", "/home");

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
      <div className="pt-4 mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6">
        <div className="lg:col-span-2 h-full lg:pr-5 pb-3">
          <div className="mb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/site/jobs">All Jobs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Job Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-x-4 w-full justify-between">
            <div>
              {thisApplication && (
                <span className="inline-flex items-center rounded-sm bg-green-50 -mt-2 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-blue-700/10">
                  APPLIED
                </span>
              )}
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-gray-600">
                {job.job_title}
              </h2>
              <Link
                href={`/site/companies/${
                  job.companyId as string
                }?origin=/site/jobs/${job.id as string}`}
                className="flex items-center text-gray-600 shrink-0 text-lg font-medium"
              >
                <Building2 className="h-5 w-5 mr-1.5" />{" "}
                <span className="text-primary hover:underline">
                  {companyProfile?.company_name}
                </span>
              </Link>
              <p className="flex items-center text-gray-600 shrink-0 text-base font-normal">
                <Briefcase className="h-5 w-5 mr-1.5" />
                {job.category}
              </p>
              <p
                suppressHydrationWarning
                className="flex items-center text-gray-600 shrink-0 text-base font-normal"
              >
                <Calendar className="h-5 w-5 mr-1.5" />
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
                    alt={job.company_name as string}
                    title={job.company_name as string}
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
            <JobReportModal
              isOpen={reportOpen}
              onClose={reportOnClose}
              onConfirm={reportOnConfirm}
              jobId={job.id}
            />
            <Button
              variant="secondary"
              type="button"
              disabled={jobId === thisApplication?.jobId}
              onClick={submitSave}
              className="border hover:text-primary hover:bg-primary/10 border-gray-200 hover:border-gray-200"
            >
              {isAddingToSaved ? (
                <>
                  <Bookmark className="h-5 w-5 fill-primary font-normal mr-1" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-5 w-5 font-normal mr-1" />
                  Save
                </>
              )}
            </Button>
            {reportJobID === job.id ? (
              <Button
                variant="outline"
                disabled
                className="text-green-800 hover:bg-destructive hover:text-destructive-foreground"
              >
                Reported
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setReportOpen(true)}
                className="text-destructive-foreground hover:bg-destructive hover:border hover:border-red-100 hover:text-destructive-foreground"
              >
                <Flag className="w-4 h-4 mr-1.5" />
                Report
              </Button>
            )}
          </div>
          <div className=" pt-3">
            {thisApplication ? (
              <button
                type="button"
                onClick={() => router.push(`/site/jobs`)}
                className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 hover:opacity-90 text-base font-normal text-white focus:outline-none"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Go Back
              </button>
            ) : (
              <>
                {job.ownPlatformMethod === "here" && (
                  <button
                    type="button"
                    onClick={() => router.push(`/site/jobs/apply/${job.id!}`)}
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
            )}
          </div>
        </div>

        {/* Options */}
        <div className="lg:row-span-3 lg:mt-0">
          <div className="lg:pb-3 lg:bg-slate-200 lg:border border-slate-200 lg:rounded-sm lg:-mx-3 lg:pt-3 lg:px-3">
            <h2 className="text-xl text-gray-700 font-bold flex items-center justify-between gap-x-4">
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
                <span className="text-red-600 text-xl">*</span> means it&apos;s
                a <span className="font-bold">minimum requirement</span>!
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="mt-6 hidden lg:-mx-3 lg:border lg:border-gray-200 lg:rounded-md px-3 lg:block pt-3">
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
                        slug={`/site/jobs/${job.id}`}
                        detailJobID={jobId}
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

          <div className="mt-6 hidden lg:-mx-3 lg:border lg:border-gray-200 lg:rounded-md px-3 lg:block pt-3">
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
                        slug={`/site/jobs/${job.id}`}
                        detailJobID={jobId}
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

          {userID && (
            <div className="mt-6 hidden lg:-mx-3 lg:border lg:border-gray-200 lg:rounded-md px-3 lg:block pt-3">
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
                              slug={`/site/jobs/${job.id}`}
                              detailJobID={jobId}
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
        </div>

        <div className="py-4 lg:col-span-2 lg:col-start-1 lg:pb-8 lg:pr-5">
          {job.job_description && (
            <div className="text-gray-700">
              <h3 className="text-xl font-medium text-gray-700 flex items-center justify-between gap-x-4">
                <span>Job Description</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex"
                  onClick={handleCopyClick}
                >
                  <Share2 className="h-4 w-4 mr-1.5 shrink-0" />
                  Share Job
                </Button>
              </h3>

              <div className="mt-1 -mb-2 text-base text-gray-700">
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
              <div className="text-base grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2 md:gap-x-0 md:grid-cols-1 lg:gap-x-2 lg:grid-cols-2">
                {job.personal_skills?.map((skill) => (
                  <ul key={skill} className="ml-5 font-normal text-gray-700">
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
              <div className="text-base grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2 md:gap-x-0 md:grid-cols-1 lg:gap-x-2 lg:grid-cols-2">
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
                    <span className="break-words font-medium text-blue-700">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 lg:hidden border border-gray-200 rounded-md px-3 pt-3">
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
                        slug={`/site/jobs/${job.id}`}
                        detailJobID={jobId}
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

          <div className="mt-6 lg:hidden border border-gray-200 rounded-md px-3 pt-3">
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
                        slug={`/site/jobs/${job.id}`}
                        detailJobID={jobId}
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

          {userID && (
            <div className="mt-6 lg:hidden border border-gray-200 rounded-md px-3 pt-3">
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
                              slug={`/site/jobs/${job.id}`}
                              detailJobID={jobId}
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
        </div>
      </div>
    </>
  );
}
