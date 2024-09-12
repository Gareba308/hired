"use client";

import { Job } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

const JobsSide = ({
  image,
  slug,
  title,
  job,
  company,
  jobID,
}: {
  image: string;
  slug: string;
  title: string;
  job: Job;
  company: string;
  jobID: string;
}) => {
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
    <div className="flex items-center lg:flex lg:flex-row lg:items-center">
      <div className="mr-4">
        {image ? (
          <div
            onClick={() => router.push(`/manage/jobs/${jobID}`)}
            className="relative cursor-pointer h-[56px] w-[56px] overflow-hidden rounded-sm sm:h-[60px] sm:w-[60px]"
          >
            <Image src={image} alt={title} fill sizes="100%" priority />
          </div>
        ) : (
          <div
            onClick={() => router.push(`/manage/jobs/${jobID}`)}
            className="sm:w-[60px] h-[56px] w-[56px] cursor-pointer py-1 px-0.5 sm:h-[60px] shrink-0 text-gray-600 border border-gray-200  bg-gray-100 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
          >
            <div className="flex items-center justify-center shrink-0 w-full h-full">
              <div className="text-2xl sm:text-2xl font-medium shrink-0">
                {getInitials(job.company_name as string)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <h5>
          <span
            onClick={() => router.push(`/manage/jobs/${jobID}`)}
            className="mb-[6px] block text-base cursor-pointer font-medium leading-snug text-primary hover:text-[#005580]"
          >
            <span className="line-clamp-1">{title}</span>
          </span>
        </h5>
        <p className="text-xs font-medium text-body-color line-clamp-1">
          {company}
        </p>
        <p suppressHydrationWarning className="text-xs font-normal text-body-color line-clamp-1">
          {format(job.createdAt, "PPP")}
        </p>
      </div>
    </div>
  );
};

export default JobsSide;
