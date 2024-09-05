"use client";

import { Button } from "@/components/ui/button";
import { Job, Company } from "@prisma/client";
import {
  Briefcase,
  Calendar,
  CheckSquare,
  Edit,
  Flag,
  Heart,
  Rocket,
  Settings,
} from "lucide-react";
import { format, formatDistance } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuillPreview from "@/components/QuillPreview";
import { Preview } from "@/components/Preview";
import Link from "next/link";

interface MyJobsDetailsProps {
  job: Job;
  companyProfile: Company | null;
}

const MyJobsDetails = ({ job, companyProfile }: MyJobsDetailsProps) => {
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
    <>
      <div className="pt-4 mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6">
        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-6 border-b border-zinc-200 pb-3">
          <div className="flex gap-x-4 w-full justify-between">
            <div className="">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-gray-600">
                {job?.job_title}
              </h2>
              <p className="text-lg font-semibold">By: {job.company_name}</p>
              <p className="flex items-center text-base font-normal">
                <Briefcase className="h-5 w-5 mr-1.5" />
                {job?.category}
              </p>
              <p className="flex items-center text-base font-normal">
                <Calendar className="h-5 w-5 mr-1.5" />
                {formatDistance(
                  new Date(job?.createdAt.toString() as string),
                  Date.now(),
                  {
                    addSuffix: true,
                  }
                )}
              </p>
            </div>
            <div className="flex-shrink-0 flex justify-end">
              {job.companyLogo ? (
                <div className="relative cursor-pointer border border-gray-200 bg-gray-200 h-[80px] w-[80px] md:h-[96px] md:w-[96px] overflow-hidden rounded-sm">
                  <Image
                    src={job.companyLogo}
                    alt={job.company_name}
                    title={job.company_name}
                    quality={100}
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

          <div className="flex flex-row items-center justify-between mt-4 text-base">
            <Button
              variant="secondary"
              className="rounded-none border hover:text-primary hover:bg-primary/10 border-gray-200 hover:border-gray-200"
            >
              <Heart className="w-4 h-4 mr-1.5" />
              Save
            </Button>

            <Button
              variant="outline"
              className="rounded-none text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground"
            >
              <Flag className="w-4 h-4 mr-1.5" />
              Report
            </Button>
          </div>

          <div className=" pt-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/manage/jobs/set/${job?.id!}?origin=manage/my-jobs/${job.id}`
                )
              }
              className="flex w-full items-center rounded-sm justify-center border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:opacity-90 focus:outline-none"
            >
              <Edit className="w-4 h-4 mr-1.5" />
              Job Settings
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <div className="lg:pb-3 lg:bg-sky-100 lg:border border-sky-100 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-3 lg:px-3">
            <h2 className="text-xl text-gray-800 font-bold">Job Overview</h2>

            {job?.county && (
              <p className="flex flex-1 text-gray-800 mt-1 text-base font-medium">
                County:{" "}
                <span className="ml-4 font-normal text-gray-800 text-base">
                  {job?.county}
                </span>
              </p>
            )}

            {job?.job_type && (
              <p className="flex flex-1 mt-1 text-gray-800 text-base font-medium">
                Employment type:{" "}
                <span className="ml-4 font-normal text-gray-800 text-base">
                  {job?.job_type}
                </span>
              </p>
            )}

            {job?.numberOfPositions && (
              <p className="flex flex-1 mt-1 text-gray-800 text-base font-medium">
                Vacancies:{" "}
                <span className="ml-4 font-normal text-gray-800 text-base">
                  {job?.numberOfPositions} position(s)
                </span>
              </p>
            )}

            {job?.experience && (
              <p className="flex items-center mt-1 text-gray-800 text-base font-medium">
                Experience:{" "}
                <span className="ml-4 font-normal text-gray-800 text-base">
                  {job?.experience}
                  <>
                    {job?.experienceDesired === "Required" && (
                      <span className="text-red-600 text-lg pl-0.5">*</span>
                    )}
                  </>
                </span>
              </p>
            )}

            {job?.academic && (
              <p className="flex items-center mt-1 text-gray-800 text-base font-medium">
                Academic:{" "}
                <span className="ml-4 font-normal text-gray-800 text-base">
                  {job?.academic}
                  <>
                    {job?.academicDesired === "Required" && (
                      <span className="text-red-600 text-lg pl-0.5">*</span>
                    )}
                  </>
                </span>
              </p>
            )}

            {job?.possible_pay && (
              <p className="flex flex-1 mt-1 text-gray-800 text-base font-medium">
                Remuneration:{" "}
                <span className="ml-4 font-normal text-base text-gray-800">
                  {job?.possible_pay}
                </span>
              </p>
            )}

            {job?.deadline && (
              <p className="flex flex-1 mt-1 text-gray-800 text-base font-medium">
                Deadline:{" "}
                <span className="ml-4 font-normal text-base text-gray-800">
                  {format(job?.deadline!, "PPP")}
                </span>
              </p>
            )}
          </div>
          {job?.academicDesired === "Required" ||
          job?.experienceDesired === "Required" ? (
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

          <div className="mt-12 hidden lg:block pt-4 lg:pb-5 lg:space-y-3 lg:bg-sky-100 lg:border border-sky-100 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-5 lg:px-3">
            <h2 className="text-xl text-gray-800 font-semibold flex justify-center">
              <Settings className="h-10 w-10" />
            </h2>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Job settings provides you opportunity to make changes to a job,
                add more filter details so as to get quality candidates.
              </span>
            </p>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Deleting a job, will see you lose other details related to the
                job, such as application.
              </span>
            </p>
          </div>

          <div className="mt-12 hidden lg:block pt-4 lg:pb-5 lg:space-y-3 lg:bg-sky-100 lg:border border-sky-100 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-5 lg:px-3">
            <h2 className="text-xl text-gray-800 font-semibold flex justify-center">
              <Rocket className="h-10 w-10" />
            </h2>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Providing enough details on the skills is 3 times more likely to
                help you land competent candidates.
              </span>
            </p>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Candidates get referred to a job matching their qualifications
                and skills
              </span>
            </p>
          </div>
        </div>

        <div className="py-4 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-8 lg:pr-3">
          {job?.job_description && (
            <div className="text-gray-800">
              <h3 className="text-xl font-medium text-gray-800">
                Job Description
              </h3>

              <div className="mt-1 -mb-2 text-base text-gray-800">
                <QuillPreview htmlContent={job?.job_description} />
              </div>
            </div>
          )}

          {job?.responsibilities && (
            <div className="mt-5">
              <h3 className="text-xl font-medium text-gray-800">
                Job Responsibilities
              </h3>

              <div className="text-base">
                <Preview value={job?.responsibilities} />
              </div>
            </div>
          )}

          {job?.requirement && (
            <div className="mt-3">
              <h3 className="text-xl font-medium text-gray-800">
                Qualification Requirements
              </h3>
              <div className="text-base">
                <Preview value={job?.requirement} />
              </div>
            </div>
          )}

          {job?.personal_skills.length !== 0 && (
            <div className="mt-3">
              <h3 className="text-xl font-medium text-gray-800">
                Skills Requirements
              </h3>
              <div className="text-base grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2 md:gap-x-0 md:grid-cols-1 lg:gap-x-2 lg:grid-cols-2">
                {job?.personal_skills?.map((skill) => (
                  <ul key={skill} className="ml-5">
                    <li className="list-disc">{skill}</li>
                  </ul>
                ))}
              </div>
            </div>
          )}

          {job?.benefits.length !== 0 && (
            <div className="mt-5 text-gray-800">
              <h3 className="text-xl font-medium">Benefits</h3>
              <div className="text-base grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2 md:gap-x-0 md:grid-cols-1 lg:gap-x-2 lg:grid-cols-2">
                {job?.benefits?.map((benefit) => (
                  <ul key={benefit} className="ml-5 text-gray-800">
                    <li className="list-disc">{benefit}</li>
                  </ul>
                ))}
              </div>
            </div>
          )}

          {job?.ownPlatformMethod === "own" && (
            <div className="mt-5 text-gray-800">
              <h3 className="text-xl font-medium">How to apply</h3>
              <div className="mt-1 text-gray-800 text-base break-words">
                {job.platform === "email" && (
                  <p>
                    Email application to:{" "}
                    <span className="text-blue-700 font-medium break-words">
                      {job.emailPlatform}
                    </span>
                  </p>
                )}
                {job.platform === "link" && (
                  <p>
                    Open the URL link to apply:{" "}
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
                  <p>To apply: {job.otherPlatform}</p>
                )}

                {job.instructions && (
                  <div className="mt-1.5">
                    <h3 className="text-lg font-medium">Instructions</h3>
                    <div className="text-base text-gray-700 -mt-2 -mb-2">
                      <Preview value={job?.instructions} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 border-t border-gray-200 pt-3 lg:hidden">
            <h2 className="text-xl text-gray-800 font-semibold">
              Similar Jobs
            </h2>

            <p>Write something meaningful here</p>
          </div>

          <div className="mt-4 lg:hidden">
            <h2 className="text-xl text-gray-800 font-semibold">
              Popular Jobs
            </h2>

            <p>Write meaningful thing here</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyJobsDetails;
