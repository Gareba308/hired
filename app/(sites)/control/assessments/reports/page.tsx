import React from "react";
import AssessmentReports from "../../_components/assessments/reports/AssessmentReports";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/assessments/reports");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/assessments/reports");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/assessments/reports");

  const getAssessmentReports = await db.reportAssessmentProblem.findMany({
    select: {
      id: true,
      userId: true,
      initiateID: true,
      fullName: true,
      email: true,
      assessmentCategory: true,
      assessmentName: true,
      questionID: true,
      subject: true,
      report: true,
      sorted: true,
      createdAt: true
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <AssessmentReports reports={getAssessmentReports} />
    </div>
  );
};

export default Page;
