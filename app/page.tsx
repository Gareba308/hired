import { db } from "@/db";
import HomePage from "./(sites)/home/_components/homePage/HomePage";

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
      <HomePage jobs={jobs} />
    </div>
  );
};

export default Page;
