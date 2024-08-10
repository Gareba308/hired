import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import NoProfile from "../_components/referrals/NoProfile";
import EmployerReferralFirst from "../_components/referrals/EmployerReferralFirst";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/referrals");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email)
    redirect("/home/login/enterprises?origin=manage/referrals");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/referrals");
  const isEmployer = await db.employers.findFirst({
    where: {
      employerEmail: email,
    },
  });

  if (!isEmployer) redirect("/home/login/enterprises?origin=manage/referrals");

  const employerProfile = await db.company.findFirst({
    where: {
      userId,
    },
  });

  const employerBlogs = await db.blogs.findFirst({
    where: {
      target: {
        in: ["Employer", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {!employerProfile ? (
        <NoProfile />
      ) : (
        <EmployerReferralFirst user={dbUser} blog={employerBlogs} />
      )}
    </div>
  );
};

export default Page;
