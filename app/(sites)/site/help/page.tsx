import { getServerSession } from "next-auth";
import HelpAll from "../_components/help/HelpAll";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/help");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/help");

  const name = dbUser.name!;
  const myHelpMessages = await db.helpWorker.findMany({
    where: {
      userId,
      hide: {
        equals: false,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const bioData = await db.workerBio.findFirst({
    where: {
      userId,
    },
    select: {
      profilePic: true,
    },
    take: 1,
  });

  const profilePic = bioData?.profilePic as string;
  return (
    <div>
      <HelpAll
        myHelpMessages={myHelpMessages}
        name={name}
        profilePic={profilePic}
      />
    </div>
  );
};

export default Page;
