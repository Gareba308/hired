import EditQuestion from "@/app/(sites)/control/_components/assessments/editQuestion/EditQuestion";
import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
interface QuestionsProps {
  params: {
    questionID: string;
    assessmentID: string;
  };
}
const Page = async ({ params }: QuestionsProps) => {
  const { questionID, assessmentID } = params;

  const questionExists = await db.assessment.findFirst({
    where: {
      id: questionID,
      bannerID: assessmentID,
    },
  });

  if (!questionExists)
    redirect(
      `/control/assessments/${assessmentID}?origin=control/assessments/${assessmentID}/settings/${questionExists}`
    );

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EditQuestion question={questionExists}/>
    </div>
  );
};

export default Page;
