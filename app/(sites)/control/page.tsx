import { db } from "@/db";
import AllJobs from "./_components/job/AllJobs";
import NoJobs from "./_components/job/NoJobs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Page = async () => {
  const currentDate = new Date();

  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login?origin=control/jobs");

  const userId = session.id;

  if (!userId) redirect("/home/login?origin=control/jobs");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/jobs");

  if (jobs.length === 0) {
    return (
      <>
        <NoJobs />
      </>
    );
  }

  return (
    <div className="text-base">
      <AllJobs jobs={jobs} userId={userId}/>
    </div>
  );
};

export default Page;
