import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import AssessmentResults from "../../../_components/assessments/AssessmentResults";
interface ResultsProps {
  params: {
    assessmentID: string;
  };
}
const Page = async ({ params }: ResultsProps) => {
  const { assessmentID } = params;
  const assessmentBannerExists = await db.assessmentBanner.findFirst({
    where: {
      id: assessmentID,
    },
  });

  if (!assessmentBannerExists)
    redirect(
      `/control/assessments?origin=control/assessments/${assessmentID}/results`
    );
  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=control/assessments/${assessmentID}/results`);
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect(`/home/login?origin=control/assessments/${assessmentID}/results`);

  const results = await db.acceptToBeAssessed.findMany({
    where: {
      testId: assessmentBannerExists.id,
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      testCategory: true,
      completeTime: true,
      testId: true,
      testName: true,
      myAttempts: true,
      status: true,
      score: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <AssessmentResults results={results} assessmentID={assessmentID} />
    </div>
  );
};

export default Page;
