import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NoJobs from "../_components/job/NoJobs";
import UnpublishedJobs from "../_components/job/UnpublishedJobs";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/publication");
  const userId = session.id;
  const userEmail = session.user?.email as string;
  const currentDate= new Date()
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email: userEmail,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/publication");

  const isAdmin = await db.admin.findFirst({
    where: {
      adminEmail: userEmail,
    },
  });

  if (!isAdmin) redirect("/home/login?origin=control/publication");

  const myJobs = await db.job.findMany({
    where : {
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: [
      { rankTop: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 100
  });

  if (myJobs.length === 0) {
    return (
      <>
        <NoJobs />
      </>
    );
  }

  return (
    <div className="text-base">
      <UnpublishedJobs myJobs={myJobs}/>
    </div>
  );
};

export default Page;