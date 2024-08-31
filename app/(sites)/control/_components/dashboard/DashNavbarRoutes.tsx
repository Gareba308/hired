import React from "react";
import UserAccountNav from "./UserAccountNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import DashButton from "./DashButton";

const DashNavbarRoutes = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login");

  const userId = session.id;

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
  if (!user) redirect("/home/login");

  const bio= await db.adminProfile.findFirst({
    where: {
      userId: user.id
    }
  })

  const email = user.email;
  const name = user.name as string;
  const pic= bio?.photo

  return (
    <div className="flex gap-x-3 ml-auto">
      <DashButton />
      <UserAccountNav email={email} name={name} pic={pic as string}/>
    </div>
  );
};

export default DashNavbarRoutes;
