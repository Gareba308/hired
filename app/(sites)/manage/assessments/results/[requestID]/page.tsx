import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
import InitiatedInstant from "../../../_components/assessments/InitiatedInstant";

interface RequestAssessmentProps {
  params: {
    requestID: string;
  };
}
export const dynamicParams = true;
export const revalidate = 60;
export async function generateStaticParams() {
  const instantAssess = await db.employerRequestAssessment.findMany();

  return instantAssess.map((assess) => ({ requestID: assess.id }));
}
const Page = async ({ params }: RequestAssessmentProps) => {
  const { requestID } = params;

  const requestExists = await db.employerRequestAssessment.findFirst({
    where: {
      id: requestID,
    },
  });

  if (!requestExists)
    redirect(
      `/manage/assessments?origin=manage/assessments/results/${requestID}`
    );

  const banner = await db.assessmentBanner.findFirst({
    where: {
      id: requestExists.demoID,
    },
  });
  if (!banner)
    redirect(
      `/manage/assessments?origin=manage/assessments/results/${requestID}`
    );

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <InitiatedInstant banner={banner} instantResults={requestExists} />
    </div>
  );
};

export default Page;
