"use client";

import React from "react";
import { Application, AssessmentStatus } from "@prisma/client";
import UploadedResume from "./UploadedResume";
import { TestResults } from "./TestResults";

interface BetterUploadItems {
  id: string;
  userId: string;
  fullName: string;
  testName: string;
  testCategory: string;
  myAttempts: number;
  completeTime: Date;
  status: AssessmentStatus;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
interface ResumeRenderProps {
  application: Application;
  applicantAssessmentResults: BetterUploadItems[];
}

const PDFResumeRender = ({
  application,
  applicantAssessmentResults,
}: ResumeRenderProps) => {
  return (
    <main>
      <section aria-labelledby="products-heading" className="pb-4">
        <div className="flex flex-col">
          <div className="lg:col-span-3 w-full mx-auto h-full">
            <h3 className="font-bold text-gray-600 tracking-tight text-xl mt-2 sm:text-2xl lg:text-3xl">
              Uploaded Resume
            </h3>
            <div className="pb-3">
              <UploadedResume application={application} />
            </div>
            <div>
              <h3 className="font-bold text-gray-600 tracking-tight text-xl mt-2 sm:text-2xl lg:text-3xl">
                Skill Tests
              </h3>
              {applicantAssessmentResults.length !== 0 ? (
                <div>
                  <div>
                    <TestResults combinedData={applicantAssessmentResults} />
                  </div>
                </div>
              ) : (
                <div>This job did not have a mandatory assessment</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PDFResumeRender;
