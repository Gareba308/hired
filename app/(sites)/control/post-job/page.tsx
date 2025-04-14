import CreateJob from "../_components/job/CreateJob";
import { db } from "@/db";
import { subDays } from "date-fns";
import NoProfile from "../_components/profile/Unavailable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin='control/post-job");
  const userId = session.id;
  if (!userId) redirect("/home/login?origin='control/post-job");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!dbUser) redirect("/home/login?origin='control/post-job");
  const companyProfile = await db.company.findMany();
  const myProfile = await db.adminProfile.findFirst({
    where: {
      userId: dbUser.id,
    },
  });
  const thirtyDaysAgo = subDays(new Date(), 30);
  const allOrderedAssessments = await db.pickAssessCandidate.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  const unregisteredKnownCompanies = await db.unregisteredCompany.findMany();
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {!myProfile ? (
        <NoProfile />
      ) : (
        <CreateJob
          companies={companyProfile}
          unregisteredCompanies={unregisteredKnownCompanies}
          allOrderedAssessments={allOrderedAssessments}
        />
      )}
    </div>
  );
};

export default Page;
