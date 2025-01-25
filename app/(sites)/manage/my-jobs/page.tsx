import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NoMyJobs from "../_components/job/NoMyJobs";
import AllMyJobs from "../_components/job/AllMyJobs";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/my-jobs");
  const userId = session.id;
  const userEmail = session.user?.email as string;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email: userEmail,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/my-jobs");

  const isEmployer = await db.employers.findFirst({
    where: {
      employerEmail: userEmail,
    },
  });

  if (!isEmployer) redirect("/home/login/enterprises?origin=manage/my-jobs");

  const isEmployerID = isEmployer.id;

  const currentDate = new Date();

  const myJobs = await db.job.findMany({
    where: {
      userId: userId,
      isEmployerID: isEmployerID,
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc"
    },
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
      published: true,
      companyId: true,
      company_name: true,
      rankTop: true,
      createdAt: true,
    }
  });

  if (myJobs.length === 0) {
    return (
      <>
        <NoMyJobs />
      </>
    );
  }

  return (
    <div className="text-base">
      <AllMyJobs myJobs={myJobs}/>
    </div>
  );
};

export default Page;
