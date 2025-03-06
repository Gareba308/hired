import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import EmailSection from "../_components/emailing/EmailSection";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/emailing");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/emailing");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/emailing");
  const currentDate = new Date();

  const allJobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allWorkerDesires = await db.workerDesires.findMany({
    where: {
      noEmails: false,
    },
  });
  const emailedWorkersOnSkills = await db.emailWorkerOnJobSkills.findMany();
  const emailedWorkersAndJobsBasedOnCategory = await db.emailWorker.findMany();
  const emailedJobUserSet = new Set();
  emailedWorkersOnSkills.forEach(({ emailedJobIds, emailedUserIds }) => {
    emailedJobIds.forEach((jobId) => {
      emailedUserIds.forEach((userId) => {
        emailedJobUserSet.add(`${jobId}-${userId}`);
      });
    });
  });
  const emailedJobUserSetBasedOnCategory = new Set();
  emailedWorkersAndJobsBasedOnCategory.forEach(
    ({ toEmailJobIDs, recipientsUserIds }) => {
      toEmailJobIDs.forEach((jobId) => {
        recipientsUserIds.forEach((userId) => {
          emailedJobUserSetBasedOnCategory.add(`${jobId}-${userId}`);
        });
      });
    }
  );
  const jobCategoryCounts = allJobs.reduce((counts, job) => {
    const category = job.category ?? "Unknown";
    const isEmailed = job.emailed ?? false;

    counts[category] = counts[category] || {
      jobCount: 0,
      unemailedJobIds: [],
      userDesireIds: [],
    };
    counts[category].jobCount += 1;
    if (!isEmailed) {
      counts[category].unemailedJobIds.push(job.id);
    }

    return counts;
  }, {} as Record<string, { jobCount: number; unemailedJobIds: string[]; userDesireIds: string[] }>);

  const desireCategoryCounts = allWorkerDesires.reduce((counts, desire) => {
    const category = desire.category ?? "Unknown";
    counts[category] = counts[category] || {
      desireCount: 0,
      userDesireIds: [],
    };
    counts[category].desireCount += 1;
    counts[category].userDesireIds.push(desire.userId);

    return counts;
  }, {} as Record<string, { desireCount: number; userDesireIds: string[] }>);

  const combinedData = Object.keys(jobCategoryCounts)
    .filter(
      (category) =>
        jobCategoryCounts[category].unemailedJobIds.length > 0 ||
        desireCategoryCounts[category]?.desireCount > 0
    )
    .map((category) => ({
      category,
      unemailedJobIds: jobCategoryCounts[category].unemailedJobIds,
      userDesireIds: desireCategoryCounts[category]?.userDesireIds || [],
    }))
    .filter(({ userDesireIds }) => userDesireIds.length > 0);

  const filteredCombinedData = combinedData.map(
    ({ category, unemailedJobIds, userDesireIds }) => ({
      category,
      unemailedJobIds: unemailedJobIds.filter((jobId) => {
        return !userDesireIds.some((userId) =>
          emailedJobUserSet.has(`${jobId}-${userId}`)
        );
      }),
      userDesireIds,
    })
  );

  const categoryFilteredCombinedData = filteredCombinedData.map(
    ({ category, unemailedJobIds, userDesireIds }) => ({
      category,
      unemailedJobIds: unemailedJobIds.filter((jobId) => {
        return !userDesireIds.some((userId) =>
          emailedJobUserSetBasedOnCategory.has(`${jobId}-${userId}`)
        );
      }),
      userDesireIds,
    })
  );

  const finalData = categoryFilteredCombinedData
    .filter(
      ({ unemailedJobIds, userDesireIds }) =>
        unemailedJobIds.length > 0 && userDesireIds.length > 0
    )
    .map(({ category, unemailedJobIds, userDesireIds }) => ({
      category,
      unemailedJobIds,
      userDesireIds,
    }));
  const toEmailJobIDs = finalData.flatMap((data) => data.unemailedJobIds);
  const desireIDs = finalData.flatMap((data) => data.userDesireIds);
  const userEmailsOfDesires = await db.user.findMany({
    where: {
      id: {
        in: desireIDs,
      },
    },
  });

  const jobToEmail = await db.job.findMany({
    where: {
      id: {
        in: toEmailJobIDs,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const latestThreeOnCategory = emailedWorkersAndJobsBasedOnCategory.slice(
    0,
    3
  );
  const finalDataCounts = latestThreeOnCategory.map((item) => {
    const uniqueToEmailJobIDs = new Set(item.toEmailJobIDs);
    
    return {
      id: item.id,
      jobCategory: item.jobCategory,
      recipientsEmailCount: item.recipientsEmail.length,
      toEmailJobIDsCount: uniqueToEmailJobIDs.size,
      createdAt: item.createdAt,
    };
  });

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EmailSection
        combinedData={finalData}
        desiredUsers={userEmailsOfDesires}
        jobs={jobToEmail}
        finalDataCounts={finalDataCounts}
      />
    </div>
  );
};

export default Page;