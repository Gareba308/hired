import { db } from "@/db";
import { redirect } from "next/navigation";
import CompanyDetails from "../../_components/companies/CompanyDetails";

interface CompanyDetailsProps {
  params: {
    companyId: string;
  };
}

const Page = async ({ params }: CompanyDetailsProps) => {
  const { companyId } = params;
  const currentDate = new Date();
  const companyExists = await db.company.findFirst({
    where: {
      id: companyId,
    },
  });

  if (!companyExists)
    redirect(`/control/companies?origin=control/companies/${companyId}`);

  const allJobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });
  const employersVacancies: Record<string, number> = {};
  allJobs.forEach((job) => {
    const { companyId, numberOfPositions } = job;
    if (companyId && numberOfPositions) {
      employersVacancies[companyId] =
        (employersVacancies[companyId] || 0) + parseInt(numberOfPositions);
    }
  });
  const employersArray = Object.entries(employersVacancies).map(
    ([companyId, vacanciesCount]) => ({
      companyId,
      vacanciesCount,
    })
  );
  const sortedEmployers = employersArray.sort(
    (a, b) => b.vacanciesCount - a.vacanciesCount
  );

  const topEmployerIDs = sortedEmployers.map((top) => top.companyId);

  const allTopEmployersWithVacancies = await Promise.all(
    topEmployerIDs.map(async (companyId) => {
      const companyDetails = await db.company.findUnique({
        where: {
          id: companyId,
        },
      });
      return {
        companyDetails,
        vacanciesCount: employersVacancies[companyId],
      };
    })
  );

  const allAvailableJobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
      companyId: companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const userSuspended= await db.user.findFirst({
    where: {
      id: companyExists.userId,
      suspended: {
        equals: true
      }
    }
  })
  return (
    <div>
      <CompanyDetails
        company={companyExists}
        companyCounts={allTopEmployersWithVacancies as []}
        allJobs={allAvailableJobs}
        userSuspended={userSuspended}
      />
    </div>
  );
};

export default Page;
