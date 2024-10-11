import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Job } from "@prisma/client";
import UnpublishedJobsDetails from "../../_components/job/UnpublishedJobsDetails";
interface UnpublishedJobsDetailsProps {
  params: {
    jobId: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
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
  });

  return jobs.map((job) => ({ jobId: job.id }));
}

const Page = async ({ params }: UnpublishedJobsDetailsProps) => {
  const { jobId } = params;

  const job = await db.job.findFirst({
    where: {
      id: jobId,
    },
  });

  if (!job) redirect("/control/publication");

  const currentDate = new Date();

  const jobCategory = job.category as string;

  const similarJobs = await db.job.findMany({
    where: {
      category: jobCategory,
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
      id: {
        not: {
          equals: jobId,
        },
      },
    },
  });
  const getRandomElement = (array: any[], numElement: number) => {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, numElement);
  };

  const randomElements = getRandomElement(similarJobs, 10);

  //  Popular Applied Job
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
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const sortedPopularJobs = jobIDS
    .map((jobId) => popularJobs.find((job) => job.id === jobId))
    .filter((job) => job !== undefined) as Job[];

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 10);

  const companyProfile = await db.company.findFirst({
    where: {
      userId: job.userId,
    },
  });

  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login");
  const userID = session.id;

  const allJobs = await db.job.findMany();
  return (
    <div className="space-y-6  pb-5 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-4 md:px-6 text-gray-700 rounded-lg">
      <UnpublishedJobsDetails
        job={job}
        companyProfile={companyProfile}
        similarJobs={randomElements}
        popularJobs={finalSortedPopularJobs}
        userID={userID}
        allJobs={allJobs}
      />
    </div>
  );
};

export default Page;
