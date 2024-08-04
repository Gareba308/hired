import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import WorkerMessages from "../_components/messaging/WorkerMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/messaging");
  const userId = session.id;
  const email = session?.user?.email;
  if (!userId) redirect("/home/login?origin=site/messaging");
  if (!email) redirect("/home/login?origin=site/messaging");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/messaging");

  const contactWorkerMessages = await db.employerContactWorker.findMany({
    where: {
      workerUserId: userId,
      workerHide: {
        equals: false,
      },
      workerArchive: {
        equals: false
      }
    },
  });

  const messagesEmployersCompanyUserID = contactWorkerMessages.flatMap(
    (message) => message.companyId
  );

  const companiesWithMessages = await db.company.findMany({
    where: {
      id: {
        in: messagesEmployersCompanyUserID,
      },
    },
  });
  return (
    <div>
      <WorkerMessages
        workerMessages={contactWorkerMessages}
        companiesWithMessages={companiesWithMessages}
      />
    </div>
  );
};

export default Page;
