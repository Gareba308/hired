import React from "react";
import Transactions from "../_components/transactions/Transactions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/transactions");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/transactions");

  const allMyPayments = await db.payment.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      isEmployerID: true,
      mPesaID: true,
      paymentPhone: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <Transactions payments={allMyPayments} />
    </div>
  );
};

export default Page;
