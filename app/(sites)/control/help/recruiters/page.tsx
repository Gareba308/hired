import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import HelpMessages from "../../_components/help/employers/HelpMessages";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/help/recruiters");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=control/help/recruiters");

  const getEmployersHelpRequests = await db.helpEmployer.findMany();

  const usersWithHelpMessagesIDs = getEmployersHelpRequests.flatMap(
    (help) => help.userId
  );

  const usersWithHelpMessagesDetails = await db.user.findMany({
    where: {
      id: {
        in: usersWithHelpMessagesIDs,
      },
    },
    select: {
      name: true,
      email: true,
      id: true,
    },
  });
  return (
    <div>
      <HelpMessages
        employerMessages={getEmployersHelpRequests}
        usersWithMessages={usersWithHelpMessagesDetails}
      />
    </div>
  );
};

export default Page;
