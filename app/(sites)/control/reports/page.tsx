import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { ReceivedReports } from "../_components/report/ReceivedReports";
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
import "@/lib/suppressHydration"

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/reports");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/reports");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/reports");

  const getWorkersReports = await db.reportJob.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      userId: true,
      userName: true,
      jobId: true,
      jobName: true,
      companyId: true,
      employerName: true,
      subject: true,
      report: true,
      createdAt: true,
      sorted: true,
      companyEmail: true,
      companyPhone: true,
    },
  });

  // To find percentage improvement in reports per month
  async function countReportsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const reports = await db.reportJob.findMany({
      where: {
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return reports.length;
  }
  async function getReportCountAndPercentage(): Promise<{
    countReports: number;
    percentageReports: string;
  }> {
    const currentDate = new Date();
    const currentMonthCount = await countReportsInMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countReportsInMonth(previousMonth);

    let percentageReports;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentageReports = isFinite(percentageImprovement)
        ? `${Math.round(percentageImprovement * 10) / 10}%`
        : "∞";
    } else if (currentMonthCount !== 0) {
      percentageReports = "∞";
    } else {
      percentageReports = "0%";
    }

    return {
      countReports: currentMonthCount,
      percentageReports: percentageReports,
    };
  }

  const { countReports, percentageReports } =
    await getReportCountAndPercentage();

  // Finding percentage report sorted in a month
  async function countSuccessfulReportsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successReports = await db.reportJob.findMany({
      where: {
        sorted: {
          equals: true,
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return successReports.length;
  }

  async function getSuccessfulReportCountAndPercentage(): Promise<{
    countReportSuccess: number;
    percentageReportSuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulReportsInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulReportsInMonth(
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
      countReportSuccess: currentMonthSuccessCount,
      percentageReportSuccess: percentageSuccess,
    };
  }

  const { countReportSuccess, percentageReportSuccess } =
    await getSuccessfulReportCountAndPercentage();

  //Week reports
  async function countWeekReportsInWeek(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekReports = await db.reportJob.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return weekReports.length;
  }

  async function getWeekReportCountAndPercentage(): Promise<{
    countReportWeek: number;
    percentageReportWeek: string;
  }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekReportsInWeek(startDate, endDate);

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekReportsInWeek(
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
      countReportWeek: currentWeekCount,
      percentageReportWeek: percentageWeek,
    };
  }

  const { countReportWeek, percentageReportWeek } =
    await getWeekReportCountAndPercentage();

  //Day Reports
  async function countPendingReports(date: Date = new Date()): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const activeReports = await db.reportJob.findMany({
      where: {
        createdAt: {
          gte: startOfDate,
          lt: endOfDate,
        },
      },
    });
    return activeReports.length;
  }

  async function getPendingReportCountAndPercentage(): Promise<{
    countReportPending: number;
    percentageReportPending: string;
  }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingReports(currentDate);
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingReports(previousDay);

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
      countReportPending: currentPendingCount,
      percentageReportPending: percentagePending,
    };
  }
  const { countReportPending, percentageReportPending } =
    await getPendingReportCountAndPercentage();
  return (
    <div className="h-full min-h-[calc(100vh-95px)] sm:rounded-md bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto overflow-hidden">
      <ReceivedReports
        combinedData={getWorkersReports}
        countReports={countReports}
        percentageReports={percentageReports}
        countReportSuccess={countReportSuccess}
        percentageReportSuccess={percentageReportSuccess}
        countReportWeek={countReportWeek}
        percentageReportWeek={percentageReportWeek}
        countReportPending={countReportPending}
        percentageReportPending={percentageReportPending}
      />
    </div>
  );
};

export default Page;
