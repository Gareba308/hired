import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import NoCompanies from "../_components/companies/NoCompanies";
import AllCompanies from "../_components/companies/AllCompanies";
import { Job } from "@prisma/client";
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

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/companies");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/companies");
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

  if (!dbUser) redirect("/home/login?origin=control/companies");

  const allCompanies = await db.company.findMany();

  const allTopEmployersWithVacancies = await Promise.all(
    allCompanies.map(async (company) => {
      let vacanciesCount = 0;
      let individualJobs: Job[] = [];
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
      }

      return {
        companyDetails: company,
        vacanciesCount,
        individualJobs,
      };
    })
  );

  //Month Companies Stats
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
    <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 md:px-5">
      {allCompanies.length === 0 ? (
        <NoCompanies />
      ) : (
        <AllCompanies
          companies={allCompanies}
          userId={dbUser.id}
          companyCounts={allTopEmployersWithVacancies as []}
          countEmployers={countEmployers}
          percentageEmployers={percentageEmployers}
          countEmployerSuccess={countEmployerSuccess}
          percentageEmployerSuccess={percentageEmployerSuccess}
          countEmployerWeek={countEmployerWeek}
          percentageEmployerWeek={percentageEmployerWeek}
          countEmployerPending={countEmployerPending}
          percentageEmployerPending={percentageEmployerPending}
        />
      )}
    </div>
  );
};

export default Page;
