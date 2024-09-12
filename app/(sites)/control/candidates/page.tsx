import { db } from "@/db";
import React from "react";
import AllCandidates from "../_components/candidates/AllCandidates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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
  if (!session) redirect("/home/login?origin=control/candidates");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/candidates");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
  if (!dbUser) redirect("/home/login?origin=control/candidates");
  const workersBio = await db.workerBio.findMany();
  const bioUserIDS = workersBio.flatMap((user) => user.userId);
  const usersWithBio = await db.user.findMany({
    where: {
      id: {
        in: bioUserIDS,
      },
    },
  });
  const workersAbout = await db.about.findMany();
  const workersDesire = await db.workerDesires.findMany();
  const workersContact = await db.workerContact.findMany();
  const workersSkills = await db.skills.findMany();
  const workersCertification = await db.certificationLicense.findMany();
  const workersAward = await db.award.findMany();
  const workersLanguage = await db.language.findMany();
  const workersExperience = await db.experience.findMany();
  const workersSecondary = await db.secondaryEducation.findMany();
  const workersTertiary = await db.tertiaryEducation.findMany();

  //ensure that user has both workersBio, workersAbout, workersDesire, workersContact, workersExperience, if non return null meaning they will not appear

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

  const allWorkers = await db.user.findMany({
    where: {
      role: {
        equals: "worker",
      },
    },
  });

  const applications= await db.application.findMany()
  return (
    <>
      <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 md:px-5">
        <AllCandidates
          workersBio={workersBio}
          workersAbout={workersAbout}
          workersDesire={workersDesire}
          workersContact={workersContact}
          workersSkills={workersSkills}
          workersCertification={workersCertification}
          workersAward={workersAward}
          workersLanguage={workersLanguage}
          workersExperience={workersExperience}
          workersSecondary={workersSecondary}
          workersTertiary={workersTertiary}
          userId={dbUser.id}
        />
      </div>
    </>
  );
};

export default Page;
