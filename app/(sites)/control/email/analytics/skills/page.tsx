import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { SkillEmails } from "../../../_components/emailing/SkillEmails";

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

  const emailedWorkersOnSkills = await db.emailWorkerOnJobSkills.findMany();
  const finalDataCountsForTable = await Promise.all(
    emailedWorkersOnSkills.map(async (item) => {
      const uniqueToEmailJobIDs = new Set(item.emailedJobIds);
      const emailedJobs = await db.job.findMany({
        where: {
          id: { in: Array.from(uniqueToEmailJobIDs) },
        },
        select: {
          job_title: true,
        },
      });

      const emailedUserEmails = await db.user.findMany({
        where: {
          id: {
            in: item.emailedUserIds,
          },
        },
        select: {
          email: true,
        },
      });
      const recipientsEmails = emailedUserEmails.map((user) => user.email);
      const emailedJobTitles = emailedJobs.map((job) => job.job_title);
      return {
        id: item.id,
        reason: item.reason,
        recipientsUserIdsCount: item.emailedUserIds.length,
        subject: item.subject,
        recipientsEmails: recipientsEmails,
        toEmailJobIDsCount: uniqueToEmailJobIDs.size,
        toEmailJobIDs: item.emailedJobIds,
        createdAt: item.createdAt,
        emailedJobTitles: emailedJobTitles,
        message: item.message,
      };
    })
  );
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <SkillEmails finalDataCountsForTable={finalDataCountsForTable} />
    </div>
  );
};

export default Page;
