import React from "react";
import { Suspense } from "react";
import HomeJobsNavBar from "../_components/jobs/HomeJobsNavBar";
import { db } from "@/db";
import { headers } from "next/headers";
import { Job } from "@prisma/client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import FooterJobs from "@/components/FooterJobs";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute:
      "Latest Jobs in Kenya, Vacancies, Career Opportunities & How to Make or Earn Money Online in Kenya with Freelance Gigs",
  },
  description:
   "Find the latest jobs in Kenya. Apply for vacancies, career opportunities & recruitment listings make money online in Kenya. Sign up free, explore top companies, and secure your future today.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: {
      absolute:
        "Latest Jobs in Kenya, Vacancies, Career Opportunities & How to Make or Earn Money Online in Kenya with Freelance Gigs",
    },
    description:
     "Find the latest jobs in Kenya. Apply for vacancies, career opportunities & recruitment listings make money online in Kenya. Sign up free, explore top companies, and secure your future today.",
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
    title: {
      absolute:
        "Latest Jobs in Kenya, Vacancies, Career Opportunities & How to Make or Earn Money Online in Kenya with Freelance Gigs",
    },
    description:
     "Find the latest jobs in Kenya. Apply for vacancies, career opportunities & recruitment listings make money online in Kenya. Sign up free, explore top companies, and secure your future today.",
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
    if (
      key === "__Host-next-auth.csrf-token" ||
      key === "next-auth.csrf-token"
    ) {
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
      published: {
        equals: true,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: [{ rankTop: "desc" }, { createdAt: "desc" }],
  });

  const detailedJobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: [{ rankTop: "desc" }, { createdAt: "desc" }],
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
      published: {
        equals: true,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      id: true,
      job_title: true,
      company_name: true,
      companyLogo: true,
      createdAt: true,
    }
  });

  const sortedPopularJobs = jobIDS
    .map((jobId) => popularJobs.find((job) => job.id === jobId))
    .filter((job) => job !== undefined) as Job[];

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 4);

  return (
    <>
      <section className="mt-5 bg-white px-4 mx-auto h-full min-h-[calc(100vh-70px)]">
        <Suspense
          fallback={
            <div className="flex items-center mt-[calc(50vh-50%)] justify-center h-full">
              <Loader className="shrink-0 animate-spin h-9 w-9 sm:h-10 sm:w-10 text-gray-600" />
            </div>
          }
        >
          <HomeJobsNavBar
            jobs={jobs}
            viewID={viewID as string}
            popular={finalSortedPopularJobs}
            detailedJobs={detailedJobs}
          />
        </Suspense>
      </section>
      <FooterJobs />
    </>
  );
};

export default Page;
