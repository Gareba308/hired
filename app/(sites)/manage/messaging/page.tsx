import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import WorkerMessages from "../_components/messaging/WorkerMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=manage/messaging");
  const userId = session.id;
  const email = session?.user?.email;
  if (!userId) redirect("/home/login?origin=manage/messaging");
  if (!email) redirect("/home/login?origin=manage/messaging");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/messaging");

  const contactWorkerMessages = await db.employerContactWorker.findMany({
    where: {
      employerUserId: userId,
      employerHide: {
        equals: false,
      },
      employerArchive: {
        equals: false
      }
    },
  });

  const messagesWorkerUserIDS = contactWorkerMessages.flatMap(
    (message) => message.workerUserId
  );

  const workersWithMessages = await db.user.findMany({
    where: {
      id: {
        in: messagesWorkerUserIDS,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const users = await db.user.findMany({
    where: {
      role: "worker",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return (
    <div>
      <WorkerMessages
        workerMessages={contactWorkerMessages}
        workersWithMessages={workersWithMessages}
        users={users}
      />
    </div>
  );
};

export default Page;
