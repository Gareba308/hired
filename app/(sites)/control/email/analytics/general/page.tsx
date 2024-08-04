import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { GeneralEmails } from "../../../_components/emailing/GeneralEmails";

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
  const allGeneralEmailed = await db.emailWorkerGeneral.findMany();

  const finalDataCountsForTable = await Promise.all(
    allGeneralEmailed.map(async (item) => {
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
      return {
        id: item.id,
        reason: item.reason,
        subject: item.subject,
        message: item.message,
        recipientsEmails: recipientsEmails,
        emailedUserIdsCount: item.emailedUserIds.length,
        createdAt: item.createdAt,
      };
    })
  );
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <GeneralEmails finalDataCountsForTable={finalDataCountsForTable}/>
    </div>
  );
};

export default Page;
