import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BioProfile from "../_components/profile/BioProfile";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login?origin=site/profile");

  const userId = session.id;

  if (!userId) redirect("/home/login?origin=site/profile");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/profile");

  const profileBio = await db.workerBio.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-4 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base rounded-md shadow-sm">
      <BioProfile
        profileBio={profileBio}
      />
    </div>
  );
};

export default Page;