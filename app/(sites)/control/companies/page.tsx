import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
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

  const uniqueCompaniesMap = new Map<string, CompanyJob>();

  registeredCompanies.forEach((company) => {
    const companyName = company.company_name?.trim() || "Unknown Company";
    const normalizedCompanyName = companyName.toLowerCase();

    uniqueCompaniesMap.set(normalizedCompanyName, {
      company_name: companyName,
      companyLogo: company.logo,
      latestUpdatedAt: company.updatedAt,
      numberOfOccurrence: 0,
    });
  });

  allUnregisteredCompanies.forEach((company) => {
    const normalizedCompanyName = company.companyName.trim().toLowerCase();

    if (!uniqueCompaniesMap.has(normalizedCompanyName)) {
      uniqueCompaniesMap.set(normalizedCompanyName, {
        company_name: company.companyName,
        companyLogo: company.logo,
        latestUpdatedAt: company.updatedAt,
        numberOfOccurrence: 0,
      });
    }
  });

  const uniqueCompanies = Array.from(uniqueCompaniesMap.values());

  const jobs = await db.job.findMany({
    where: {
      company_name: { in: uniqueCompanies.map((c) => c.company_name) },
    },
    select: { company_name: true, updatedAt: true },
  });

  uniqueCompanies.forEach((company) => {
    const normalizedCompanyName = company.company_name.trim().toLowerCase();
    const matchingJobs = jobs.filter(
      (job) => job.company_name.trim().toLowerCase() === normalizedCompanyName
    );

    company.numberOfOccurrence = matchingJobs.length;
    if (matchingJobs.length > 0) {
      company.latestUpdatedAt = new Date(
        Math.max(
          ...matchingJobs.map((job) => new Date(job.updatedAt).getTime())
        )
      );
    }
  });

  return (
    <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 pb-6 md:px-5">
      <AllCompanies companies={uniqueCompanies} />
    </div>
  );
};

export default Page;
