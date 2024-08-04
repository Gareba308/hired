import React from "react";
import CreateBlog from "../../_components/Blogs/CreateBlog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import NoProfile from "../../_components/Blogs/NoProfile";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/blogs/create");
  const userId = session.id;
  const email = session.user?.email;
  if (!email || !userId) redirect("/home/login?origin=control/blogs/create");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/blogs/create");

  const profileExists = await db.adminProfile.findFirst({
    where: {
      userId,
    },
  });

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {profileExists ? <CreateBlog /> : <NoProfile />}
    </div>
  );
};

export default Page;
