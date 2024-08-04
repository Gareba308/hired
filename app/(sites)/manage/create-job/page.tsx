import { getServerSession } from "next-auth";
import CreateJob from "../_components/job/CreateJob";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import NoProfile from "../_components/profile/Unavailable";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login?origin=manage/create-job");

  const userId = session?.id;

  const companyProfile = await db.company.findMany({
    where: {
      userId,
    },
  });

  if (companyProfile.length === 0) {
    return (
      <>
        <NoProfile />
      </>
    );
  }

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <CreateJob />
    </div>
  );
};

export default Page;
