import React from "react";
import Transactions from "../_components/transactions/Transactions";
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
import "@/lib/suppressHydration"
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/transactions");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/transactions");

  const allMyPayments = await db.payment.findMany({
    select: {
      id: true,
      userId: true,
      isEmployerID: true,
      fullName: true,
      userEmail: true,
      mPesaID: true,
      companyID: true,
      companyName: true,
      paymentPhone: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // To find percentage improvement in payments per month
  async function countPaymentsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const payments = await db.payment.findMany({
      where: {
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
      select: {
        amount: true,
      },
    });
    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return totalAmount;
  }

  async function getPaymentCountAndPercentage(): Promise<{
    countPayments: number;
    percentagePayments: string;
  }> {
    const currentDate = new Date();
    const currentMonthCount = await countPaymentsInMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthCount = await countPaymentsInMonth(previousMonth);

    let percentagePayments;
    if (previousMonthCount !== 0) {
      const percentageImprovement =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      percentagePayments = isFinite(percentageImprovement)
        ? `${Math.round(percentageImprovement * 10) / 10}%`
        : "∞";
    } else if (currentMonthCount !== 0) {
      percentagePayments = "∞";
    } else {
      percentagePayments = "0%";
    }

    return {
      countPayments: currentMonthCount,
      percentagePayments: percentagePayments,
    };
  }

  const { countPayments, percentagePayments } =
    await getPaymentCountAndPercentage();

  // Finding percentage payment greater than 6k in a month
  async function countSuccessfulPaymentsInMonth(month: Date): Promise<number> {
    const startOfMonthDate = startOfMonth(month);
    const endOfMonthDate = endOfMonth(month);
    const successPayments = await db.payment.findMany({
      where: {
        amount: {
          gte: 6000,
        },
        createdAt: {
          gte: startOfMonthDate,
          lte: endOfMonthDate,
        },
      },
    });
    return successPayments.length;
  }

  async function getSuccessfulPaymentCountAndPercentage(): Promise<{
    countPaymentSuccess: number;
    percentagePaymentSuccess: string;
  }> {
    const currentDate = new Date();
    const currentMonthSuccessCount = await countSuccessfulPaymentsInMonth(
      currentDate
    );
    const previousMonth = subMonths(currentDate, 1);
    const previousMonthSuccessCount = await countSuccessfulPaymentsInMonth(
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
      countPaymentSuccess: currentMonthSuccessCount,
      percentagePaymentSuccess: percentageSuccess,
    };
  }

  const { countPaymentSuccess, percentagePaymentSuccess } =
    await getSuccessfulPaymentCountAndPercentage();

  //Week payments
  async function countWeekPaymentsInWeek(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const weekPayments = await db.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
      },
    });
    const totalAmount = weekPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return totalAmount;
  }

  async function getWeekPaymentCountAndPercentage(): Promise<{
    countPaymentWeek: number;
    percentagePaymentWeek: string;
  }> {
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const currentWeekCount = await countWeekPaymentsInWeek(startDate, endDate);

    const previousWeekStartDate = startOfWeek(subWeeks(currentDate, 1));
    const previousWeekEndDate = endOfWeek(subWeeks(currentDate, 1));
    const previousWeekCount = await countWeekPaymentsInWeek(
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
      countPaymentWeek: currentWeekCount,
      percentagePaymentWeek: percentageWeek,
    };
  }

  const { countPaymentWeek, percentagePaymentWeek } =
    await getWeekPaymentCountAndPercentage();

  //Day Payments
  async function countPendingPayments(
    date: Date = new Date()
  ): Promise<number> {
    const startOfDate = startOfDay(date);
    const endOfDate = endOfDay(date);

    const activePayments = await db.payment.findMany({
      where: {
        createdAt: {
          gte: startOfDate,
          lt: endOfDate,
        },
      },
      select: {
        amount: true,
      },
    });

    const totalAmount = activePayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return totalAmount;
  }

  async function getPendingPaymentCountAndPercentage(): Promise<{
    countPaymentPending: number;
    percentagePaymentPending: string;
  }> {
    const currentDate = new Date();
    const currentPendingCount = await countPendingPayments(currentDate);
    const previousDay = subDays(currentDate, 1);
    const previousDayPendingCount = await countPendingPayments(previousDay);

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
      countPaymentPending: currentPendingCount,
      percentagePaymentPending: percentagePending,
    };
  }

  const { countPaymentPending, percentagePaymentPending } =
    await getPendingPaymentCountAndPercentage();
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <Transactions
        payments={allMyPayments}
        countPayments={countPayments}
        percentagePayments={percentagePayments}
        countPaymentSuccess={countPaymentSuccess}
        percentagePaymentSuccess={percentagePaymentSuccess}
        countPaymentWeek={countPaymentWeek}
        percentagePaymentWeek={percentagePaymentWeek}
        countPaymentPending={countPaymentPending}
        percentagePaymentPending={percentagePaymentPending}
      />
    </div>
  );
};

export default Page;
