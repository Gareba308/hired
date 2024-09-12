import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { startOfMonth, endOfMonth, subMonths,} from "date-fns";
import { AllApplications } from "../_components/applications/AllApplications";
import DashboardPage from "../_components/userDashboard/DashboardData";

const Page = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.id;

  if (!userId) redirect("/home/login");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!dbUser) redirect("/home/login");

  async function countApplicationsInCurrentMonth(
    userId: string
  ): Promise<number> {
    const currentDate = new Date();
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    const applications = await db.application.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return applications.length;
  }
  const myCurrentMonthApplications = await countApplicationsInCurrentMonth(
    userId
  );

  // To find percentage improvement in application per month
  async function countApplicationsInMonth(
    userId: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const applications = await db.application.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return applications.length;
  }
  
  async function getApplicationCountAndPercentage(
    userId: string
  ): Promise<{ countApplications: number; percentageApplications: string }> {
    const currentDate = new Date();
    const currentMonthCount = await countApplicationsInMonth(
      userId,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countApplicationsInMonth(
      userId,
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
    await getApplicationCountAndPercentage(userId);


  //   Percentage Active applications change
  async function countActiveApplicationsInMonth(
    userId: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successApplications = await db.application.findMany({
      where: {
        userId: userId,
        status: {
          in: ["PENDING", "REVIEWING", "INTERVIEW"],
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return successApplications.length;
  }

  async function getActiveApplicationCountAndPercentage(
    userId: string
  ): Promise<{ countActive: number; percentageActive: string }> {
    const currentDate = new Date();
    const currentMonthActiveCount = await countActiveApplicationsInMonth(
      userId,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthActiveCount = await countActiveApplicationsInMonth(
      userId,
      previousMonth
    );
  
    let percentageActive;
    if (previousMonthActiveCount !== 0) {
      const percentageChange =
        ((currentMonthActiveCount - previousMonthActiveCount) /
          previousMonthActiveCount) *
        100;
      percentageActive =
        isFinite(percentageChange)
          ? `${Math.round(percentageChange * 10) / 10}%`
          : "∞";
    } else if (currentMonthActiveCount !== 0) {
      percentageActive = "∞";
    } else {
      percentageActive = "0%";
    }
  
    return {
      countActive: currentMonthActiveCount,
      percentageActive: percentageActive,
    };
  }
  

  const { countActive, percentageActive } =
    await getActiveApplicationCountAndPercentage(userId);

  // Finding percentage SUccessful
  async function countSuccessfulApplicationsInMonth(
    userId: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successApplications = await db.application.findMany({
      where: {
        userId,
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
    userId: string
  ): Promise<{ countSuccess: number; percentageSuccess: string }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      userId,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulApplicationsInMonth(
      userId,
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
    await getSuccessfulApplicationCountAndPercentage(userId);

  // Finding percentage Unsuccessful
  async function countUnsuccessfulApplicationsInMonth(
    userId: string,
    month: Date
  ): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const unsuccessApplications = await db.application.findMany({
      where: {
        userId,
        status: {
          in: ["DECLINED"],
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return unsuccessApplications.length;
  }

  async function getUnsuccessfulApplicationCountAndPercentage(
    userId: string
  ): Promise<{ countUnsuccess: number; percentageUnsuccess: string }> {
    const currentDate = new Date();
    const currentMonthUnsuccessCount = await countUnsuccessfulApplicationsInMonth(
      userId,
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthUnsuccessCount = await countUnsuccessfulApplicationsInMonth(
      userId,
      previousMonth
    );
  
    let percentageUnsuccess;
    if (previousMonthUnsuccessCount !== 0) {
      const percentageChange =
        ((currentMonthUnsuccessCount - previousMonthUnsuccessCount) /
          previousMonthUnsuccessCount) *
        100;
      percentageUnsuccess =
        isFinite(percentageChange)
          ? `${Math.round(percentageChange * 10) / 10}%`
          : "∞";
    } else if (currentMonthUnsuccessCount !== 0) {
      percentageUnsuccess = "∞";
    } else {
      percentageUnsuccess = "0%";
    }
  
    return {
      countUnsuccess: currentMonthUnsuccessCount,
      percentageUnsuccess: percentageUnsuccess,
    };
  }
  

  const { countUnsuccess, percentageUnsuccess } =
    await getUnsuccessfulApplicationCountAndPercentage(userId);


  const myApplication = await db.application.findMany({
    where: {
      userId: userId,
    },
  });


  return (
    <div className="space-y-6 pt-2  pb-5 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-3 md:px-4 text-gray-800 sm:shadow-sm sm:rounded-lg">
      <DashboardPage
        thisMonthApplications={myCurrentMonthApplications}
        totalApplications={myApplication.length}
        thisMonthCount={countApplications}
        thisMonthImprovement={percentageApplications}
        thisMonthActivePercentage={percentageActive}
        thisMonthActiveCount={countActive}
        countSuccess={countSuccess}
        percentageSuccess={percentageSuccess}
        percentageUnsuccess={percentageUnsuccess}
        currentActive={countActive}
        currentSuccessful={countSuccess}
        currentUnsuccessful={countUnsuccess}
        applications={myApplication}
      />
      <AllApplications myApplication={myApplication} />
    </div>
  );
};

export default Page;
