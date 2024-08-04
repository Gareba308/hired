import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { EmployerReferrals } from "../_components/referrals/EmployerReferrals";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/referrals");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/referrals");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/referrals");

  const getEmployerReferrals = await db.userReferrals.findMany({
    where: {
      myRole: {
        equals: "employer",
      },
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      email: true,
      inviteeEmail: true,
      inviteeName: true,
      redeemed: true,
      credit: true,
      uniqueCode: true,
      myRole: true,
      hide: true,
      invitationCode: true,
      joined: true,
      approved: true,
      failed: true,
      createdAt: true,
    },
  });

  const getWorkerReferrals = await db.userReferrals.findMany({
    where: {
      myRole: {
        equals: "worker",
      },
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      email: true,
      inviteeEmail: true,
      inviteeName: true,
      redeemed: true,
      credit: true,
      uniqueCode: true,
      myRole: true,
      hide: true,
      invitationCode: true,
      joined: true,
      approved: true,
      failed: true,
      createdAt: true,
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EmployerReferrals combinedData={getEmployerReferrals}/> 
    </div>
  );
};

export default Page;
