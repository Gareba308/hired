"use client";

import { useState } from "react";
import { Company, Job, SavedJobs } from "@prisma/client";
import { Pin, Import } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import JobCard2 from "./JobCard2";

interface TopEmployer {
  companyDetails: Company;
  vacanciesCount: number;
}

interface AllJobsProps {
  jobs: Job[];
  topEmployer: TopEmployer[];
  mySavedJobs: SavedJobs[];
  allPopular: Job[];
}
const pageSize = 10;
export default function AllSavedJobs({
  jobs,
  topEmployer,
  mySavedJobs,
  allPopular,
}: AllJobsProps) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const jobsForCurrentPage = jobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(jobs.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  return (
    <main className="mx-auto lg:-mt-2 max-w-7xl">
      <section>
        <div className="flex flex-wrap">
          <div className="w-full min-h-[calc(100vh-80px)] lg:mt-2 px-4 pt-2 pb-4 mx-auto bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
            <div className="text-2xl w-full sm:text-3xl font-bold tracking-tight text-gray-600">
              <div className="flex items-center gap-x-1.5 sm:gap-x-2">
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-600 text-center sm:text-start tracking-tight text-2xl sm:text-3xl">
                    My Saved Jobs
                  </h3>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 lg:mt-3 lg:pb-2">
              <JobCard2
                allJobs={jobsForCurrentPage}
                mySavedJobs={mySavedJobs}
                popular={allPopular}
              />
              <div className="mt-6 pb-4">
                {totalPages > 1 && (
                  <ReactPaginate
                    pageCount={totalPages}
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
                    containerClassName={"pagination flex"}
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    activeClassName={"active"}
                    pageClassName={"mx-0.5 sm:mx-1  cursor-pointer"}
                    breakClassName={"mx-0.5 sm:mx-1"}
                    previousClassName={"mx-0.5 sm:mx-1"}
                    nextClassName={"mx-0.5 sm:mx-1"}
                    pageLinkClassName={
                      "py-1.5 px-2.5 rounded-sm border border-gray-200 hover:bg-secondary text-gray-600"
                    }
                    activeLinkClassName={
                      "bg-primary text-white border-transparent hover:text-gray-600 hover:border hover:border-gray-200"
                    }
                    previousLinkClassName={
                      "py-1.5 px-2.5 rounded-sm border border-gray-300 hover:bg-secondary"
                    }
                    nextLinkClassName={
                      "py-1.5 px-2.5 rounded-sm border border-gray-300 hover:bg-secondary"
                    }
                    disabledClassName={"text-gray-400 cursor-not-allowed"}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    breakLabel={"..."}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
            <div className="flex flex-col w-full h-full">
              <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                <div className="flex justify-between gap-y-6 flex-col">
                  <div className="hidden rounded-sm lg:block lg:pb-4 lg:space-y-2 lg:bg-slate-200 lg:border px-4 border-slate-200 lg:shadow-sm lg:pt-2.5">
                    <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                      <Pin className="h-10 w-10" />
                    </h2>

                    <p className="flex items-start gap-2 text-gray-700">
                      <span className="text-base">
                        A job listing will remain visible until either the
                        application deadline is reached or for a maximum of 30
                        days.
                      </span>
                    </p>

                    <p className="flex items-start mt-3 gap-2 text-gray-700">
                      <span className="text-base">
                        Removing a job from your saved list can be done by
                        either submitting an application or by unsaving it from
                        this section.
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col h-full justify-center">
                    <div className="hidden lg:block rounded-sm lg:pb-4 lg:space-y-2 lg:bg-slate-200 lg:border px-4 border-slate-200 lg:shadow-sm lg:pt-2.5">
                      <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                        <Import className="h-10 w-10" />
                      </h2>

                      <p className="flex items-start gap-2 text-gray-700">
                        <span className="text-base">
                          We recommend using the save feature thoughtfully,
                          rather than saving multiple jobs at once.
                        </span>
                      </p>

                      <p className="flex items-start mt-3 gap-2 text-gray-700">
                        <span className="text-base">
                          After submitting an application for a job, it will
                          automatically be removed from your saved list.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
