import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import EmployerMessages from "../_components/messages/EmployerMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/messages");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin=control/messages");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/messages");

  const employerMessages = await db.contactEmployer.findMany({
    where: {
      adminUserId: userId,
    },
  });

  const messagesCompanyIDs = employerMessages.map(
    (message) => message.companyId
  );

  const companiesWithMessages = await db.company.findMany({
    where: {
      id: {
        in: messagesCompanyIDs,
      },
    },
  });

  const companies= await db.company.findMany()
  return (
    <div>
      <EmployerMessages
        employerMessages={employerMessages}
        companiesWithMessages={companiesWithMessages}
        companies={companies}
      />
    </div>
  );
};

export default Page;
