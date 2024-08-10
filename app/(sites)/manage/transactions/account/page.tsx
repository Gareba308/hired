import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import TransactionAccounts from "../../_components/transactions/TransactionAccounts";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/transactions/account");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/transactions/account");

  const allAccountPurchases = await db.purchaseJobPlan.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      isEmployerID: true,
      planID: true,
      planPrice: true,
      planName: true,
      planUnits: true,
      createdAt: true,
      invoiceID: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <TransactionAccounts purchases={allAccountPurchases} />
    </div>
  );
};

export default Page;