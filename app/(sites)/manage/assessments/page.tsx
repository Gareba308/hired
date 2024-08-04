import React from "react";
import EmployerAssess from "../_components/assessments/EmployerAssess";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=manage/assessments");
  const userId = session.id;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/assessments");

  const banners = await db.assessmentBanner.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  const demoBanners = await db.assessmentBanner.findMany({
    where: {
      forDemo: {
        equals: true,
      },
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EmployerAssess banners={banners} demoBanners={demoBanners}/>
    </div>
  );
};

export default Page;
