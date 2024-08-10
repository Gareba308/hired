import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OurProfile from "../_components/profile/OurProfile";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login/enterprises?origin=manage/profile");

  const userId = session.id;
  const email= session?.user?.email

  if (!userId || !email) redirect("/home/login/enterprises?origin=manage/profile");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/profile");

  const profileExists = await db.company.findFirst({
    where: {
      userId,
    },
  });

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) redirect("/home/login/enterprises?origin=manage/profile");

  return (
    <div className="space-y-4 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-4 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base sm:rounded-lg shadow-sm">
      <OurProfile profile={profileExists}/>
    </div>
  );
};

export default Page;
