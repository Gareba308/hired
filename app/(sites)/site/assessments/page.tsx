import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import AssessmentBanners from "../_components/assessments/AssessmentBanners";


const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};
const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/assessments");
  const userId = session.id;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/assessments");

  const banners = await db.assessmentBanner.findMany({
    where: {
      forDemo: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const initiatedAssessment = await db.acceptToBeAssessed.findFirst({
    where: {
      userId,
      status: "INITIATED",
    },
  });

  const myAcceptedAssessments = await db.acceptToBeAssessed.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  const submittedAnswers = await db.submitTest.findMany({
    where: {
      userId,
    },
  });

  const expiredAcceptAssessment = await db.acceptToBeAssessed.findMany({
    where: {
      userId,
      completeTime: {
        lte: new Date(),
      },
    },
  });

  const expiredAcceptsIDS = expiredAcceptAssessment.map(
    (accept) => accept.testId
  );

  const submittedQuestionIDS = submittedAnswers.map(
    (submitted) => submitted.questionId
  );

  const firstAttemptInitiatedAssessments = await db.assessment.findMany({
    where: {
      id: {
        notIn: submittedQuestionIDS,
      },
      bannerID: {
        notIn: expiredAcceptsIDS,
        equals: initiatedAssessment?.testId as string,
      },
      attemptType: "firstAttempt",
    },
  });

  const secondAttemptInitiatedAssessments = await db.assessment.findMany({
    where: {
      id: {
        notIn: submittedQuestionIDS,
      },
      bannerID: {
        notIn: expiredAcceptsIDS,
        equals: initiatedAssessment?.testId as string,
      },
      attemptType: "secondAttempt",
    },
  });

  const thirdAttemptInitiatedAssessments = await db.assessment.findMany({
    where: {
      id: {
        notIn: submittedQuestionIDS,
      },
      bannerID: {
        notIn: expiredAcceptsIDS,
        equals: initiatedAssessment?.testId as string,
      },
      attemptType: "thirdAttempt",
    },
  });

  const initiatedAssessmentAttemptNumber = initiatedAssessment?.myAttempts ?? 0;

  let selectedAssessment = firstAttemptInitiatedAssessments;

  if (initiatedAssessmentAttemptNumber === 1) {
    selectedAssessment = secondAttemptInitiatedAssessments;
  } else if (initiatedAssessmentAttemptNumber === 2) {
    selectedAssessment = thirdAttemptInitiatedAssessments;
  }

  const newSelectedAssessment= shuffleArray(selectedAssessment)

  const testBanner =
    banners.find(
      (banner) => banner.id === (initiatedAssessment?.testId as string)
    ) || null;

  const submitted= submittedQuestionIDS.length
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <AssessmentBanners
        banners={banners}
        initiated={initiatedAssessment}
        firstTest={newSelectedAssessment}
        testBanner={testBanner}
        acceptedAssessments={myAcceptedAssessments}
        submitted={submitted}
      />
    </div>
  );
};

export default Page;
