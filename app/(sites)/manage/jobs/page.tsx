import { db } from "@/db";
import AllJobs from "../_components/job/AllJobs";
import NoJobs from "../_components/job/NoJobs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Jobs",
}

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
    orderBy: [
      { rankTop: 'desc' },
      { createdAt: 'desc' },
    ],
    select: {
      id: true,
      job_title: true,
      personal_skills: true,
      category: true,
      job_type: true,
      county: true,
      deadline: true,
      possible_pay: true,
      academic: true,
      ownPlatformMethod: true,
      experience: true,
      companyLogo: true,
      companyId: true,
      company_name: true,
      rankTop: true,
      createdAt: true,
    }
  });

  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login/enterprises?origin=manage/jobs");

  const userId = session.id;

  if (!userId) redirect("/home/login/enterprises?origin=manage/jobs");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/jobs");

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
