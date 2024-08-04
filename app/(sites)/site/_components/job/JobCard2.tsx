"use client";
import { Job } from "@prisma/client";
import { formatDistance } from "date-fns";
import { Building2, CircleDollarSign, Clock, MapPinIcon } from "lucide-react";
import Link from "next/link";
import QuillPreview from "@/components/QuillPreview";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

interface JobCardProps {
  allJobs: Job[];
}
const JobCard2 = ({ allJobs }: JobCardProps) => {
  const router = useRouter();
  const { mutate: createJobView } = trpc.createView.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      router.refresh();
    },
  });
  return (
    <section className="max-w-screen-lg mx-auto">
      <ul className="space-y-4 lg:space-y-6">
        {allJobs.map((item) => (
          <li
            key={item.id}
            className="px-3 pb-3 pt-1.5 bg-white rounded-lg border border-gray-200"
          >
            <Link
              href={`/site/jobs/${item.id}`}
              onClick={() => createJobView({ jobID: item.id })}
            >
              <div>
                <div className="w-full mb-2">
                  <div className="flex-1 w-full">
                    {item.job_title && (
                      <>
                        <h3 className="text-lg font-medium leading-tight sm:text-xl text-primary hover:underline">
                          {item.job_title}
                        </h3>
                      </>
                    )}
                    {item.company_name && (
                      <h3 className="text-gray-700 text-base font-medium flex items-center gap-1 line-clamp-1 shrink-0">
                        <Building2 className="h-4 w-4 mr-0.5" />
                        {item.company_name}
                      </h3>
                    )}
                    <>
                      <div className="text-gray-600 text-base font-normal mt-1 line-clamp-3 sm:line-clamp-2">
                        <QuillPreview htmlContent={item.job_description} />
                      </div>
                    </>
                  </div>
                </div>

                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-4 border-t border-gray-100 pt-1">
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Clock
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {formatDistance(new Date(item.createdAt), Date.now(), {
                      addSuffix: true,
                    })}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPinIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {item.county}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    {item.job_type}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <CircleDollarSign
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {item.possible_pay}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default JobCard2;
