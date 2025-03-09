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
  numberOfOccurrence: number;
  latestUpdatedAt: Date;
};

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/companies");

  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/companies");

  const dbUser = await db.user.findFirst({
    where: { id: userId, email },
    select: { id: true },
  });
  if (!dbUser) redirect("/home/login?origin=control/companies");

  const [registeredCompanies, allUnregisteredCompaniesRaw] = await Promise.all([
    db.company.findMany({
      select: { company_name: true, logo: true, updatedAt: true },
    }),
    db.unregisteredCompany.findMany({
      select: { companyName: true, logo: true, updatedAt: true },
    }),
  ]);
  
  const allUnregisteredCompanies = allUnregisteredCompaniesRaw.filter(
    (company) => company.companyName !== null
  );

  const uniqueCompaniesMap = new Map<
    string,
    { company_name: string; companyLogo: string | null; latestUpdatedAt: Date }
  >();

  registeredCompanies.forEach((company) => {
    const normalizedCompanyName = (company.company_name || "Unknown Company").toLowerCase();

    uniqueCompaniesMap.set(normalizedCompanyName, {
      company_name: company.company_name || "Unknown Company",
      companyLogo: company.logo,
      latestUpdatedAt: company.updatedAt,
    });
  });

  allUnregisteredCompanies.forEach((company) => {
    const normalizedCompanyName = (company.companyName || "Unknown Company").toLowerCase();

    if (!uniqueCompaniesMap.has(normalizedCompanyName)) {
      uniqueCompaniesMap.set(normalizedCompanyName, {
        company_name: company.companyName || "Unknown Company",
        companyLogo: company.logo,
        latestUpdatedAt: company.updatedAt,
      });
    }
  });

  const uniqueCompanies = Array.from(uniqueCompaniesMap.values());

  const jobs = await db.job.findMany({
    where: {
      company_name: { in: uniqueCompanies.map((c) => c.company_name) },
    },
    select: { company_name: true, updatedAt: true, companyLogo: true },
  });

  const companyJobs = jobs.reduce<Record<string, CompanyJob>>((acc, job) => {
    const normalizedCompanyName = job.company_name.toLowerCase();

    if (acc[normalizedCompanyName]) {
      if (new Date(job.updatedAt) > new Date(acc[normalizedCompanyName].latestUpdatedAt)) {
        acc[normalizedCompanyName].latestUpdatedAt = job.updatedAt;
        acc[normalizedCompanyName].companyLogo = job.companyLogo;
      }
      acc[normalizedCompanyName].numberOfOccurrence += 1;
    } else {
      acc[normalizedCompanyName] = {
        company_name: job.company_name,
        companyLogo: job.companyLogo,
        latestUpdatedAt: job.updatedAt,
        numberOfOccurrence: 1,
      };
    }

    return acc;
  }, {});

  const companies: CompanyJob[] = uniqueCompanies.map((company) => {
    const normalizedCompanyName = company.company_name.trim().toLowerCase();
  
    const matchingJobs = jobs.filter(
      (job) => job.company_name.trim().toLowerCase() === normalizedCompanyName
    );
  
    const numberOfOccurrence = matchingJobs.length;
    const latestUpdatedAt =
      numberOfOccurrence > 0
        ? new Date(Math.max(...matchingJobs.map((job) => new Date(job.updatedAt).getTime())))
        : company.latestUpdatedAt;
  
    const companyLogo = matchingJobs.length > 0 ? matchingJobs[0].companyLogo : company.companyLogo;
  
    return {
      company_name: company.company_name,
      companyLogo,
      latestUpdatedAt,
      numberOfOccurrence,
    };
  });

  return (
    <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 pb-6 md:px-5">
      {companies.length === 0 ? <NoCompanies /> : <AllCompanies companies={companies} />}
    </div>
  );
};

export default Page;