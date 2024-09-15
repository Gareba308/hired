import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import NoAllBlogs from "../_components/blogs/NoBlogs";
import AllBlogs from "../_components/blogs/AllBlogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Search Blogs",
  description:
    "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
}

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/blogs");
  const userId = session.id;
  const role = session.role;

  if (!userId) redirect("/home/login?origin=site/blogs");
  if (!role) redirect("/home/login?origin=site/blogs");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      role,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/blogs");

  const workerBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
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
      {workerBlogs.length === 0 ? (
        <NoAllBlogs />
      ) : (
        <AllBlogs blogs={workerBlogs} />
      )}
    </div>
  );
};

export default Page;
