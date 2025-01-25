import React from "react";
import { Suspense } from "react";
import { db } from "@/db";
import { headers } from "next/headers";
import { Job } from "@prisma/client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import FooterJobs from "@/components/FooterJobs";
import { Loader2 } from "lucide-react";
import HomeCompaniesNavBar from "../../_components/companies/HomeCompaniesNavBar";

interface CompanyProps {
  params: {
    slug: string;
  };
}
const convertFromSlug = (str: string): string => {
  return decodeURIComponent(str).replace(/_/g, " ").trim();
};
const currentYear = new Date().getFullYear();

const getCompanyJobs = async (slug: string) => {
  const currentDate = new Date();
  const trueCompanyName = convertFromSlug(slug).trim();
  const jobs = await db.job.findMany({
    where: {
      company_name: {
        contains: trueCompanyName,
        mode: "insensitive",
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

  const filteredJobs = jobs.filter((job) => {
    const normalizedJobCompanyName = job.company_name.trim().toLowerCase();
    return normalizedJobCompanyName === trueCompanyName.toLowerCase();
  });

  return filteredJobs;
};

export async function generateMetadata({
  params,
}: CompanyProps): Promise<Metadata> {
  const capitalize = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const { slug } = params;
  const trueCompanyName = capitalize(convertFromSlug(slug));
  const jobCompanies = await getCompanyJobs(slug);
  if (jobCompanies.length === 0) {
    return {
      title: "There are no jobs by this company",
      description:
        "We did not find existing job opportunities by this company. Check back later",
    };
  }

  return {
    title: `Explore Jobs at ${trueCompanyName}: For Latest Job Opportunities and Vacancies`,
    description: `Discover top ${trueCompanyName} jobs in Kenya. Explore career opportunities, job vacancies, and openings. Join a leading employer hiring now.`,
    keywords: [
      `Jobs at ${trueCompanyName}`,
      `${trueCompanyName} job vacancies`,
      `${trueCompanyName} hiring now`,
      `${trueCompanyName} career opportunities`,
      "Top employers in Kenya",
      `Latest jobs in Kenya ${currentYear}`,
      `Job openings at ${trueCompanyName}`,
      "Best companies to work for in Kenya",
      "Kenyan companies hiring",
      `Career growth at ${trueCompanyName}`,
      `Vacancies at ${trueCompanyName} Kenya`,
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: `Explore Jobs at ${trueCompanyName}: For Latest Job Opportunities and Vacancies`,
      description: `Discover top ${trueCompanyName} jobs in Kenya. Explore career opportunities, job vacancies, and openings. Join a leading employer hiring now.`,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogCompaniesDetails,
          width: 1200,
          height: 630,
          alt: `${trueCompanyName}`,
        },
      ],
    },
    alternates: {
      canonical: `/home/companies/${slug}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `Explore Jobs at ${trueCompanyName}: For Latest Job Opportunities and Vacancies`,
      description: `Discover top ${trueCompanyName} jobs in Kenya. Explore career opportunities, job vacancies, and openings. Join a leading employer hiring now.`,
      images: [
        {
          url: siteConfig.ogCompaniesDetails,
          width: 1200,
          height: 630,
          alt: `${trueCompanyName}`,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}

const Page = async ({ params }: CompanyProps) => {
  const { slug } = params;
  const trueCompanyName = convertFromSlug(slug);
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
  const jobs = await getCompanyJobs(slug);

  //Popular job
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
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const sortedPopularJobs = jobIDS
    .map((jobId) => popularJobs.find((job) => job.id === jobId))
    .filter((job) => job !== undefined) as Job[];

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 4);

  const liveJobsCompanyIDS = jobs.flatMap((job) => job.companyId);
  const companyProfiles = await db.company.findMany({
    where: {
      id: {
        in: liveJobsCompanyIDS,
      },
    },
  });
  return (
    <>
      <section className="mt-5 bg-white h-full min-h-[calc(100vh-70px)]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="shrink-0 animate-spin h-7 w-7 text-gray-600" />
            </div>
          }
        >
          <HomeCompaniesNavBar
            jobs={jobs}
            viewID={viewID as string}
            companyName={trueCompanyName}
            popular={finalSortedPopularJobs}
            companyProfiles={companyProfiles}
          />
        </Suspense>
      </section>
      <FooterJobs />
    </>
  );
};

export default Page;
