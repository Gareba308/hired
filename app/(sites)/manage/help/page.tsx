import { getServerSession } from "next-auth";
import HelpAll from "../_components/help/HelpAll";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=manage/help");
  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/help");

  const name = dbUser.name!;
  const myHelpMessages = await db.helpEmployer.findMany({
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
  return (
    <div>
      <HelpAll
        myHelpMessages={myHelpMessages}
        name={name}
      />
    </div>
  );
};

export default Page;