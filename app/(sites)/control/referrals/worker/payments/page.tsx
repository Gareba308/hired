import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { RedeemHistory } from "../../../_components/referrals/RedeemHistory";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session)
    redirect("/home/login?origin=control/referrals/worker/payments");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/referrals/worker/payments");

  const getWorkerRedeems = await db.workerRequestRedeem.findMany({
    select: {
      id: true,
      fullName: true,
      paymentID: true,
      phoneNumber: true,
      paymentDate: true,
      paymentPhone: true,
      userId: true,
      email: true,
      availablePoints: true,
      subtotal: true,
      tax: true,
      transactionFee: true,
      totalPayable: true,
      paid: true,
      hide: true,
      createdAt: true,
    },
  });
  return (
    <div  className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <RedeemHistory history={getWorkerRedeems} />
    </div>
  );
};

export default Page;
