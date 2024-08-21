import { db } from "@/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WorkerMessageDetails from "../../../_components/messageWorkers/WorkerMessageDetails";

interface UserMessageProps {
  params: {
    userId: string;
  };
}
export const revalidate = 60;
export async function generateStaticParams() {
  const workersMessages = await db.contactWorker.findMany();

  return workersMessages.map((message) => ({ userId: message.workerUserId }));
}

const Page = async ({ params }: UserMessageProps) => {
  const { userId: workerId } = params;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=control/messages/workers/${workerId}`);
  const userId = session.id;
  if (!userId)
    redirect(`/home/login?origin=control/messages/workers/${workerId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect(`/home/login?origin=control/messages/workers/${workerId}`);

  const userExists = await db.user.findFirst({
    where: {
      id: workerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!userExists) redirect("/control/messages/workers");
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
  const oneUserMessages = await db.contactWorker.findMany({
    where: {
      workerUserId: userExists.id,
      adminHide: {
        equals: false,
      },
      adminArchive: {
        equals: false,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const allOneUserMessages = await db.contactWorker.findMany({
    where: {
      workerUserId: userExists.id,
      adminUserId: userId,
    },
  });

  const workerMessages = await db.contactWorker.findMany({
    where: {
      adminUserId: userId,
      adminHide: {
        equals: false,
      },
      adminArchive: {
        equals: false,
      },
    },
  });

  const messagesUserID = workerMessages.map((message) => message.workerUserId);

  const workersWithMessages = await db.user.findMany({
    where: {
      id: {
        in: messagesUserID,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const isUserActive = await db.active.findFirst({
    where: {
      userId: userExists.id,
    },
    select: {
      connected: true,
    },
  });

  const isConnected = isUserActive?.connected;

  return (
    <div>
      <WorkerMessageDetails
        workerMessages={workerMessages}
        workersWithMessages={workersWithMessages}
        oneUserMessages={oneUserMessages}
        userExists={userExists}
        allOneUserMessages={allOneUserMessages}
        users={users}
        isConnected={isConnected as boolean}
      />
    </div>
  );
};

export default Page;
