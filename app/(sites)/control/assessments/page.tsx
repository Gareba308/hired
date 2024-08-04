import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import AssessmentTest from "../_components/assessments/AssessmentTest";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session)
    redirect("/home/login?origin=control/assessments/create-assessment");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect("/home/login?origin=control/assessments/create-assessment");

  const getAssessmentBanners = await db.assessmentBanner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <AssessmentTest banners={getAssessmentBanners} />
    </div>
  );
};

export default Page;
