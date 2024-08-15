import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AllApplications } from "../../../_components/applications/AllApplications";
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { ApplicationStatus } from "@prisma/client";

interface JobApplicationIDProps {
  params: {
    jobID: string;
  };
}

export async function generateStaticParams() {
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

  return jobs.map((job) => job.id);
}

const Page = async ({ params }: JobApplicationIDProps) => {
  const { jobID:jobId } = params;
  const jobExists = await db.job.findFirst({
    where: {
      id: jobId,
    },
    select: {
      job_title: true,
    },
  });
  const jobTitle = jobExists?.job_title;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login/enterprises?origin=manage/dashboard/jobs/${jobId}`);
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email)
    redirect(`/home/login/enterprises?origin=manage/dashboard/jobs/${jobId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });
  if (!dbUser) redirect(`/home/login/enterprises?origin=manage/dashboard/jobs/${jobId}`);
  const isEmployer = await db.employers.findFirst({
    where: {
      employerEmail: email,
    },
    select: {
      id: true,
    },
  });
  if (!isEmployer)
    redirect(`/home/login/enterprises?origin=manage/dashboard/jobs/${jobId}`);

  const { id: isEmployerID } = isEmployer;

  const companyExists = await db.company.findFirst({
    where: {
      userId,
      isEmployerID,
    },
    select: {
      id: true,
    },
  });

  if (!companyExists)
    redirect(`/home/login/enterprises?origin=manage/dashboard/jobs/${jobId}`);
  const { id: companyId } = companyExists;
  const myApplication = await db.application.findMany({
    where: {
      jobId: jobId,
      isEmployerID,
      companyId,
      hide: {
        equals: false,
      },
    },
  });

  // To find percentage improvement in application per month
  async function countApplicationsInMonth(
    companyId: string,
    jobId: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const applications = await db.application.findMany({
      where: {
        companyId: companyId,
        jobId: jobId,
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return applications.length;
  }
  async function getApplicationCountAndPercentage(
    companyId: string,
    jobId: string,
  ): Promise<{ countApplications: number; percentageApplications: string }> {
    const currentDate = new Date();
    const currentMonthCount = await countApplicationsInMonth(
      companyId,
      jobId,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countApplicationsInMonth(
      companyId,
      jobId,
      previousMonth
    );

    let percentageApplications;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentageApplications = isFinite(percentageImprovement)
        ? `${Math.round(percentageImprovement * 10) / 10}%`
        : "∞";
    } else if (currentMonthCount !== 0) {
      percentageApplications = "∞";
    } else {
      percentageApplications = "0%";
    }

    return {
      countApplications: currentMonthCount,
      percentageApplications: percentageApplications,
    };
  }

  const { countApplications, percentageApplications } =
    await getApplicationCountAndPercentage(companyId, jobId);

  // Finding percentage Successful
  async function countSuccessfulApplicationsInMonth(
    companyId: string,
    jobId: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successApplications = await db.application.findMany({
      where: {
        companyId: companyId,
        jobId,
        status: {
          in: ["OFFERED"],
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return successApplications.length;
  }

  async function getSuccessfulApplicationCountAndPercentage(
    companyId: string,
    jobId: string,
  ): Promise<{ countSuccess: number; percentageSuccess: string }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      companyId,
      jobId,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      companyId,
      jobId,
      previousMonth
    );

    let percentageSuccess;
    if (previousMonthSuccessCount !== 0) {
      const percentageChange =
        ((currentMonthSuccessCount - previousMonthSuccessCount) /
          previousMonthSuccessCount) *
        100;
      percentageSuccess = isFinite(percentageChange)
        ? `${Math.round(percentageChange * 10) / 10}%`
        : "∞";
    } else if (currentMonthSuccessCount !== 0) {
      percentageSuccess = "∞";
    } else {
      percentageSuccess = "0%";
    }

    return {
      countSuccess: currentMonthSuccessCount,
      percentageSuccess: percentageSuccess,
    };
  }

  const { countSuccess, percentageSuccess } =
    await getSuccessfulApplicationCountAndPercentage(companyId, jobId);

  //Week applications
  async function countWeekApplicationsInWeek(
    companyId: string,
    jobId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekApplications = await db.application.findMany({
      where: {
        companyId: companyId,
        jobId,
        isEmployerID,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return weekApplications.length;
  }

  async function getWeekApplicationCountAndPercentage(
    companyId: string,
    jobId: string,
  ): Promise<{ countWeek: number; percentageWeek: string }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekApplicationsInWeek(
      companyId,
      jobId,
      startDate,
      endDate
    );

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekApplicationsInWeek(
      companyId,
      jobId,
      previousWeekStartDate,
      previousWeekEndDate
    );

    let percentageWeek;
    if (previousWeekCount !== 0) {
      const percentageChange =
        ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100;
      percentageWeek = isFinite(percentageChange)
        ? `${Math.round(percentageChange * 10) / 10}%`
        : "∞";
    } else if (currentWeekCount !== 0) {
      percentageWeek = "∞";
    } else {
      percentageWeek = "0%";
    }

    return {
      countWeek: currentWeekCount,
      percentageWeek: percentageWeek,
    };
  }

  const { countWeek, percentageWeek } =
    await getWeekApplicationCountAndPercentage(companyId, jobId);

  //Day applications
  async function countPendingApplications(
    companyId: string,
    jobId: string,
    date: Date = new Date()
  ): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const queryFilters: {
      companyId: string;
      jobId: string,
      status: ApplicationStatus;
      createdAt: {
        gte: Date;
        lt: Date;
      };
    } = {
      companyId: companyId,
      jobId,
      status: "PENDING",
      createdAt: {
        gte: startOfDate,
        lt: endOfDate,
      },
    };

    const activeApplications = await db.application.findMany({
      where: queryFilters,
    });
    return activeApplications.length;
  }

  async function getPendingApplicationCountAndPercentage(
    companyId: string,
    jobId: string,
  ): Promise<{ countPending: number; percentagePending: string }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingApplications(
      companyId,
      jobId,
      currentDate
    );
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingApplications(
      companyId,
      jobId,
      previousDay
    );

    let percentagePending;
    if (previousDayPendingCount !== 0) {
      const percentageChange =
        ((currentPendingCount - previousDayPendingCount) /
          previousDayPendingCount) *
        100;
      percentagePending = isFinite(percentageChange)
        ? `${Math.round(percentageChange * 10) / 10}%`
        : "∞";
    } else if (currentPendingCount !== 0) {
      percentagePending = "∞";
    } else {
      percentagePending = "0%";
    }

    return {
      countPending: currentPendingCount,
      percentagePending: percentagePending,
    };
  }
  const { countPending, percentagePending } =
    await getPendingApplicationCountAndPercentage(companyId, jobId);
  return (
    <div className="space-y-6 pt-2  pb-5 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-3 md:px-4 text-gray-800 sm:shadow-sm sm:rounded-lg">
      <AllApplications
        myApplication={myApplication}
        jobTitle={(jobTitle as string) || null}
        thisMonthCount={countApplications}
        thisMonthImprovement={percentageApplications}
        countSuccess={countSuccess}
        percentageSuccess={percentageSuccess}
        percentageWeek={percentageWeek}
        countWeek={countWeek}
        countPending={countPending}
        percentagePending={percentagePending}
      />
    </div>
  );
};

export default Page;