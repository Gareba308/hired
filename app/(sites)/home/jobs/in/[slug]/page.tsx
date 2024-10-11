import React from "react";
import { Suspense } from "react";
import { db } from "@/db";
import { headers } from "next/headers";
import { Job } from "@prisma/client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import FooterJobs from "@/components/FooterJobs";
import { Loader2 } from "lucide-react";
import HomeCompaniesNavBar from "../../../_components/popular/HomeCompaniesNavBar";

interface PopularProps {
  params: {
    slug: string;
  };
}
const convertFromSlug = (slug: string): string => {
  return decodeURIComponent(slug.replace(/-/g, " "));
};
const currentYear = new Date().getFullYear();
const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, (char) => encodeURIComponent(char))
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
};


const getPopularSearchesJobs = async (slug: string) => {
  const currentDate = new Date();
  let filterConditions: any = {
    deadline: {
      gte: currentDate,
    },
    published: {
      equals: true
    },
    createdAt: {
      gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), 
    },
  };

  switch (slug.toLowerCase()) {
    case "internship":
      filterConditions.job_type = {
        equals: "internship",
        mode: "insensitive",
      };
      break;
    case "nairobi":
      filterConditions.county = {
        equals: "nairobi",
        mode: "insensitive",
      };
      break;
    case "mombasa":
      filterConditions.county = {
        equals: "mombasa",
        mode: "insensitive",
      };
      break;
    case "latest":
      filterConditions.createdAt = {
        gte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000),
      };
      break;
    default:
      throw new Error("Unknown slug provided");
  }

  const jobs = await db.job.findMany({
    where: filterConditions,
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs;
};

export async function generateStaticParams() {
  const possibleSlugs = ["internship", "nairobi", "mombasa", "latest"];

  return possibleSlugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: PopularProps): Promise<Metadata> {
  const capitalize = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const { slug } = params;
  const trueSlugName = capitalize(convertFromSlug(slug));
  const jobsSlug = await getPopularSearchesJobs(slug);

  if (jobsSlug.length === 0) {
    return {
      title: "There are no jobs by this search query",
      description:
        "We did not find existing job opportunities by this search query. Check back later",
    };
  }

  let title: string;
  let description: string;
  let keywords: string[];

  switch (slug.toLowerCase()) {
    case "nairobi":
    case "mombasa":
      title = `Explore Jobs in ${trueSlugName}: Latest Job Opportunities and Vacancies`;
      description = `Looking for jobs in ${trueSlugName}? Discover top jobs in ${trueSlugName} Kenya. Explore career opportunities, job vacancies, and apply today to join leading companies in ${trueSlugName}.`;
      keywords = [
        `Jobs in ${trueSlugName}`,
        `${trueSlugName} job vacancies`,
        `${trueSlugName} hiring now`,
        `${trueSlugName} career opportunities`,
        `Latest jobs in ${trueSlugName}`,
        `Job openings in ${trueSlugName} Kenya`,
        "Top employers in Kenya",
        "Best companies to work for in Kenya",
      ];
      break;

    case "internship":
      title =  `Internship Opportunities and Vacancies in Kenya: Kickstart Your Career`,
      description = `Explore the best internship opportunities in Kenya. Find valuable internships across industries and apply to jumpstart your career.`;
      keywords = [
        "Internship opportunities in Kenya",
        "Kenya internships",
        "Internship vacancies",
        "Internship programs in Kenya",
        "Start your career with internships",
        "Internship positions in Kenya",
        "Career growth through internships",
        "Top internship employers in Kenya",
      ];
      break;

    case "latest":
      title = `Latest Jobs in Kenya: Fresh Opportunities and Vacancies`;
      description = `Stay up to date with the latest job openings in Kenya. Discover new career opportunities and apply for fresh vacancies today.`;
      keywords = [
        "Latest jobs in Kenya",
        "New job opportunities in Kenya",
        "Fresh job openings",
        "Kenya job vacancies",
        "Recent job posts in Kenya",
        "Apply to the latest jobs",
        "Job search in Kenya",
        "Kenya's newest job openings",
      ];
      break;

    default:
      title = `Explore Job Opportunities in Kenya: Latest Vacancies and Openings`;
      description = `Looking for a new job in Kenya? Discover top career opportunities across industries. Find the latest vacancies and apply today.`;
      keywords = [
        "Jobs in Kenya",
        "Kenya job vacancies",
        "Career opportunities in Kenya",
        "Latest job openings",
        "Kenya top employers",
        "New job listings in Kenya",
        "Employment opportunities in Kenya",
      ];
      break;
  }

  return {
    title: {
      absolute: title
    },
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: {
        absolute: title
      },
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogCompaniesDetails,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: `/home/jobs/in/${slug}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: {
        absolute: title
      },
      description,
      images: [
        {
          url: siteConfig.ogCompaniesDetails,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}


const Page = async ({ params }: PopularProps) => {
  const { slug } = params;
  const trueSlugName = convertFromSlug(slug);
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
  const jobs = await getPopularSearchesJobs(slug);

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
            <p className="flex items-center justify-center">
              <Loader2 className="shrink-0 animate-spin h-7 w-7 text-gray-600" />
            </p>
          }
        >
          <HomeCompaniesNavBar
            jobs={jobs}
            viewID={viewID as string}
            slug={trueSlugName}
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
