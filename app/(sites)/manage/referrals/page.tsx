import React from "react";
import EmployerReferrals from "../_components/referrals/EmployerReferrals";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=manage/referrals");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=manage/referrals");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
    select: {
      referralCode: true,
      id: true,
      email: true,
    }
  });

  if (!dbUser) redirect("/home/login?origin=manage/referrals");
  const isEmployer = await db.employers.findFirst({
    where: {
      employerEmail: email,
    },
  });

  if (!isEmployer) redirect("/home/login?origin=manage/referrals");
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EmployerReferrals user={dbUser}/>
    </div>
  );
};

export default Page;
