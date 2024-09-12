import React from "react";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CompaniesStats } from "../../_components/companies/CompaniesStats";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/companies/stats");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/companies/stats");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/companies/stats");

  const allEmployers = await db.user.findMany({
    where: {
      role: {
        equals: "employer",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  const jobs = await db.job.findMany();
  
  const companies = await db.company.findMany();
  
  const jobCounts = new Map<string, number>();
  const companyNames = new Map<string, string | undefined>();
  
  allEmployers.forEach(employer => {
    jobCounts.set(employer.id, 0);
  });
  
  jobs.forEach(job => {
    const count = jobCounts.get(job.userId) || 0;
    jobCounts.set(job.userId, count + 1);
  });
  
  companies.forEach(company => {
    companyNames.set(company.userId, company.company_name || "N/A");
  });
  
  const combinedData = allEmployers.map(employer => ({
    ...employer,
    jobCount: jobCounts.get(employer.id) || 0,
    companyName: companyNames.get(employer.id) || "N/A",
  }));

  // To find percentage improvement in employers per month
  async function countEmployersInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const employers = await db.user.findMany({
      where: {
        role: {
          equals: "employer",
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return employers.length;
  }
  async function getEmployerCountAndPercentage(): Promise<{
    countEmployers: number;
    percentageEmployers: string;
  }> {
    const currentDate = new Date();
    const currentMonthCount = await countEmployersInMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countEmployersInMonth(previousMonth);

    let percentageEmployers;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentageEmployers = isFinite(percentageImprovement)
        ? `${Math.round(percentageImprovement * 10) / 10}%`
        : "∞";
    } else if (currentMonthCount !== 0) {
      percentageEmployers = "∞";
    } else {
      percentageEmployers = "0%";
    }

    return {
      countEmployers: currentMonthCount,
      percentageEmployers: percentageEmployers,
    };
  }

  const { countEmployers, percentageEmployers } =
    await getEmployerCountAndPercentage();

  // Finding percentage employer referred in a month
  async function countSuccessfulEmployersInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successEmployers = await db.user.findMany({
      where: {
        role: {
          equals: "employer",
        },
        referred: {
          equals: true,
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return successEmployers.length;
  }

  async function getSuccessfulEmployerCountAndPercentage(): Promise<{
    countEmployerSuccess: number;
    percentageEmployerSuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulEmployersInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulEmployersInMonth(
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
      countEmployerSuccess: currentMonthSuccessCount,
      percentageEmployerSuccess: percentageSuccess,
    };
  }

  const { countEmployerSuccess, percentageEmployerSuccess } =
    await getSuccessfulEmployerCountAndPercentage();

  //Week employers
  async function countWeekEmployersInWeek(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekEmployers = await db.user.findMany({
      where: {
        role: {
          equals: "employer",
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return weekEmployers.length;
  }

  async function getWeekEmployerCountAndPercentage(): Promise<{
    countEmployerWeek: number;
    percentageEmployerWeek: string;
  }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekEmployersInWeek(startDate, endDate);

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekEmployersInWeek(
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
      countEmployerWeek: currentWeekCount,
      percentageEmployerWeek: percentageWeek,
    };
  }

  const { countEmployerWeek, percentageEmployerWeek } =
    await getWeekEmployerCountAndPercentage();

  //Day Employers
  async function countPendingEmployers(
    date: Date = new Date()
  ): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const activeEmployers = await db.user.findMany({
      where: {
        role: {
          equals: "employer",
        },
        createdAt: {
          gte: startOfDate,
          lt: endOfDate,
        },
      },
    });
    return activeEmployers.length;
  }

  async function getPendingEmployerCountAndPercentage(): Promise<{
    countEmployerPending: number;
    percentageEmployerPending: string;
  }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingEmployers(currentDate);
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingEmployers(previousDay);

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
      countEmployerPending: currentPendingCount,
      percentageEmployerPending: percentagePending,
    };
  }
  const { countEmployerPending, percentageEmployerPending } =
    await getPendingEmployerCountAndPercentage();
  return (
    <div className="h-fullmin-h-[calc(100vh-95px)] sm:rounded-md bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto overflow-hidden">
      <CompaniesStats
        combinedData={combinedData}
        countEmployers={countEmployers}
        percentageEmployers={percentageEmployers}
        countEmployerSuccess={countEmployerSuccess}
        percentageEmployerSuccess={percentageEmployerSuccess}
        countEmployerWeek={countEmployerWeek}
        percentageEmployerWeek={percentageEmployerWeek}
        countEmployerPending={countEmployerPending}
        percentageEmployerPending={percentageEmployerPending}
        jobs={jobs}
        companies={companies}
      />
    </div>
  );
};

export default Page;
