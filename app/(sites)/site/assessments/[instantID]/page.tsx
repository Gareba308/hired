import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import InstantResultsBanner from "../../_components/assessments/InstantResultsBanner";

interface InstantResultsProps {
  params: {
    instantID: string;
  };
}
const Page = async ({ params }: InstantResultsProps) => {
  const { instantID } = params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/assessments");
  const userId = session.id;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/assessments");

  const assessmentResults = await db.acceptToBeAssessed.findFirst({
    where: {
      id: instantID,
      userId,
      acceptBeTested: {
        equals: true,
      },
      new: {
        equals: true,
      },
    },
  });

  if (!assessmentResults) redirect("/site/assessments");
  const banner = await db.assessmentBanner.findFirst({
    where: {
      id: assessmentResults.testId,
    },
  });
  if (!banner) redirect("/site/assessments");

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <InstantResultsBanner
        banner={banner}
        instantResults={assessmentResults}
        instantID={instantID}
      />
    </div>
  );
};

export default Page;
