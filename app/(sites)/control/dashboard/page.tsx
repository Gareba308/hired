import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import DashboardPage from "../_components/userDashboard/DashboardData";
import { AllJobsApplications } from "../_components/applications/AllJobsApplications";
import { ApplicationStatus } from "@prisma/client";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.id;
  const email = session?.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/dashboard");
  const currentDate = new Date();
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });
  if (!dbUser) redirect("/home/login?origin=control/dashboard");

  const isAdmin = await db.admin.findFirst({
    where: {
      adminEmail: email,
    },
    select: {
      id: true,
    },
  });

  if (!isAdmin) redirect("/home/login?origin=control/dashboard");

  async function countApplicationsInCurrentMonth(): Promise<number> {
    const currentDate = new Date();
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    const applications = await db.application.findMany({
      where: {
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true,
      },
    });
    return applications.length;
  }
  const myCurrentMonthApplications = await countApplicationsInCurrentMonth();

  // To find percentage improvement in application per month
  async function countApplicationsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const applications = await db.application.findMany({
      where: {
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true,
      },
    });
    return applications.length;
  }
  async function getApplicationCountAndPercentage(): Promise<{
    countApplications: number;
    percentageApplications: string;
  }> {
    const currentDate = new Date();
    const currentMonthCount = await countApplicationsInMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countApplicationsInMonth(previousMonth);

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
    await getApplicationCountAndPercentage();

  // Finding percentage Successful
  async function countSuccessfulApplicationsInMonth(
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successApplications = await db.application.findMany({
      where: {
        status: {
          in: ["OFFERED"],
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true,
      },
    });
    return successApplications.length;
  }

  async function getSuccessfulApplicationCountAndPercentage(): Promise<{
    countSuccess: number;
    percentageSuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulApplicationsInMonth(
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
    await getSuccessfulApplicationCountAndPercentage();

  //Week applications
  async function countWeekApplicationsInWeek(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekApplications = await db.application.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
      },
    });
    return weekApplications.length;
  }

  async function getWeekApplicationCountAndPercentage(): Promise<{
    countWeek: number;
    percentageWeek: string;
  }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekApplicationsInWeek(
      startDate,
      endDate
    );

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekApplicationsInWeek(
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
    await getWeekApplicationCountAndPercentage();

  //Day applications
  async function countPendingApplications(
    date: Date = new Date()
  ): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const queryFilters: {
      status: ApplicationStatus;
      createdAt: {
        gte: Date;
        lt: Date;
      };
    } = {
      status: "PENDING",
      createdAt: {
        gte: startOfDate,
        lt: endOfDate,
      },
    };

    const activeApplications = await db.application.findMany({
      where: queryFilters,
      select: {
        id: true,
      },
    });
    return activeApplications.length;
  }

  async function getPendingApplicationCountAndPercentage(): Promise<{
    countPending: number;
    percentagePending: string;
  }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingApplications(currentDate);
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingApplications(previousDay);

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
    await getPendingApplicationCountAndPercentage();

  // Data for lineChart

  const myPendingApplication = await db.application.findMany({
    where: {
      status: {
        in: ["PENDING"],
      },
    },
    select: {
      id: true,
    },
  });
  const pendingLength = myPendingApplication.length;

  const myApplication = await db.application.findMany({
    select: {
      createdAt: true,
      id: true,
      status: true
    }
  });

  const myJobs = await db.job.findMany({
    where: {
      archived: {
        equals: false,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      createdAt: true,
      job_id: true,
      job_title: true,
      ownPlatformMethod: true,
      applied: true,
      deadline: true,
    },
  });

  const allJobs = await db.job.findMany({
    where: {
      createdAt: {
        gte: new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      id: true,
      createdAt: true,
      ownPlatformMethod: true,
    },
  });

  const allUnexpiredJobs = await db.job.findMany({
    where: {
      archived: {
        equals: false,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const myUnexpiredJobs = allUnexpiredJobs.length;

  const totalActiveApplications = await db.application.findMany({
    where: {
      status: {
        in: ["PENDING", "REVIEWING", "INTERVIEW"],
      },
    },
    select: {
      id: true,
    },
  });

  const totalSuccessfulApplications = await db.application.findMany({
    where: {
      status: {
        in: ["OFFERED"],
      },
    },
    select: {
      id: true,
    },
  });

  const totalUnsuccessfulApplications = await db.application.findMany({
    where: {
      status: {
        in: ["DECLINED"],
      },
    },
    select: {
      id: true,
    },
  });

  // To find percentage improvement in jobs per month
  async function countJobsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const jobs = await db.job.findMany({
      where: {
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true,
      },
    });
    return jobs.length;
  }
  async function getJobCountAndPercentage(): Promise<{
    countJobs: number;
    percentageJobs: string;
  }> {
    const currentDate = new Date();
    const currentMonthCount = await countJobsInMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countJobsInMonth(previousMonth);

    let percentageJobs;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentageJobs = isFinite(percentageImprovement)
        ? `${Math.round(percentageImprovement * 10) / 10}%`
        : "∞";
    } else if (currentMonthCount !== 0) {
      percentageJobs = "∞";
    } else {
      percentageJobs = "0%";
    }

    return {
      countJobs: currentMonthCount,
      percentageJobs: percentageJobs,
    };
  }

  const { countJobs, percentageJobs } = await getJobCountAndPercentage();

  // Finding percentage apply here in a month
  async function countSuccessfulJobsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successJobs = await db.job.findMany({
      where: {
        ownPlatformMethod: {
          equals: "here",
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true,
      },
    });
    return successJobs.length;
  }

  async function getSuccessfulJobCountAndPercentage(): Promise<{
    countJobSuccess: number;
    percentageJobSuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulJobsInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulJobsInMonth(
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
      countJobSuccess: currentMonthSuccessCount,
      percentageJobSuccess: percentageSuccess,
    };
  }

  const { countJobSuccess, percentageJobSuccess } =
    await getSuccessfulJobCountAndPercentage();

  // Finding percentage apply outside in a month
  async function countUnsuccessfulJobsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const unsuccessJobs = await db.job.findMany({
      where: {
        ownPlatformMethod: {
          equals: "own",
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true,
      },
    });
    return unsuccessJobs.length;
  }

  async function getUnsuccessfulJobCountAndPercentage(): Promise<{
    countJobUnsuccess: number;
    percentageJobUnsuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthUnsuccessCount = await countUnsuccessfulJobsInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthUnsuccessCount = await countUnsuccessfulJobsInMonth(
      previousMonth
    );

    let percentageUnsuccess;
    if (previousMonthUnsuccessCount !== 0) {
      const percentageChange =
        ((currentMonthUnsuccessCount - previousMonthUnsuccessCount) /
          previousMonthUnsuccessCount) *
        100;
      percentageUnsuccess = isFinite(percentageChange)
        ? `${Math.round(percentageChange * 10) / 10}%`
        : "∞";
    } else if (currentMonthUnsuccessCount !== 0) {
      percentageUnsuccess = "∞";
    } else {
      percentageUnsuccess = "0%";
    }

    return {
      countJobUnsuccess: currentMonthUnsuccessCount,
      percentageJobUnsuccess: percentageUnsuccess,
    };
  }

  const { countJobUnsuccess, percentageJobUnsuccess } =
    await getUnsuccessfulJobCountAndPercentage();

  //Week applications
  async function countWeekJobsInWeek(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekJobs = await db.job.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
      },
    });
    return weekJobs.length;
  }

  async function getWeekJobCountAndPercentage(): Promise<{
    countJobWeek: number;
    percentageJobWeek: string;
  }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekJobsInWeek(startDate, endDate);

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekJobsInWeek(
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
      countJobWeek: currentWeekCount,
      percentageJobWeek: percentageWeek,
    };
  }

  const { countJobWeek, percentageJobWeek } =
    await getWeekJobCountAndPercentage();

  //Day jobs
  async function countPendingJobs(date: Date = new Date()): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const activeJobs = await db.job.findMany({
      where: {
        createdAt: {
          gte: startOfDate,
          lt: endOfDate,
        },
      },
      select: {
        id: true,
      },
    });
    return activeJobs.length;
  }

  async function getPendingJobCountAndPercentage(): Promise<{
    countJobPending: number;
    percentageJobPending: string;
  }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingJobs(currentDate);
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingJobs(previousDay);

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
      countJobPending: currentPendingCount,
      percentageJobPending: percentagePending,
    };
  }
  const { countJobPending, percentageJobPending } =
    await getPendingJobCountAndPercentage();

  return (
    <div className="space-y-6 pt-2  pb-5 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-3 md:px-4 text-gray-800 sm:shadow-sm sm:rounded-lg">
      <DashboardPage
        thisMonthApplications={myCurrentMonthApplications}
        totalApplications={myApplication.length}
        thisMonthCount={countApplications}
        thisMonthImprovement={percentageApplications}
        countSuccess={countSuccess}
        percentageSuccess={percentageSuccess}
        currentActive={totalActiveApplications.length}
        currentSuccessful={totalSuccessfulApplications.length}
        currentUnsuccessful={totalUnsuccessfulApplications.length}
        applications={myApplication}
        percentageWeek={percentageWeek}
        countWeek={countWeek}
        countPending={countPending}
        percentagePending={percentagePending}
        pendingLength={pendingLength}
      />
      <AllJobsApplications
        myJobs={myJobs}
        myUnexpiredJobs={myUnexpiredJobs}
        countJobs={countJobs}
        percentageJobs={percentageJobs}
        countJobSuccess={countJobSuccess}
        percentageJobSuccess={percentageJobSuccess}
        countJobUnsuccess={countJobUnsuccess}
        percentageJobUnsuccess={percentageJobUnsuccess}
        countJobWeek={countJobWeek}
        percentageJobWeek={percentageJobWeek}
        countJobPending={countJobPending}
        percentageJobPending={percentageJobPending}
        jobs={allJobs}
      />
    </div>
  );
};

export default Page;
