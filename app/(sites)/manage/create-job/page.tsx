import { getServerSession } from "next-auth";
import CreateJob from "../_components/job/CreateJob";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import { db } from "@/db";
import NoProfile from "../_components/profile/Unavailable";
import NoMoney from "../_components/job/NoMoney";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login/enterprises?origin=manage/create-job");
  const thirtyDaysAgo = subDays(new Date(), 30);
  const userId = session?.id;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login/enterprises?origin=manage/create-job");

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

  const hasEmployerOrderedAssessment = await db.pickAssessCandidate.findMany({
    where: {
      userId: dbUser.id,
      userEmail: dbUser.email,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  const hasAccountUnits = await db.accountBalance.findFirst({
    where: {
      userEmail: dbUser.email,
    },
    select: {
      units: true,
    },
  });

  if (!hasAccountUnits) redirect("/manage/help?origin=manage/create-job");

  return (
    <>
      {hasAccountUnits.units < 0 ? (
        <NoMoney />
      ) : (
        <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
          <CreateJob orderedAssessments={hasEmployerOrderedAssessment} />
        </div>
      )}
    </>
  );
};

export default Page;
