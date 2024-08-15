import React, { cache } from "react";
import { db } from "@/db";
import { headers } from "next/headers";
import { Job } from "@prisma/client";
import HomeJobsNavBarDetails from "../../_components/jobs/HomeJobsNavBarDetails";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

interface JobDetailsProps {
  params: {
    jobId: string;
  };
}

const getJob = cache(async (jobId: string) => {
  const jobExists = await db.job.findFirst({
    where: {
      id: jobId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobExists;
});

export async function generateStaticParams() {
  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return jobs.map((job) => job.id);
}

export async function generateMetadata({
  params,
}: JobDetailsProps): Promise<Metadata> {
  const { jobId } = params;

  const job = await getJob(jobId);

  if (!job) {
    return {
      title: "Job not found",
      description: "The job you are looking for does not exist.",
    };
  }
  const jobSkills = job.personal_skills;
  const selectedSkills = jobSkills.slice(0, 7);
  selectedSkills.push(`jobs in ${job.county}, jobs, jobs in Kenya`);
  return {
    title: `${job.job_title}`,
    description: job.summaryDescription,
    keywords: selectedSkills,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: `${job.job_title}`,
      description: job.summaryDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogJobDetail,
          width: 1200,
          height: 630,
          alt: `${job.job_title}`,
        },
      ],
    },
    alternates: {
      canonical: `/home/jobs/${job.id}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.job_title}`,
      description: job.summaryDescription,
      images: [
        {
          url: siteConfig.ogJobDetail,
          width: 1200,
          height: 630,
          alt: `${job.job_title}`,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}

const Page = async ({ params }: JobDetailsProps) => {
  const { jobId } = params;

  const jobExists = await getJob(jobId);

  if (!jobExists) redirect("/home/jobs");
  const header = headers();

  const cookiePairs = header.get("cookie");
  let viewID;
  for (const pair of cookiePairs ? cookiePairs.split(";") : []) {
    const [key, value] = pair.split("=").map((item) => item.trim());
    if (key === "next-auth.csrf-token") {
      viewID = value;
      break;
    }
  }
  const currentDate = new Date();
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

  //  Popular Hot Not Applied
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
  const jobIDS = sortedApplications.map((top) => top.jobId);
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

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 4);

  const viewedJobs = await db.jobView.findMany({
    where: {
      viewID,
    },
  });

  const jobCategory = jobExists.category as string;

  const similarJobs = await db.job.findMany({
    where: {
      category: jobCategory,
      deadline: {
        gte: currentDate,
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

  const randomElements = getRandomElement(similarJobs, 7);
  return (
    <div className="mt-5">
      <HomeJobsNavBarDetails
        jobs={jobs}
        viewID={viewID as string}
        popular={finalSortedPopularJobs}
        viewed={viewedJobs}
        job={jobExists}
        similarJobs={randomElements}
      />
    </div>
  );
};

export default Page;
