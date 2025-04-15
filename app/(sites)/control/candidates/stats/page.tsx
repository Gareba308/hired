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
import { CandidatesStats } from "../../_components/candidates/CandidatesStats";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/candidates/stats");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/candidates/stats");
  const currentDate = new Date();
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/candidates/stats");

  const totalWorkers = await db.user.findMany({
    where: {
      role: {
        equals: "worker",
      }
    },
    select: {
      id: true,
    },
  });

  const allWorkers = await db.user.findMany({
    where: {
      role: {
        equals: "worker",
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
 
  const applications = await db.application.findMany();

  const applicationCounts = new Map<string, number>();

  allWorkers.forEach((worker) => {
    applicationCounts.set(worker.id, 0);
  });

  applications.forEach((application) => {
    const count = applicationCounts.get(application.userId) || 0;
    applicationCounts.set(application.userId, count + 1);
  });

  const combinedData = allWorkers.map((worker) => ({
    ...worker,
    applicationCount: applicationCounts.get(worker.id) || 0,
  }));

  // To find percentage improvement in Workers per month
  async function countWorkersInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const workers = await db.user.findMany({
      where: {
        role: {
          equals: "worker",
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return workers.length;
  }
  async function getWorkerCountAndPercentage(): Promise<{
    countWorkers: number;
    percentageWorkers: string;
  }> {
    const currentDate = new Date();
    const currentMonthCount = await countWorkersInMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countWorkersInMonth(previousMonth);

    let percentageWorkers;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentageWorkers = isFinite(percentageImprovement)
        ? `${Math.round(percentageImprovement * 10) / 10}%`
        : "∞";
    } else if (currentMonthCount !== 0) {
      percentageWorkers = "∞";
    } else {
      percentageWorkers = "0%";
    }

    return {
      countWorkers: currentMonthCount,
      percentageWorkers: percentageWorkers,
    };
  }

  const { countWorkers, percentageWorkers } =
    await getWorkerCountAndPercentage();

  // Finding percentage Worker referred in a month
  async function countSuccessfulWorkersInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successWorkers = await db.user.findMany({
      where: {
        role: {
          equals: "worker",
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
    return successWorkers.length;
  }

  async function getSuccessfulWorkerCountAndPercentage(): Promise<{
    countWorkerSuccess: number;
    percentageWorkerSuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulWorkersInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulWorkersInMonth(
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
      countWorkerSuccess: currentMonthSuccessCount,
      percentageWorkerSuccess: percentageSuccess,
    };
  }

  const { countWorkerSuccess, percentageWorkerSuccess } =
    await getSuccessfulWorkerCountAndPercentage();

  //Week Workers
  async function countWeekWorkersInWeek(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekWorkers = await db.user.findMany({
      where: {
        role: {
          equals: "worker",
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return weekWorkers.length;
  }

  async function getWeekWorkerCountAndPercentage(): Promise<{
    countWorkerWeek: number;
    percentageWorkerWeek: string;
  }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekWorkersInWeek(startDate, endDate);

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekWorkersInWeek(
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
      countWorkerWeek: currentWeekCount,
      percentageWorkerWeek: percentageWeek,
    };
  }

  const { countWorkerWeek, percentageWorkerWeek } =
    await getWeekWorkerCountAndPercentage();

  //Day Workers
  async function countPendingWorkers(date: Date = new Date()): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const activeWorkers = await db.user.findMany({
      where: {
        role: {
          equals: "worker",
        },
        createdAt: {
          gte: startOfDate,
          lt: endOfDate,
        },
      },
    });
    return activeWorkers.length;
  }

  async function getPendingWorkerCountAndPercentage(): Promise<{
    countWorkerPending: number;
    percentageWorkerPending: string;
  }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingWorkers(currentDate);
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingWorkers(previousDay);

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
      countWorkerPending: currentPendingCount,
      percentageWorkerPending: percentagePending,
    };
  }
  const { countWorkerPending, percentageWorkerPending } =
    await getPendingWorkerCountAndPercentage();

  return (
    <div className="h-full min-h-[calc(100vh-95px)] sm:rounded-md bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto overflow-hidden">
      <CandidatesStats
        totalWorkers={totalWorkers}
        combinedData={combinedData}
        countWorkers={countWorkers}
        percentageWorkers={percentageWorkers}
        countWorkerSuccess={countWorkerSuccess}
        percentageWorkerSuccess={percentageWorkerSuccess}
        countWorkerWeek={countWorkerWeek}
        percentageWorkerWeek={percentageWorkerWeek}
        countWorkerPending={countWorkerPending}
        percentageWorkerPending={percentageWorkerPending}
      />
    </div>
  );
};

export default Page;
