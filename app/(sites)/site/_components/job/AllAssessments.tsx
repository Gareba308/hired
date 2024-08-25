"use client";

import QuillPreview from "@/components/QuillPreview";
import { Button } from "@/components/ui/button";
import { AcceptToBeAssessed, AssessmentBanner } from "@prisma/client";
import { ArrowRight, Award } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AcceptAssessmentAlertModal } from "../models/apply/AcceptAssessment";

interface AllAssessmentsProps {
  banners: AssessmentBanner[];
  acceptedAssessments: AcceptToBeAssessed[];
  jobId: string;
}

const AllAssessments = ({
  banners,
  acceptedAssessments,
  jobId,
}: AllAssessmentsProps) => {
  const [currentlyOpeningID, setCurrentlyOpeningID] = useState<string | null>(
    null
  );
  const [assessOpen, setAssessOpen] = useState<boolean>(false);
  const assessClose = () => {
    setAssessOpen((prev) => !prev);
    setCurrentlyOpeningID(null);
  };

  const toggleAssess = (bannerID: string) => {
    setAssessOpen(true);
    setCurrentlyOpeningID(bannerID);
  };

  const assessConfirm = () => {
    setAssessOpen((prev) => !prev);
    setCurrentlyOpeningID(null);
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl relative">
        <div className="mx-auto grid grid-cols-1 gap-x-3 lg:gap-x-4 gap-y-4 pt-1 lg:mx-0 lg:max-w-none">
          {banners.flatMap((banner) => {
            const acceptedAssessment = acceptedAssessments.find(
              (assessment) => assessment.testId === banner.id
            );

            const validAttempts = Number(banner.attemptNumbers);
            const userAttempts = acceptedAssessment
              ? acceptedAssessment.myAttempts
              : 0;

            return (
              <div
                key={banner.id}
                className="flex flex-col border-2 border-gray-300 text-gray-700 rounded-lg w-full items-start"
              >
                <div className="flex items-center justify-between gap-x-4 px-2 py-2 rounded-t-lg bg-primary w-full text-primary-foreground text-lg">
                  <div className="text-lg line-clamp-1 capitalize font-semibold">
                    {banner.category}
                  </div>
                  <div>
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between h-full">
                  <div>
                    <div className="px-2 mt-2">
                      <h2 className="flex-wrap text-sm font-semibold">
                        {banner.name}
                      </h2>
                    </div>

                    <div className="px-2 w-full">
                      <div className="text-base text-gray-700 font-normal w-full">
                        <QuillPreview htmlContent={banner.briefSummary} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center w-full justify-between">
                    <div>
                      <div className="flex flex-col items-center w-full">
                        <div className="px-2 mt-2">
                          {currentlyOpeningID === banner.id && (
                            <AcceptAssessmentAlertModal
                              isOpen={assessOpen}
                              onClose={assessClose}
                              onConfirm={assessConfirm}
                              banner={banner}
                              jobId={jobId}
                            />
                          )}
                          <Button
                            variant="default"
                            size="default"
                            onClick={() => toggleAssess(banner.id)}
                            type="button"
                            className="bg-primary text-normal text-sm text-primary-foreground hover:bg-primary hover:opacity-95"
                          >
                            Start Test <ArrowRight className="h-4 w-4 ml-1.5" />
                          </Button>
                        </div>

                        <div className="px-2 mt-2 mb-2 text-sm font-medium">
                          <h3>Attempts: {validAttempts - userAttempts}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 flex flex-col gap-y-2 items-center">
                      {userAttempts > 0 ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-none px-2 py-1 text-xs font-medium",
                            acceptedAssessment?.status === "PASSED"
                              ? "bg-green-200 text-green-600"
                              : acceptedAssessment?.status === "FAILED"
                              ? "bg-red-200 text-red-600"
                              : "bg-indigo-200 text-indigo-700"
                          )}
                        >
                          Score:{acceptedAssessment?.score}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-none bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                          Available
                        </span>
                      )}
                      <span className="text-sm font-medium">
                        {banner.numberQuestions} Quiz
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllAssessments;
