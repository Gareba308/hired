import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Job } from "@prisma/client";
import NoCompanies from "../_components/company/NoCompany";
import AllCompanies from "../_components/company/AllCompanies";

type CompanyJob = {
  company_name: string;
  companyLogo: string | null;
  company_description: string | null;
  companyCategory: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  numberOfOccurrence: number;
  latestUpdatedAt: Date;
};

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/companies");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=site/companies");
  const currentDate = new Date();
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
    select: {
      id: true,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/companies");

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
  
  const companyJobs = jobs.reduce<Record<string, CompanyJob>>((acc, job: Job) => {
    const normalizedCompanyName = job.company_name.toLowerCase();
  
    if (acc[normalizedCompanyName]) {

      if (new Date(job.updatedAt) > new Date(acc[normalizedCompanyName].latestUpdatedAt)) {
        acc[normalizedCompanyName] = {
          company_name: job.company_name,
          companyLogo: job.companyLogo,
          company_description: job.company_description,
          companyCategory: job.companyCategory,
          companyEmail: job.companyEmail,
          companyWebsite: job.companyWebsite,
          latestUpdatedAt: job.updatedAt,
          numberOfOccurrence: acc[normalizedCompanyName].numberOfOccurrence,
        };
      }

      acc[normalizedCompanyName].numberOfOccurrence += 1;
    } else {

      acc[normalizedCompanyName] = {
        company_name: job.company_name,
        companyLogo: job.companyLogo,
        company_description: job.company_description,
        companyCategory: job.companyCategory,
        companyEmail: job.companyEmail,
        companyWebsite: job.companyWebsite,
        latestUpdatedAt: job.updatedAt,
        numberOfOccurrence: 1,
      };
    }
  
    return acc;
  }, {});
  
  const companies: CompanyJob[] = Object.values(companyJobs);

  return (
    <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 pb-6 md:px-5">
      {companies.length === 0 ? (
        <NoCompanies />
      ) : (
        <AllCompanies
          companies={companies}
        />
      )}
    </div>
  );
};

export default Page;
