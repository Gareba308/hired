import CreateJob from "../_components/job/CreateJob";
import { db } from "@/db";
import { subDays } from 'date-fns';
import NoProfile from "../_components/profile/Unavailable";

const Page = async () => {
  const companyProfile = await db.company.findMany();
  const thirtyDaysAgo = subDays(new Date(), 30);
  const allOrderedAssessments = await db.pickAssessCandidate.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    }
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {companyProfile.length === 0 ? (
        <NoProfile />
      ) : (
        <CreateJob
          companies={companyProfile}
          allOrderedAssessments={allOrderedAssessments}
        />
      )}
    </div>
  );
};

export default Page;
