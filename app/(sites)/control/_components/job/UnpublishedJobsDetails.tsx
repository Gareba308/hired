"use client";

import {
  Upload,
  Briefcase,
  Calendar,
  Edit,
  Loader2,
  Share2,
  Building2,
  Download,
  MailQuestion,
} from "lucide-react";
import ContactEmployerModal from "../models/job/ContactEmployerModal";
import JobsSide from "./JobsSide";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Company, Job } from "@prisma/client";
import { format } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Preview } from "@/components/Preview";
import { useEffect, useState } from "react";
import RecentlyViewedLoader from "@/components/RecentlyViewedLoader";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import dynamic from "next/dynamic";

const AdSenseAd = dynamic(() => import("@/components/Adsense"), { ssr: false });

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  jobId: z.string(),
  rankTop: z.boolean().default(false),
});

interface JobItems {
  id: string;
  job_title: string;
  personal_skills: string[];
  category: string | null;
  job_type: string | null;
  deadline: Date | null;
  county: string | null;
  possible_pay: string | null;
  academic: string | null;
  ownPlatformMethod: string | null;
  experience: string | null;
  companyLogo: string | null;
  companyId: string;
  company_name: string;
  rankTop: boolean;
  createdAt: Date;
}

interface PopularJob {
  id: string;
  job_title: string;
  company_name: string;
  companyLogo: string | null;
  createdAt: Date;
}
interface JobDetailsProps {
  job: Job;
  companyProfile: Company | null;
  similarJobs: PopularJob[];
  popularJobs: PopularJob[];
  userID: string;
  allJobs: JobItems[];
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

export default function UnpublishedJobsDetails({
  job,
  companyProfile,
  similarJobs,
  popularJobs,
  userID,
  allJobs,
}: JobDetailsProps) {
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState<boolean>(false);

  const contactOnClose = () => setContactOpen((current) => !current);
  const contactOnConfirm = () => setContactOpen((current) => !current);
  const [isPublishedJob, setIsPublishedJob] = useState<boolean>(
    job.published || false
  );

  useEffect(() => {
    const userId = userID;

    if (userId) {
      addToRecentlyViewed(userId, job!);

      const userRecentlyViewedJobs = getRecentlyViewedJobs(userId);
      setRecentlyViewedJobs(userRecentlyViewedJobs);
    }
  }, [job, userID]);

  useEffect(() => {
    const fetchRecentlyViewedJobs = async () => {
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

  const { mutate: publishJob, isLoading } = trpc.adminPublishJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Publication details of this job has been updated.",
        variant: "default",
        duration: 3000,
      });
      router.refresh();
    },
    onError: (err) => {
      if (err.message) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Something went wrong",
          description:
            "There was a problem updating publication details of this job",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const handlePublishJob = async () => {
    setIsPublishedJob((prevState) => !prevState);
    publishJob({
      published: !isPublishedJob,
      jobID: job.id,
    });
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

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobId: job.id ?? "",
      rankTop: job.rankTop ?? false,
    },
  });

  const { mutate: rankTop, isLoading: rankLoading } =
    trpc.adminRankTopJob.useMutation({
      onSuccess: (message) => {
        toast({
          title: "Success",
          description:
            message.rankTop === true
              ? "This job will be made to rank at the top of your listing"
              : "This job will rank normal as others",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message || "There was a problem updating the job's rank",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  return (
    <>
      <div className="pt-4 mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6">
        <div className="lg:col-span-2 h-full lg:pr-5 pb-3">
          <div className="mb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/control/jobs">All Jobs</BreadcrumbLink>
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
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-gray-600">
                {job.job_title}
              </h2>
              <p className="flex items-center text-gray-600 shrink-0 text-lg font-medium">
                <Building2 className="sm:h-5 h-4 sm:w-5 w-4 mr-1.5 shrink-0" />{" "}
                <span className="text-primary hover:underline">
                  {job.company_name}
                </span>
              </p>
              {job.category && (
                <p className="flex items-center text-gray-600 shrink-0 text-base font-normal">
                  <Briefcase className="sm:h-5 h-4 sm:w-5 w-4 mr-1.5 shrink-0" />
                  {job.category}
                </p>
              )}
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

          <div className="flex flex-row items-center justify-between mt-3">
            <ContactEmployerModal
              isOpen={contactOpen}
              onClose={contactOnClose}
              onConfirm={contactOnConfirm}
              companyId={job.companyId}
            />
            <Button
              variant="secondary"
              type="button"
              onClick={handlePublishJob}
              size="sm"
              className="border-slate-200 bg-slate-200 border rounded-none text-[#005580] hover:bg-white hover:text-gray-700 hover:opacity-90"
            >
              {job.published === false ? (
                <>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500 mr-1.5 shrink-0" />{" "}
                      Wait...
                    </>
                  ) : (
                    <span className="flex items-center text-base">
                      <Upload className="w-4 h-4 mr-1.5 shrink-0" />
                      Publish
                    </span>
                  )}
                </>
              ) : (
                <>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500 mr-1.5 shrink-0" />
                      Wait...
                    </>
                  ) : (
                    <span className="flex items-center text-base">
                      <Download className="w-4 h-4 mr-1.5 shrink-0" />
                      Withhold
                    </span>
                  )}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setContactOpen(true)}
              className="rounded-none text-base"
            >
              <MailQuestion className="w-4 h-4 mr-1.5 text-gray-600" />
              Contact
            </Button>
          </div>

          <div className=" pt-3">
            <button
              type="button"
              onClick={() => router.push(`/control/jobs/set/${job?.id!}`)}
              className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 text-base font-normal text-white hover:opacity-90 focus:outline-none"
            >
              <Edit className="w-4 h-4 mr-2" />
              Job Settings
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="lg:row-span-3 lg:mt-0">
          <div className="lg:pb-3 lg:bg-slate-200 lg:border border-slate-200 lg:rounded-sm lg:-mx-3 lg:pt-3 lg:px-3">
            <div className="flex items-center justify-between gap-x-4">
              <span className="text-xl text-gray-700 font-bold">
                Job Overview
              </span>
              <div className="lg:hidden">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="rankTop"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center gap-x-1.5">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              disabled={rankLoading}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                rankTop({ jobId: job.id, rankTop: checked });
                              }}
                            />
                          </FormControl>
                          <div>
                            <FormLabel className="text-lg">Rank?</FormLabel>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </Form>
              </div>
            </div>

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
                        slug={`/control/jobs/${job.id}`}
                        jobID={job.id}
                        job={job}
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
                        slug={`/control/jobs/${job.id}`}
                        jobID={job.id}
                        job={job}
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
                              slug={`/control/jobs/${job.id}`}
                              jobID={job.id}
                              job={job}
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
              <div className=" flex items-center justify-between gap-x-4">
                <h3 className="text-xl font-medium text-gray-700">
                  Job Description
                </h3>
                <div className="hidden lg:flex">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="rankTop"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-row items-center gap-x-1.5">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                disabled={rankLoading}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  rankTop({ jobId: job.id, rankTop: checked });
                                }}
                              />
                            </FormControl>
                            <div>
                              <FormLabel className="text-lg">
                                Rank Top?
                              </FormLabel>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>
              </div>

              <div className="mt-1 -mb-2 text-base text-gray-700">
                <Preview value={job.job_description as string} />
              </div>
            </div>
          )}

          <AdSenseAd />

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
          <AdSenseAd />
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

          <AdSenseAd />

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
                        <b className="text-red-700 not-italic">Note: </b>Never
                        pay to apply for a job. Report fraudulent listings using
                        the &apos;Report&apos; button above.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {job.company_description && (
            <div className="text-gray-700 mt-2">
              <h3 className="text-xl font-medium text-gray-700">
                <span>About Us</span>
              </h3>

              <div className="mt-1 -mb-2 line-clamp-4 text-base text-gray-700">
                <Preview value={job.company_description} />
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
                        slug={`/control/jobs/${job.id}`}
                        jobID={job.id}
                        job={job}
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
                        slug={`/control/jobs/${job.id}`}
                        jobID={job.id}
                        job={job}
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
                              slug={`/control/jobs/${job.id}`}
                              jobID={job.id}
                              job={job}
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
