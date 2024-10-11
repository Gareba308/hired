import React from "react";
import { Suspense } from "react";
import { db } from "@/db";
import { headers } from "next/headers";
import { Job } from "@prisma/client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import FooterJobs from "@/components/FooterJobs";
import { Loader2 } from "lucide-react";
import HomeJobsNavBar from "../../../_components/subcategory/HomeJobsNavBar";

interface SubcategoryProps {
  params: {
    slug: string;
  };
}
const currentYear = new Date().getFullYear();
const convertFromSlug = (slug: string): string => {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, (char) => encodeURIComponent(char))
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
};
const getSubcategoryJobs = async (slug: string) => {
  const currentDate = new Date();
  const subcategory = convertFromSlug(slug);
  const jobs = await db.job.findMany({
    where: {
        subCategory: {
            equals: subcategory,
            mode: "insensitive",
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs;
};

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
    select: {
      subCategory: true,
    },
  });
  
  const uniqueCompanies = new Set<string>();
  
  jobs.forEach((job) => {
    if (job?.subCategory) {
      uniqueCompanies.add(job.subCategory);
    }
  });

  return Array.from(uniqueCompanies).map((subcategory) => ({
    slug: slugify(subcategory),
  }));
}


export async function generateMetadata({
  params,
}: SubcategoryProps): Promise<Metadata> {
  const capitalize = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const { slug } = params;
  const trueSubcategory = capitalize(convertFromSlug(slug));
  const jobSubcategories = await getSubcategoryJobs(slug);
  if (jobSubcategories.length === 0) {
    return {
      title: "There are no jobs by this subcategory",
      description:
        "We did not find existing job opportunities by this subcategory. Check back later",
    };
  }

  return {
    title: {
      absolute: `${trueSubcategory}: Discover Verified Job Vacancies & Career Opportunities`,
    },
    description: `Find the latest verified ${trueSubcategory} job vacancies. Explore career opportunities, openings, and jobs in Kenya. Find leading employers hiring now.`,
    keywords: [
      `${trueSubcategory}`,
      `${trueSubcategory} job vacancies`,
      `${trueSubcategory} hiring now`,
      `${trueSubcategory} career opportunities`,
      "Top employers in Kenya",
      `Latest jobs in Kenya ${currentYear}`,
      `Job openings in Kenya`,
      "Best companies to work for in Kenya",
      "Kenyan companies hiring",
      `Career growth in ${trueSubcategory}`,
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: {
        absolute: `${trueSubcategory}: Discover Verified Job Vacancies & Career Opportunities`,
      },
      description: `Find the latest verified ${trueSubcategory} job vacancies. Explore career opportunities, openings, and jobs in Kenya. Find leading employers hiring now.`,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogSubcategory,
          width: 1200,
          height: 630,
          alt: `${trueSubcategory}`,
        },
      ],
    },
    alternates: {
      canonical: `/home/jobs/subcategory/${slug}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: {
        absolute: `${trueSubcategory}: Discover Verified Job Vacancies & Career Opportunities`,
      },
      description: `Find the latest verified ${trueSubcategory} job vacancies. Explore career opportunities, openings, and jobs in Kenya. Find leading employers hiring now.`,
      images: [
        {
          url: siteConfig.ogSubcategory,
          width: 1200,
          height: 630,
          alt: `${trueSubcategory}`,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}

const Page = async ({ params }: SubcategoryProps) => {
  const { slug } = params;
  const subcategory = convertFromSlug(slug);
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
  const jobs = await getSubcategoryJobs(slug)

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
          <HomeJobsNavBar
            jobs={jobs}
            viewID={viewID as string}
            subcategory={subcategory}
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
