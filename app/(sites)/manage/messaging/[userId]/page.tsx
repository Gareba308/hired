import { db } from "@/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WorkerMessageDetails from "../../_components/messaging/WorkerMessageDetails";

interface UserMessageProps {
  params: {
    userId: string;
  };
}

export async function generateStaticParams() {
  const workersMessages = await db.employerContactWorker.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const workersUserIDs= workersMessages.map((worker) => worker.workerUserId).slice(0, 500);

  return workersUserIDs
}

const Page = async ({ params }: UserMessageProps) => {
  const { userId:workerId } = params;

  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login/enterprises?origin=manage/messaging/${workerId}`);
  const userId = session.id;
  if (!userId) redirect(`/home/login/enterprises?origin=manage/messaging/${workerId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect(`/home/login/enterprises?origin=manage/messaging/${workerId}`);
  
  const userExists = await db.user.findFirst({
    where: {
      id: workerId,
    },
    select:{
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  if(!userExists) redirect('/manage/messaging')
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
  });
  const oneUserMessages = await db.employerContactWorker.findMany({
    where: {
      workerUserId: userExists.id,
      employerHide: {
        equals: false,
      },
      employerArchive: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  const allOneUserMessages= await db.employerContactWorker.findMany({
    where: {
      workerUserId: userExists.id,
      employerUserId: userId
    }
  })

  const workerMessages = await db.employerContactWorker.findMany({
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

  const messagesUserID = workerMessages.map(
    (message) => message.workerUserId
  );

  const workersWithMessages = await db.user.findMany({
    where: {
      id: {
        in: messagesUserID,
      },
    },
    select:{
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  const isUserActive= await db.active.findFirst({
    where: {
      userId: userExists.id
    },
    select: {
      connected: true
    }
  })

  const isConnected= isUserActive?.connected

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