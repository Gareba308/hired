import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { CategoryEmails } from "../../../_components/emailing/CategoryEmails";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/email/analytics/category");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/email/analytics/category");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!dbUser) redirect("/home/login?origin=control/email/analytics/category");
  const emailedWorkersAndJobsBasedOnCategory = await db.emailWorker.findMany();
  const finalDataCountsForTable = await Promise.all(
    emailedWorkersAndJobsBasedOnCategory.map(async (item) => {
      const uniqueToEmailJobIDs = new Set(item.toEmailJobIDs);
      const emailedJobs = await db.job.findMany({
        where: {
          id: { in: Array.from(uniqueToEmailJobIDs) },
        },
        select: {
          job_title: true,
        },
      });
      const emailedJobTitles = emailedJobs.map((job) => job.job_title);

      return {
        id: item.id,
        jobCategory: item.jobCategory,
        recipientsEmailCount: item.recipientsEmail.length,
        subject: item.subject,
        recipientsEmails: item.recipientsEmail,
        toEmailJobIDsCount: uniqueToEmailJobIDs.size,
        toEmailJobIDs: item.toEmailJobIDs,
        createdAt: item.createdAt,
        emailedJobTitles: emailedJobTitles,
        message: item.emailBody
      };
    })
  );
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <CategoryEmails finalDataCountsForTable={finalDataCountsForTable} />
    </div>
  );
};

export default Page;