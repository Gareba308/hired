import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import AdminMessages from "../../_components/adminMessaging/AdminMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/messaging/admin");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=site/messaging/admin");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/messaging/admin");

  const workerMessages = await db.contactWorker.findMany({
    where: {
      workerUserId: userId,
      workerHide: {
        equals: false,
      },
      workerArchive: {
        equals: false
      }
    },
  });

  return (
    <div>
      <AdminMessages
        workerMessages={workerMessages}
      />
    </div>
  );
};

export default Page;