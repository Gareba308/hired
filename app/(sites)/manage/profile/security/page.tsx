import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SecurityProfile from "../../_components/profile/SecurityProfile";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login?origin=manage/profile");

  const userId = session.id;
  const email= session?.user?.email

  if (!userId || !email) redirect("/home/login?origin=manage/profile");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=manage/profile");

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) redirect("/home/login?origin=manage/profile");

  const employer= await db.employers.findFirst({
    where: {
      employerEmail: email
    }
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-4 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base sm:rounded-lg shadow-sm">
      <SecurityProfile  user={user} position={employer?.jobPosition as string} isEmployerID={employer?.id as string}/>
    </div>
  );
};

export default Page;