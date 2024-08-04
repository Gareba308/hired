import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NoSavedJobs from "../_components/savedJobs/NoSavedJobs";
import AllSavedJobs from "../_components/savedJobs/AllSavedJobs";
import { Job } from "@prisma/client";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/saved-jobs");
  const userId = session.id;
  const userEmail = session.user?.email;

  if (!userId || !userEmail) redirect("/home/login?origin=site/saved-jobs");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email: userEmail,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/saved-jobs");

  const isWorker = await db.workers.findFirst({
    where: {
      workerEmail: userEmail,
    },
  });

  const mySavedJobs = await db.savedJobs.findMany({
    where: {
      userId,
      isWorkerID: isWorker?.id as string,
    },
  });
  const savedIDS = mySavedJobs?.map((top) => top.jobID!);

  const currentDate = new Date();

  const jobs = await db.job.findMany({
    where: {
      id: {
        in: savedIDS,
      },
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

  if (jobs.length === 0) {
    return (
      <>
        <NoSavedJobs />
      </>
    );
  }

  //   Finding Top Employer
  const allJobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });
  const employersVacancies: Record<string, number> = {};
  allJobs.forEach((job) => {
    const { companyId, numberOfPositions } = job;
    if (companyId && numberOfPositions) {
      employersVacancies[companyId] =
        (employersVacancies[companyId] || 0) + parseInt(numberOfPositions);
    }
  });
  const employersArray = Object.entries(employersVacancies).map(
    ([companyId, vacanciesCount]) => ({
      companyId,
      vacanciesCount,
    })
  );
  const sortedEmployers = employersArray.sort(
    (a, b) => b.vacanciesCount - a.vacanciesCount
  );

  const topEmployers = sortedEmployers.slice(0, 5);

  const topEmployerIDs = topEmployers.map((top) => top.companyId);

  const allTopEmployersWithVacancies = await Promise.all(
    topEmployerIDs.map(async (companyId) => {
      const companyDetails = await db.company.findUnique({
        where: {
          id: companyId,
        },
      });
      return {
        companyDetails,
        vacanciesCount: employersVacancies[companyId],
      };
    })
  );

  // Popular job per company
  const allApplications = await db.application.findMany();
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

  const jobIDS = sortedApplications?.map((top) => top.jobId!);

  const popularJobs = await db.job.findMany({
    where: {
      id: {
        in: jobIDS,
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

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 7);


  return (
    <div className="text-base">
      <AllSavedJobs
        jobs={jobs}
        topEmployer={allTopEmployersWithVacancies as []}
        mySavedJobs={mySavedJobs}
        allPopular={finalSortedPopularJobs}
      />
    </div>
  );
};

export default Page;
