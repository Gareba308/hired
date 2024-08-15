import { db } from "@/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HelpMessageDetails from "../../../_components/help/workers/HelpMessageDetails";

interface JobSeekerID {
  params: {
    jobSeekerUserId: string;
  };
}

export async function generateStaticParams() {
  const workerHelps = await db.helpWorker.findMany();

  const workersUserIDs= workerHelps.map((help) => help.userId);
  return workersUserIDs;
}


const Page = async ({ params }: JobSeekerID) => {
  const { jobSeekerUserId } = params;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=control/help/jobseeker/${jobSeekerUserId}`);
  const userId = session.id;
  const role= session.role
  if (!userId )
    redirect(`/home/login?origin=control/help/jobseeker/${jobSeekerUserId}`);
  if (!role )
    redirect(`/home/login?origin=control/help/jobseeker/${jobSeekerUserId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect(`/home/login?origin=control/help/jobseeker/${jobSeekerUserId}`);

  const jobSeekerExists = await db.user.findFirst({
    where: {
      id: jobSeekerUserId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!jobSeekerExists) redirect("/control/help/jobseeker");

  const allHelpMessages = await db.helpWorker.findMany();

  const oneUserHelpMessages = await db.helpWorker.findMany({
    where: {
      userId: jobSeekerUserId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const userIDsWithHelpMessages = allHelpMessages.flatMap(
    (help) => help.userId
  );

  const allUserWithHelpMessages = await db.user.findMany({
    where: {
      id: {
        in: userIDsWithHelpMessages,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return (
    <div>
      <HelpMessageDetails
        userMessages={allHelpMessages}
        usersWithMessages={allUserWithHelpMessages}
        oneUserMessages={oneUserHelpMessages}
        senderExists={jobSeekerExists}
        myRole={dbUser.role as string}
      />
    </div>
  );
};

export default Page;
