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

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

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

  const mySubmittedDemos = await db.submitDemo.findMany({
    where: {
      bannerID: demoID,
      userId,
    },
  });

  const submittedQuestionID = mySubmittedDemos.map((demo) => demo.questionId);

  const demoExists = await db.assessmentBanner.findFirst({
    where: {
      id: isUserRequestedDemo.demoID,
    },
  });

  if (!demoExists) redirect("/manage/assessments");

  const availableAssessments = await db.assessment.findMany({
    where: {
      bannerID: demoExists.id,
    },
  });

  let theAssessment = await db.assessment.findMany({
    where: {
      id: {
        notIn: submittedQuestionID,
      },
      bannerID: demoExists.id,
    },
  });

  theAssessment = shuffleArray(theAssessment);

  const submittedQuestionsNumber = submittedQuestionID.length;
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {availableAssessments.length === 0 ? (
        <NoAssessments />
      ) : (
        <InitiatedAssessment
          firstTest={theAssessment}
          banner={demoExists}
          initiated={isUserRequestedDemo}
          submitted={submittedQuestionsNumber}
        />
      )}
    </div>
  );
};

export default Page;
