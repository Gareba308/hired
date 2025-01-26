import { db } from "@/db";
import { redirect } from "next/navigation";
import JobDetails from "../../_components/job/JobDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Job } from "@prisma/client";

interface JobsProps {
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
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return jobs.map((job) => ({ jobId: job.id }));
}

const Page = async ({ params }: JobsProps) => {
  const { jobId } = params;
  const currentDate = new Date();
  const job = await db.job.findFirst({
    where: {
      id: jobId,
    },
  });

  if (!job) redirect("/manage/jobs");

  const jobCategory = job.category as string;

  const similarJobs = await db.job.findMany({
    where: {
      category: jobCategory,
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
      id: {
        not: {
          equals: jobId,
        },
      },
    },
    select: {
      id: true,
      job_title: true,
      company_name: true,
      companyLogo: true,
      createdAt: true,
    }
  });
  const getRandomElement = (array: any[], numElement: number) => {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, numElement);
  };

  const randomElements = getRandomElement(similarJobs, 4);

  //  Popular Applied Job
  const allApplications = await db.application.findMany();
  const applicationsCounts: Record<string, number> = {};
  allApplications.forEach((application) => {
    const { jobId } = application;
    if (jobId) {
      applicationsCounts[jobId] = (applicationsCounts[jobId] || 0) + 1;
    }
  });
  const applicationsArray = Object.entries(applicationsCounts).map(
    ([jobId, count]) => ({
      jobId,
      count,
    })
  );
  const sortedApplications = applicationsArray.sort(
    (a, b) => b.count - a.count
  );

  const jobIDS = sortedApplications?.map((top) => top.jobId!);

  const popularJobs = await db.job.findMany({
    where: {
      id: {
        in: jobIDS,
      },
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      id: true,
      job_title: true,
      company_name: true,
      companyLogo: true,
      createdAt: true,
    }
  });

  const sortedPopularJobs = jobIDS
    .map((jobId) => popularJobs.find((job) => job.id === jobId))
    .filter((job) => job !== undefined) as Job[];

  const finalSortedPopularJobs = sortedPopularJobs.slice(0, 2);

  const companyProfile = await db.company.findFirst({
    where: {
      userId: job.userId,
    },
  });

  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises");
  const userID = session.id;

  const allJobs = await db.job.findMany({
    select: {
      id: true,
      job_title: true,
      personal_skills: true,
      category: true,
      job_type: true,
      county: true,
      deadline: true,
      possible_pay: true,
      academic: true,
      ownPlatformMethod: true,
      experience: true,
      companyLogo: true,
      companyId: true,
      company_name: true,
      rankTop: true,
      createdAt: true,
    }
  });
  return (
    <div className="space-y-6  pb-5 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-4 md:px-6 text-gray-800 rounded-lg">
      <JobDetails
        job={job}
        companyProfile={companyProfile}
        similarJobs={randomElements}
        popularJobs={finalSortedPopularJobs}
        userID={userID}
        allJobs={allJobs}
      />
    </div>
  );
};

export default Page;
