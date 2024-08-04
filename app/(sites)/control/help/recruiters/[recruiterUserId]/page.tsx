import { db } from "@/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HelpMessageDetails from "../../../_components/help/employers/HelpMessageDetails";

interface RecruiterID {
  params: {
    recruiterUserId: string;
  };
}
const Page = async ({ params }: RecruiterID ) => {
  const { recruiterUserId } = params;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=control/help/recruiters/${recruiterUserId}`);
  const userId = session.id;
  const role= session.role
  if (!userId )
    redirect(`/home/login?origin=control/help/recruiters/${recruiterUserId}`);
  if (!role )
    redirect(`/home/login?origin=control/help/recruiters/${recruiterUserId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser)
    redirect(`/home/login?origin=control/help/recruiters/${recruiterUserId}`);

  const recruiterExists = await db.user.findFirst({
    where: {
      id: recruiterUserId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!recruiterExists) redirect("/control/help/recruiters");

  const allHelpMessages = await db.helpEmployer.findMany();

  const oneUserHelpMessages = await db.helpEmployer.findMany({
    where: {
      userId: recruiterUserId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const userIDsWithHelpMessages = allHelpMessages.flatMap(
    (help) => help.userId
  );

  const allUserWithHelpMessages = await db.user.findMany({
    where: {
      id: {
        in: userIDsWithHelpMessages,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return (
    <div>
      <HelpMessageDetails
        userMessages={allHelpMessages}
        usersWithMessages={allUserWithHelpMessages}
        oneUserMessages={oneUserHelpMessages}
        senderExists={recruiterExists}
        myRole={dbUser.role as string}
      />
    </div>
  );
};

export default Page;
