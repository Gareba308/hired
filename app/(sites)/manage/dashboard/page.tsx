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
  if (!userId || !email) redirect("/home/login/enterprises?origin=manage/dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });
  if (!dbUser) redirect("/home/login/enterprises?origin=manage/dashboard");

  const isEmployer = await db.employers.findFirst({
    where: {
      employerEmail: email,
    },
    select: {
      id: true,
    },
  });

  if (!isEmployer) redirect("/home/login/enterprises?origin=manage/dashboard");
  const isEmployerID = isEmployer.id;

  const companyDetails = await db.company.findFirst({
    where: {
      userId,
      isEmployerID,
    },
    select: {
      id: true,
    },
  });

  if (!companyDetails) redirect("/home/login/enterprises?origin=manage/dashboard");

  const companyID = companyDetails.id;
  async function countApplicationsInCurrentMonth(
    companyID: string
  ): Promise<number> {
    const currentDate = new Date();
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    const applications = await db.application.findMany({
      where: {
        companyId: companyID,
        isEmployerID,
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true
      }
    });
    return applications.length;
  }
  const myCurrentMonthApplications = await countApplicationsInCurrentMonth(
    companyID
  );
  // To find percentage improvement in application per month
  async function countApplicationsInMonth(
    companyID: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const applications = await db.application.findMany({
      where: {
        companyId: companyID,
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true
      }
    });
    return applications.length;
  }
  async function getApplicationCountAndPercentage(
    companyID: string
  ): Promise<{ countApplications: number; percentageApplications: string }> {
    const currentDate = new Date();
    const currentMonthCount = await countApplicationsInMonth(
      companyID,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countApplicationsInMonth(
      companyID,
      previousMonth
    );
  
    let percentageApplications;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentageApplications =
        isFinite(percentageImprovement)
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
    await getApplicationCountAndPercentage(companyID);


  // Finding percentage Successful
  async function countSuccessfulApplicationsInMonth(
    companyID: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successApplications = await db.application.findMany({
      where: {
        companyId: companyID,
        status: {
          in: ["OFFERED"],
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        id: true
      }
    });
    return successApplications.length;
  }

  async function getSuccessfulApplicationCountAndPercentage(
    companyID: string
  ): Promise<{ countSuccess: number; percentageSuccess: string }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      companyID,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      companyID,
      previousMonth
    );
  
    let percentageSuccess;
    if (previousMonthSuccessCount !== 0) {
      const percentageChange =
        ((currentMonthSuccessCount - previousMonthSuccessCount) /
          previousMonthSuccessCount) *
        100;
      percentageSuccess =
        isFinite(percentageChange)
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
    await getSuccessfulApplicationCountAndPercentage(companyID);

  //Week applications
  async function countWeekApplicationsInWeek(
    companyID: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekApplications = await db.application.findMany({
      where: {
        companyId: companyID,
        isEmployerID,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true
      }
    });
    return weekApplications.length;
  }

  async function getWeekApplicationCountAndPercentage(
    companyID: string
  ): Promise<{ countWeek: number; percentageWeek: string }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekApplicationsInWeek(
      companyID,
      startDate,
      endDate
    );
  
    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekApplicationsInWeek(
      companyID,
      previousWeekStartDate,
      previousWeekEndDate
    );
  
    let percentageWeek;
    if (previousWeekCount !== 0) {
      const percentageChange =
        ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100;
      percentageWeek =
        isFinite(percentageChange)
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
    await getWeekApplicationCountAndPercentage(companyID);

  //Day applications
  async function countPendingApplications(
    companyID: string,
    date: Date = new Date()
  ): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const queryFilters: {
      companyId: string;
      status: ApplicationStatus;
      createdAt: {
        gte: Date;
        lt: Date;
      };
    } = {
      companyId: companyID,
      status: "PENDING",
      createdAt: {
        gte: startOfDate,
        lt: endOfDate,
      },
    };

    const activeApplications = await db.application.findMany({
      where: queryFilters,
      select: {
        id: true
      }
    });
    return activeApplications.length;
  }

  async function getPendingApplicationCountAndPercentage(
    companyID: string
  ): Promise<{ countPending: number; percentagePending: string }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingApplications(
      companyID,
      currentDate
    );
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingApplications(
      companyID,
      previousDay
    );
  
    let percentagePending;
    if (previousDayPendingCount !== 0) {
      const percentageChange =
        ((currentPendingCount - previousDayPendingCount) /
          previousDayPendingCount) *
        100;
      percentagePending =
        isFinite(percentageChange)
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
  await getPendingApplicationCountAndPercentage(companyID);

  // Data for lineChart

  const myPendingApplication = await db.application.findMany({
    where: {
      companyId: companyID,
      isEmployerID,
      status: {
        in: ["PENDING"],
      },
    },
    select: {
      id: true
    }
  });
const pendingLength= myPendingApplication.length

  const myApplication = await db.application.findMany({
    where: {
      companyId: companyID,
      isEmployerID,
    },
    select: {
      createdAt: true,
      id: true,
      status: true
    }
  });

  const myJobs = await db.job.findMany({
    where: {
      companyId: companyID,
      isEmployerID,
      userId,
      archived: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "desc",
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

  const totalActiveApplications = await db.application.findMany({
    where: {
      companyId: companyID,
      isEmployerID,
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
      companyId: companyID,
      isEmployerID,
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
      companyId: companyID,
      isEmployerID,
      status: {
        in: ["DECLINED"],
      },
    },
    select: {
      id: true,
    },
  });

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
      <AllJobsApplications myJobs={myJobs} />
    </div>
  );
};

export default Page;
