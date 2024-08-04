import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminProfile from "../_components/profile/AdminProfile";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/profile");
  const userId = session.id;
  const email = session?.user?.email;

  if (!userId || !email) redirect("/home/login?origin=control/profile");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!dbUser) redirect("/home/login?origin=manage/profile");

  const profileExists = await db.adminProfile.findFirst({
    where: {
      userId,
    },
  });

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-1.5 pb-4 mb-4 px-4 md:px-6 text-gray-700 text-base sm:rounded-lg shadow-sm">
      <AdminProfile profile={profileExists} user={dbUser} />
    </div>
  );
};

export default Page;
