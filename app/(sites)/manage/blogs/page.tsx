import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import NoAllBlogs from "../_components/blogs/NoBlogs";
import AllBlogs from "../_components/blogs/AllBlogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Blogs",
}

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/blogs");
  const userId = session.id;
  const role = session.role;

  if (!userId) redirect("/home/login/enterprises?origin=manage/blogs");
  if (!role) redirect("/home/login/enterprises?origin=manage/blogs");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      role,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/blogs");

  const employerBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      },
      hide: {
        equals: true
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {employerBlogs.length === 0 ? (
        <NoAllBlogs />
      ) : (
        <AllBlogs blogs={employerBlogs} />
      )}
    </div>
  );
};

export default Page;
