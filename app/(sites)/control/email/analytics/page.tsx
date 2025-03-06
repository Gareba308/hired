import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { EmailCategories } from "../../_components/emailing/EmailCategories";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/emailing");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/emailing");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/emailing");
  const currentDate = new Date();

  const allJobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allWorkerDesires = await db.workerDesires.findMany();

  const jobCategoryCounts = allJobs.reduce((counts, job) => {
    const category = job.category ?? "Unknown";
    const isEmailed = job.emailed ?? false;

    counts[category] = counts[category] || {
      jobCount: 0,
      emailedCount: 0,
      notEmailedCount: 0,
    };
    counts[category].jobCount += 1;
    counts[category].emailedCount += isEmailed ? 1 : 0;
    counts[category].notEmailedCount += isEmailed ? 0 : 1;

    return counts;
  }, {} as Record<string, { jobCount: number; emailedCount: number; notEmailedCount: number }>);

  const desireCategoryCounts = allWorkerDesires.reduce((counts, desire) => {
    const category = desire.category ?? "Unknown";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const combinedData = Object.keys(jobCategoryCounts).map((category) => ({
    category,
    jobCount: jobCategoryCounts[category].jobCount,
    emailedCount: jobCategoryCounts[category].emailedCount,
    notEmailedCount: jobCategoryCounts[category].notEmailedCount,
    desireCount: desireCategoryCounts[category] || 0,
  }));
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EmailCategories combinedData={combinedData} />
    </div>
  );
};

export default Page;
