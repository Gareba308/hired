import { db } from "@/db";
import HomePage from "./(sites)/home/_components/homePage/HomePage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const revalidate = 30;

const getJobs = async () => {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs
};

const Page = async () => {
  const jobs = await getJobs()
  return (
    <div>
      <Suspense
          fallback={
            <p className="flex items-center justify-center">
              <Loader2 className="shrink-0 animate-spin h-7 w-7 text-gray-600" />
            </p>
          }
        >
        <HomePage jobs={jobs} />
        </Suspense>
    </div>
  );
};

export default Page;
