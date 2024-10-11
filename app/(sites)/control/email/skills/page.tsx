import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Job } from "@prisma/client";
import SkillsSection from "../../_components/emailing/SkillsSection";

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
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const workersNoEmail = await db.workerDesires.findMany({
    where: {
      noEmails: true,
    },
  });

  const workersNoEmailIDs = workersNoEmail.flatMap((data) => data.userId);

  const allWorkersSkills = await db.skills.findMany({
    where: {
      userId: {
        notIn: workersNoEmailIDs,
      },
    },
  });

  const emailedWorkersAndJobs = await db.emailWorker.findMany();
  const emailedWorkersOnSkills = await db.emailWorkerOnJobSkills.findMany();
  const findMatchingUsers = (
    job: Job
  ): { userId: string; matchingSkills: string[] }[] => {
    const matchingUsers: { userId: string; matchingSkills: string[] }[] = [];

    allWorkersSkills.forEach((user) => {
      const userSkills = user.skills ?? [];

      const matchingSkills = job.personal_skills.filter((skill) =>
        userSkills.includes(skill)
      );

      if (matchingSkills.length >= 2) {
        matchingUsers.push({
          userId: user.userId,
          matchingSkills,
        });
      }
    });

    return matchingUsers;
  };

  const matchingUsersAndSkills: {
    userId: string;
    jobId: string;
    matchingSkills: string[];
  }[] = [];

  allJobs.forEach((job) => {
    const matchingUsers = findMatchingUsers(job);
    matchingUsers.forEach((user) => {
      const alreadyEmailed = emailedWorkersAndJobs.some(
        (data) =>
          data.toEmailJobIDs.includes(job.id) &&
          data.recipientsUserIds.includes(user.userId)
      );
      if (!alreadyEmailed) {
        matchingUsersAndSkills.push({
          userId: user.userId,
          jobId: job.id,
          matchingSkills: user.matchingSkills,
        });
      }
    });
  });
  const filteredMatchingUsersAndSkills = matchingUsersAndSkills.filter(
    ({ userId, jobId }) => {
      return !emailedWorkersOnSkills.some(
        (data) =>
          data.emailedJobIds.includes(jobId) &&
          data.emailedUserIds.includes(userId)
      );
    }
  );

  const finalData: Record<
    string,
    { jobId: string; matchingSkills: string[] }[]
  > = {};

  filteredMatchingUsersAndSkills.forEach(
    ({ userId, jobId, matchingSkills }) => {
      if (!finalData[userId]) {
        finalData[userId] = [];
      }
      finalData[userId].push({ jobId, matchingSkills });
    }
  );

  const latestSevenOnSkills = emailedWorkersOnSkills.slice(0, 3);
  const finalDataCounts = latestSevenOnSkills.map((item) => {
    const uniqueEmailedJobIds = new Set(item.emailedJobIds);

    return {
      id: item.id,
      subject: item.subject,
      emailedUserIdsCount: item.emailedUserIds.length,
      emailedJobIdsCount: uniqueEmailedJobIds.size,
      createdAt: item.createdAt,
    };
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <SkillsSection finalData={finalData} finalDataCounts={finalDataCounts} />
    </div>
  );
};

export default Page;
