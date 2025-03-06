import { db } from "@/db";
import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import EditJob from "../../../_components/job/EditJob";

interface EditJobProps {
  params: {
    jobId: string;
  };
}
const thirtyDaysAgo = subDays(new Date(), 30);
export const revalidate = 60;
export async function generateStaticParams() {
  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return jobs.map((job) => ({ jobId: job.id }));
}

const Page = async ({ params }: EditJobProps) => {
  const { jobId } = params;

  const job = await db.job.findFirst({
    where: {
      id: jobId,
    },
  });

  if (!job) redirect("/control/jobs");

  const myOrderedPicks = await db.pickAssessCandidate.findMany({
    where: {
      companyID: job.companyId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  return (
    <div className="space-y-2 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-2 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base rounded-lg">
      <EditJob job={job} myOrderedPicks={myOrderedPicks} />
    </div>
  );
};

export default Page;
