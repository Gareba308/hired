import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import EmployerMessages from "../../_components/adminMessaging/EmployerMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=manage/messaging/admin");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=manage/messaging/admin");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/messaging/admin");

  const employerMessages = await db.contactEmployer.findMany({
    where: {
      employerUserId: userId,
      employerHide: {
        equals: false,
      },
      employerArchive: {
        equals: false
      }
    },
  });

  return (
    <div>
      <EmployerMessages
        employerMessages={employerMessages}
      />
    </div>
  );
};

export default Page;