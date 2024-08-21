import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
import AllAssessmentsInBanner from "../../_components/assessments/AllAssessmentsInBanner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
interface AssessmentParamsProps {
  params: {
    assessmentID: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const assessments = await db.assessmentBanner.findMany();

  return assessments.map((assess) => ({
    assessmentID: assess.id,
  }));
}

const Page = async ({ params }: AssessmentParamsProps) => {
  const { assessmentID } = params;
  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=control/assessments/${assessmentID}`);
  const userId = session?.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect(`/home/login?origin=control/assessments/${assessmentID}`);

  const bannerExists = await db.assessmentBanner.findFirst({
    where: {
      id: assessmentID,
    },
  });

  if (!bannerExists)
    redirect(`/control/assessments?origin=control/assessments/${assessmentID}`);

  const assessmentsFromThisBanner = await db.assessment.findMany({
    where: {
      bannerID: assessmentID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <AllAssessmentsInBanner
        assessments={assessmentsFromThisBanner}
        userId={dbUser.id}
        assessmentID={assessmentID}
      />
    </div>
  );
};

export default Page;
