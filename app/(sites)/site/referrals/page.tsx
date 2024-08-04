import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import NoProfile from "../_components/referrals/NoProfile";
import WorkerReferralFirst from "../_components/referrals/WorkerReferralFirst";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/referrals");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=site/referrals");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/referrals");
  const isWorker = await db.workers.findFirst({
    where: {
      workerEmail: email,
    },
  });

  if (!isWorker) redirect("/home/login?origin=site/referrals");
  const workerBio = await db.workerBio.findFirst({
    where: {
      userId,
    },
  });
  const workerContact = await db.workerContact.findFirst({
    where: {
      userId,
    },
  });

  const workerBlog = await db.blogs.findFirst({
    where: {
      target: {
        in: ["Worker", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {!workerBio || !workerContact ? (
        <NoProfile />
      ) : (
        <WorkerReferralFirst user={dbUser} blog={workerBlog} />
      )}
    </div>
  );
};

export default Page;
