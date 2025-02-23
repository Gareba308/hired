import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import NoCompanies from "../_components/companies/NoCompanies";
import AllCompanies from "../_components/companies/AllCompanies";

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
interface AllJobs {
  company_name: string;
  updatedAt: Date;
  company_description: string | null;
  companyLogo: string | null;
  companyCategory: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
}

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/companies");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/companies");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
    select: {
      id: true,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/companies");

  const jobs = await db.job.findMany({
    select: {
      company_name: true,
      updatedAt: true,
      company_description: true,
      companyLogo: true,
      companyCategory: true,
      companyEmail: true,
      companyWebsite: true,
    },
  });

  const companyJobs = jobs.reduce<Record<string, CompanyJob>>(
    (acc, job: AllJobs) => {
      const normalizedCompanyName = job.company_name.toLowerCase();

      if (acc[normalizedCompanyName]) {
        if (
          new Date(job.updatedAt) >
          new Date(acc[normalizedCompanyName].latestUpdatedAt)
        ) {
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
    },
    {}
  );

  const companies: CompanyJob[] = Object.values(companyJobs);

  return (
    <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 pb-6 md:px-5">
      {companies.length === 0 ? (
        <NoCompanies />
      ) : (
        <AllCompanies companies={companies} />
      )}
    </div>
  );
};

export default Page;
