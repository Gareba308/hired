import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import WorkersReferralFirst from "../../_components/referrals/WorkersReferralFirst";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/referrals/worker");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/referrals/worker");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/referrals");

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
      <WorkersReferralFirst combinedData={getWorkerReferrals} />
    </div>
  );
};

export default Page;
