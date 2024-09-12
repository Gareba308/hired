"use client"

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { EmployerRequestAssessment, AssessmentBanner } from "@prisma/client";
import { format } from "date-fns";
import "@/lib/suppressHydration"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface InitiatedInstantProps {
  banner: AssessmentBanner;
  instantResults: EmployerRequestAssessment;
}
const InitiatedInstant = ({
  banner,
  instantResults,
}: InitiatedInstantProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteScore, isLoading } =
    trpc.employerDeleteRequestedDemoDetails.useMutation({
      onSuccess: () => {
        router.push("/manage/assessments");
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message ||
            "There was a problem undoing this scorecard. Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
      },
    });
  return (
    <>
      <section className="overflow-hidden mt-3 pb-2">
        <div className="w-full mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full lg:pr-2 xl:pr-4 lg:pb-4 rounded-md lg:w-8/12">
              <div className="w-full">
                <div className="bg-white rounded-sm shadow-sm py-6 border border-gray-200">
                  <div className="flex items-center gap-x-1.5 px-2.5 sm:px-4">
                    {instantResults.status === "PASSED" ? (
                      <div className="flex items-center justify-center w-6 h-6 bg-green-200 shadow-md rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-green-600 shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 bg-red-200 shadow-md rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-red-600 shrink-0"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </div>
                    )}
                    {instantResults.status === "PASSED" ? (
                      <div className="text-[15.6px] font-medium text-green-600">
                        Test Successful
                      </div>
                    ) : (
                      <div className="text-[15.6px] font-medium text-red-600">
                        Test Unsuccessful
                      </div>
                    )}
                  </div>
                  <div className="border-b pb-1.5">
                    <div className="text-base md:text-[15.3px] px-2.5 sm:px-4 font-medium text-gray-600 mt-2">
                      <h2>Category: {instantResults.category}</h2>
                      <h3>
                        Questions: {banner.numberQuestions} total available
                        questions
                      </h3>
                      <h2>
                        Obtained: {format(instantResults.createdAt, "PPP")},{" "}
                        {format(instantResults.createdAt, "HH:mm")}h
                      </h2>
                      <h3>My Score: {instantResults.score}%</h3>
                    </div>
                  </div>
                  <div className="pt-1.5 text-sm px-2.5 sm:px-4 leading-relaxed text-slate-600">
                    {instantResults.status === "PASSED" ? (
                      <>
                        Congratulations! You have successfully passed the skills
                        assessment. Your effort and knowledge are commendable.
                        This achievement will significantly enhance your profile
                        and open new career opportunities. Keep up the great
                        work!
                      </>
                    ) : (
                      <>
                        Unfortunately, you did not attain the minimum score this
                        time. Don&apos;t be discouraged; use this experience to
                        improve and review the material. Even without another
                        attempt, your persistence will lead to success.
                      </>
                    )}
                  </div>
                  <div className="items-center px-2.5 sm:px-4 mt-2 text-sm sm:flex">
                    <div>
                      <button
                        className="mt-2 p-2.5 flex-1 hover:bg-secondary text-primary rounded-md outline-none border ring-offset-2 ring-slate-600 focus:ring-2"
                        aria-label="Close"
                        onClick={() =>
                          deleteScore({ requestID: instantResults.id })
                        }
                      >
                        {!isLoading ? (
                          <>Close</>
                        ) : (
                          <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 animate-spin" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:pl-4 mt-8 lg:mt-0 lg:w-4/12">
              <div className=" bg-slate-200 mb-10 rounded-sm">
                <h3 className="px-4 pt-4 text-[16.6px] sm:text-[16.8px] font-semibold text-gray-600">
                  Elevate Your Career Path
                </h3>
                <div className="px-4 pb-6">
                  <div
                    className="text-base font-normal text-gray-700"
                    style={{ color: "#334155 !important" }}
                  >
                    <p>
                      Taking a skills assessment is crucial in today&apos;s job
                      market. It enhances your profile and showcases your
                      expertise to potential employers. A good score highlights
                      your proficiency and improves your chances of landing your
                      desired job.
                    </p>
                    <p className="mt-1.5">
                      If you don&apos;t achieve the minimum score, don&apos;t be
                      discouraged. Use this as a learning opportunity to
                      improve. Review the material and, if additional attempts
                      are available, try again. Persistence and continuous
                      improvement are key to success, bringing you closer to
                      showcasing your true capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InitiatedInstant;
