import React from "react";
import HomeJobsNavBar from "../_components/jobs/HomeJobsNavBar";
import { db } from "@/db";
import { headers } from "next/headers";
import { Job } from "@prisma/client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import FooterJobs from "@/components/FooterJobs";

export const metadata: Metadata = {
  title: "Available Jobs",
  description: `Find top job opportunities in Kenya for ${new Date().getFullYear()}. Discover, apply, and advance your career with the latest openings on Hired.`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Available Jobs",
    description: `Find top job opportunities in Kenya for ${new Date().getFullYear()}. Discover, apply, and advance your career with the latest openings on Hired.`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogJobPage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  keywords: [
    "Kenya job listings",
    "Top jobs in Kenya",
    "Kenyan employment opportunities",
    "Hired careers Kenya",
    "Job openings in Kenya",
    "Kenya job portal",
    "Search jobs Kenya",
    "Kenya recruitment",
    "Find employment Kenya",
    "Latest Kenyan job opportunities",
  ],
  alternates: {
    canonical: "/home/jobs",
    languages: {
      "en-US": "/en-US",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Available Jobs",
    description: `Find top job opportunities in Kenya for ${new Date().getFullYear()}. Discover, apply, and advance your career with the latest openings on Hired.`,
    images: [
      {
        url: siteConfig.ogJobPage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    creator: "@hiredke",
    site: "@hiredke",
  },
};

const Page = async () => {
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
  return (
    <>
      <div className="mt-5 bg-white min-h-[calc(100vh-70px)]">
        <HomeJobsNavBar
          jobs={jobs}
          viewID={viewID as string}
          popular={finalSortedPopularJobs}
        />
      </div>
      <FooterJobs />
    </>
  );
};

export default Page;
