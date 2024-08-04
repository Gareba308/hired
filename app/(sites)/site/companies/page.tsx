import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Job } from "@prisma/client";
import NoCompanies from "../_components/company/NoCompany";
import AllCompanies from "../_components/company/AllCompanies";

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

  const allCompanies = await db.company.findMany();

  const allTopEmployersWithVacancies = await Promise.all(
    allCompanies.map(async (company) => {
      let vacanciesCount = 0;
      let individualJobs: Job[] = [];
      let openings = 0;
      if (company.id) {
        const companyJobs = await db.job.findMany({
          where: {
            companyId: company.id,
            deadline: {
              gte: currentDate,
            },
            createdAt: {
              gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        });

        vacanciesCount = companyJobs.length;
        individualJobs = companyJobs;
        openings = companyJobs.reduce((total, job) => {
          const numPositions = job.numberOfPositions
            ? parseInt(job.numberOfPositions, 10)
            : 0;
          return total + (isNaN(numPositions) ? 0 : numPositions);
        }, 0);
      }

      return {
        companyDetails: company,
        vacanciesCount,
        individualJobs,
        openings,
      };
    })
  );

  return (
    <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 md:px-5">
      {allCompanies.length === 0 ? (
        <NoCompanies />
      ) : (
        <AllCompanies
          companies={allCompanies}
          userId={dbUser.id}
          companyCounts={allTopEmployersWithVacancies as []}
        />
      )}
    </div>
  );
};

export default Page;
