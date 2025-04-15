import { db } from "@/db";
import HomePage from "./(sites)/home/_components/homePage/HomePage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getJobs = async () => {
  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      subCategory: true
    }
  });

  return jobs;
};

const Page = async () => {
  const jobs = await getJobs();
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="shrink-0 animate-spin h-7 w-7 text-gray-600" />
          </div>
        }
      >
        <HomePage jobs={jobs} />
      </Suspense>
    </div>
  );
};

export default Page;
