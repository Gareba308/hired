import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import RedeemFirst from "../../../_components/referrals/RedeemFirst";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session)
    redirect("/home/login?origin=site/referrals/my-referrals/history");
  const userId = session.id;
  if (!userId)
    redirect("/home/login?origin=site/referrals/my-referrals/history");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!dbUser)
    redirect("/home/login?origin=site/referrals/my-referrals/history");
  const redeemHistory = await db.workerRequestRedeem.findMany({
    where: {
      userId: dbUser.id,
      hide: false
    },
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
    }
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <RedeemFirst history={redeemHistory} />
    </div>
  );
};

export default Page;