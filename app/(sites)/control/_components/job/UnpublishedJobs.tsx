"use client";

import { Job } from "@prisma/client";
import UnpublishedJobCard from "./UnpublishedJobCard";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Briefcase,
  MessageSquare,
  Rocket,
  ShieldQuestion,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import Link from "next/link";

const pageSize = 20;
interface AllMyJobsProps {
  myJobs: Job[];
}

export default function UnpublishedJobs({ myJobs }: AllMyJobsProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const jobsForCurrentPage = myJobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(myJobs.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };
  return (
    <main className="mx-auto lg:-mt-2 max-w-7xl">
      <section>
        <div className="flex flex-wrap">
          <div className="w-full min-h-[calc(100vh-100px)] lg:mt-2 px-4 pt-2 pb-4 mx-auto bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
            <h2 className="font-bold text-center sm:text-start text-gray-600 tracking-tight text-2xl sm:text-3xl">
              Unpublished Postings
            </h2>
            <div className="lg:col-span-3 mt-2 pb-2">
              <UnpublishedJobCard allJobs={jobsForCurrentPage} />
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
                      <Briefcase className="h-10 w-10" />
                    </h2>

                    <p className="flex items-start gap-2 text-gray-600">
                      <span className="text-base">
                        A job will only be visible here as long as it
                        hasn&apos;t reached the application deadline.
                      </span>
                    </p>

                    <p className="flex items-start mt-3 gap-2 text-gray-600">
                      <span className="text-base">
                        Submitting application or manually undoing the save will
                        remove this job from this section.
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col h-full justify-center">
                    <div className="hidden lg:block rounded-sm lg:pb-4 lg:space-y-2 lg:bg-slate-200 lg:border px-4 border-slate-200 lg:shadow-sm lg:pt-2.5">
                      <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                        <Rocket className="h-10 w-10" />
                      </h2>

                      <p className="flex items-start gap-2 text-gray-600">
                        <span className="text-base">
                          A job will only be visible here as long as it
                          hasn&apos;t reached the application deadline.
                        </span>
                      </p>

                      <p className="flex items-start mt-3 gap-2 text-gray-600">
                        <span className="text-base">
                          Submitting application or manually undoing the save
                          will remove this job from this section.
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
