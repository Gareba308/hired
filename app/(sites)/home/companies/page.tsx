import Footer from "@/components/Footer";
import React from "react";
import TopCompanies from "../_components/companies/TopCompanies";
import { db } from "@/db";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { Job } from "@prisma/client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

type CompanyJob = {
  company_name: string;
  companyLogo: string | null;
  numberOfOccurrence: number;
};

export const revalidate = 60;
const getJobs = async () => {
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

  return jobs
};

const currentYear = new Date().getFullYear();
export const metadata: Metadata = {
  title: {
    absolute: `Top Companies Hiring Now in Kenya | Latest Job Openings ${currentYear}`,
  },
  description:
    "Explore top employers hiring in Kenya with the latest job openings. Find career opportunities in leading companies actively recruiting talent for 2024.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: {
      absolute: `Top Companies Hiring Now in Kenya | Latest Job Openings ${currentYear}`,
    },
    description:
      "Explore top employers hiring in Kenya with the latest job openings. Find career opportunities in leading companies actively recruiting talent for 2024.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogCompanies,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  keywords: [
    "Top companies hiring in Kenya",
    "Latest job vacancies in Kenya",
    "Leading employers in Kenya",
    `Jobs in Kenya ${currentYear}`,
    "Active hiring companies in Kenya",
    "Company career opportunities",
    "Job openings with top companies",
    "Kenyan job market updates",
    "Employers recruiting in Kenya",
    "Corporate job listings in Kenya",
    "Find jobs by company in Kenya",
    "Best Kenyan companies to work for",
  ],
  alternates: {
    canonical: "/home/companies",
    languages: {
      "en-US": "/en-US",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: {
      absolute: `Top Companies Hiring Now in Kenya | Latest Job Openings ${currentYear}`,
    },
    description:
      "Explore top employers hiring in Kenya with the latest job openings. Find career opportunities in leading companies actively recruiting talent for 2024.",
    images: [
      {
        url: siteConfig.ogCompanies,
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
  const jobs=  await getJobs()

  const companyJobs = jobs.reduce<Record<string, CompanyJob>>(
    (acc, job: Job) => {
      const normalizedCompanyName = job.company_name.toLowerCase();

      if (acc[normalizedCompanyName]) {
        acc[normalizedCompanyName].numberOfOccurrence += 1;
      } else {
        acc[normalizedCompanyName] = {
          company_name: job.company_name,
          companyLogo: job.companyLogo,
          numberOfOccurrence: 1,
        };
      }

      return acc;
    },
    {}
  );

  const result: CompanyJob[] = Object.values(companyJobs);
  return (
    <>
      <div className="px-4 md:px-8 pb-6 pt-4 sm:pt-6 min-h-[calc(100vh-70px)] max-w-screen-xl mx-auto text-sm sm:text-[15px] text-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-4">
          Top Employer Companies
        </h1>
        <Suspense
          fallback={
            <p className="flex items-center justify-center">
              <Loader2 className="shrink-0 animate-spin h-7 w-7 text-gray-600" />
            </p>
          }
        >
          <TopCompanies companies={result} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default Page;
