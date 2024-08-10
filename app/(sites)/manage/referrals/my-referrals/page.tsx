import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import MyReferralsFirst from "../../_components/referrals/MyReferralsFirst";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/referrals/my-referrals");
  const userId = session.id;
  if (!userId) redirect("/home/login/enterprises?origin=manage/referrals/my-referrals");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      referralCode: true,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/referrals/my-referrals");

  const referralCode = dbUser.referralCode as string;

  const fetchAllMyReferrals = await db.userReferrals.findMany({
    where: {
      uniqueCode: referralCode,
      userId: userId,
      hide: {
        equals: false,
      },
    },
    select: {
      inviteeEmail: true,
      uniqueCode: true,
      joined: true,
      hide: true,
      approved: true,
      failed: true,
      createdAt: true,
      credit: true,
      id: true,
      inviteeName: true,
    },
  });

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <MyReferralsFirst myReferrals={fetchAllMyReferrals} />
    </div>
  );
};

export default Page;
