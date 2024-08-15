import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import NoAssessments from "../../_components/assessments/NoAssessments";
import InitiatedAssessment from "../../_components/assessments/InitiatedAssessment";

interface DemoProps {
  params: {
    demoID: string;
  };
}

export async function generateStaticParams() {
  const demos = await db.employerRequestAssessment.findMany();

  const demoIDs= demos.map((demo) => demo.demoID);
  return demoIDs;
}

const Page = async ({ params }: DemoProps) => {
  const { demoID } = params;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login/enterprises?origin=manage/assessments/${demoID}`);
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect(`/home/login/enterprises?origin=manage/assessments/${demoID}`);

  const isUserRequestedDemo = await db.employerRequestAssessment.findFirst({
    where: {
      demoID,
    },
  });

  if (!isUserRequestedDemo) redirect("/manage/assessments");

  const demoExists = await db.assessmentBanner.findFirst({
    where: {
      id: isUserRequestedDemo.demoID,
    },
  });

  if (!demoExists) redirect("/manage/assessments");

  const theAssessment = await db.assessment.findMany({
    where: {
      bannerID: demoExists.id,
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {theAssessment.length === 0 ? (
        <NoAssessments />
      ) : (
        <InitiatedAssessment
          firstTest={theAssessment}
          banner={demoExists}
          initiated={isUserRequestedDemo}
        />
      )}
    </div>
  );
};

export default Page;
