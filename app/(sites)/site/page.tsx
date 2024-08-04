import { db } from "@/db";
import AllJobs from "./_components/job/AllJobs";
import NoJobs from "./_components/job/NoJobs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Job } from "@prisma/client";
import { headers } from "next/headers";

const Page = async () => {
  const currentDate = new Date();
  const header= headers()

  const cookiePairs = header.get("cookie");
  let viewID;
  for (const pair of cookiePairs ? cookiePairs.split(";") : []) {
    const [key, value] = pair.split("=").map((item) => item.trim());
    if (key === "next-auth.csrf-token") {
      viewID = value;
      break;
    }
  }

  const viewedJobs= await db.jobView.findMany({
    where: {
      viewID
    }
  })

  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
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

  if (!session) redirect("/home/login?origin=site/jobs");

  const userId = session.id;

  if (!userId) redirect("/home/login?origin=site/jobs");

  const myApplications = await db.application.findMany({
    where: {
      userId,
    },
  });

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/jobs");

  if (jobs.length === 0) {
    return (
      <>
        <NoJobs />
      </>
    );
  }

  const mySavedJobs = await db.savedJobs.findMany({
    where: {
      userId,
    },
  });

  const savedJobIDS = mySavedJobs?.flatMap((saved) => saved.jobID);

  //  Popular Hot Not Applied
  const allApplications = await db.application.findMany({
    where: {
      NOT: {
        userId,
      },
    },
  });
  const applicationsCounts: Record<string, number> = {};
  allApplications.forEach((application) => {
    const { jobId } = application;
    if (jobId) {
      applicationsCounts[jobId] = (applicationsCounts[jobId] || 0) + 1;
    }
  });
  const applicationsArray = Object.entries(applicationsCounts).map(
    ([jobId, count]) => ({
      jobId,
      count,
    })
  );
  const sortedApplications = applicationsArray.sort(
    (a, b) => b.count - a.count
  );
  const jobIDS = sortedApplications.map((top) => top.jobId);
  const popularJobs = await db.job.findMany({
    where: {
      id: {
        in: jobIDS,
      },
      NOT: {
        OR: [
          { id: { in: savedJobIDS } },
          { id: { in: myApplications.map((app) => app.jobId) } },
        ],
      },
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const sortedPopularJobs = jobIDS
    .map((jobId) => popularJobs.find((job) => job.id === jobId))
    .filter((job) => job !== undefined) as Job[];

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 4);

  return (
    <div className="text-base">
      <AllJobs
        jobs={jobs}
        userId={userId}
        myApplications={myApplications}
        mySavedJobs={mySavedJobs}
        popular={finalSortedPopularJobs}
        viewed={viewedJobs}
        viewID={viewID as string}
      />
    </div>
  );
};

export default Page;