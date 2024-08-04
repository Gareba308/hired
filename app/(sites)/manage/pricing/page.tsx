import React from "react";
import Pricing from "../_components/pricing/Pricing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=manage/pricing");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/pricing");

  const accountBalanceOfUser = await db.accountBalance.findFirst({
    where: {
      userEmail: dbUser.email,
    },
  });

  if (!accountBalanceOfUser) redirect("/manage/help?origin=manage/pricing");

  const plans = await db.employerPlans.findMany({
    where: {
      forJobs: {
        equals: true,
      },
    },
    orderBy: {
      price: "asc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <Pricing user={dbUser} account={accountBalanceOfUser} plans={plans} />
    </div>
  );
};

export default Page;
