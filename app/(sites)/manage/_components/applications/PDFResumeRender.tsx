"use client";

import React from "react";
import { Application, AssessmentStatus } from "@prisma/client";
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
  function getFirstName(fullName: string): string {
    return fullName.split(" ")[0];
  }
  return (
    <main>
      <section aria-labelledby="products-heading" className="pb-4">
        <h2 className="font-bold text-gray-600 tracking-tight text-2xl md:text-[26px]">
          {(application.applicantName as string) && (
            <span className="mr-1.5">
              {getFirstName(application.applicantName as string)}&apos;s
            </span>
          )}
          Test Results
        </h2>
        {applicantAssessmentResults.length !== 0 ? (
          <div>
            <div>
              <TestResults combinedData={applicantAssessmentResults} />
            </div>
          </div>
        ) : (
          <div>This job did not have a mandatory assessment</div>
        )}
      </section>
    </main>
  );
};

export default PDFResumeRender;
