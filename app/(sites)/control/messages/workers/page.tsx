import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import WorkerMessages from "../../_components/messageWorkers/WorkerMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/messages/workers");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/messages/workers");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/messages/workers");

  const workerMessages = await db.contactWorker.findMany({
    where: {
      adminUserId: userId,
    },
  });

  const messagesUserIDS = workerMessages.map(
    (message) => message.workerUserId
  );

  const workersWithMessages = await db.user.findMany({
    where: {
      id: {
        in: messagesUserIDS,
      },
    },
    select:{
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  const users= await db.user.findMany({
    where: {
      role:"worker"
    },
    select:{
      id: true,
      name: true,
      email: true,
      role: true
    }
  })
  return (
    <div>
      <WorkerMessages
        workerMessages={workerMessages}
        workersWithMessages={workersWithMessages}
        users={users}
      />
    </div>
  );
};

export default Page;