import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
import MyJobsDetails from "../../_components/job/MyJobsDetails";
interface MyJobDetailsProps {
  params: {
    jobId: string;
  };
}

export const revalidate = 60;
export async function generateStaticParams() {
  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return jobs.map((job) => ({ jobId: job.id }));
}

const Page = async ({ params }: MyJobDetailsProps) => {
  const { jobId } = params;

  const job = await db.job.findFirst({
    where: {
      id: jobId,
    },
  });

  if (!job) redirect("/manage/my-jobs");

  const companyProfile= await db.company.findFirst({
    where: {
      id: job.companyId
    }
  })
  return (
    <div className="space-y-6  pb-5 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-4 md:px-6 text-gray-700 rounded-lg">
      <MyJobsDetails job={job} companyProfile={companyProfile}/>
    </div>
  );
};

export default Page;
