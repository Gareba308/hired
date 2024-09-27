import { db } from "@/db";
import { redirect } from "next/navigation";
import { Job } from "@prisma/client";
import CompanyDetails from "../../_components/companies/CompanyDetails";

interface CompanyDetailsProps {
  params: {
    slug: string;
  };
}

type CompanyWithJobs = {
  company_name: string;
  companyLogo: string | null;
  company_description: string | null;
  companyCategory: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  numberOfOccurrence: number;
  jobs: Job[];
};

const convertFromSlug = (str: string): string => {
  return decodeURIComponent(str).replace(/_/g, " ").trim();
};

const getCompanyWithJobs = async (slug: string) => {
  const currentDate = new Date();
  const trueCompanyName = convertFromSlug(slug).trim();

  const pickJobs = await db.job.findMany({
    where: {
      company_name: {
        contains: trueCompanyName,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const jobs = pickJobs.filter((job) => {
    const normalizedJobCompanyName = job.company_name.trim().toLowerCase();
    return normalizedJobCompanyName === trueCompanyName.toLowerCase();
  });

  if (jobs.length === 0) {
    return null;
  }

  const latestJob = jobs.reduce((latest, job) => {
    return new Date(job.updatedAt) > new Date(latest.updatedAt) ? job : latest;
  });

  const companyWithJobs: CompanyWithJobs = {
    company_name: latestJob.company_name,
    companyLogo: latestJob.companyLogo,
    company_description: latestJob.company_description,
    companyCategory: latestJob.companyCategory,
    companyEmail: latestJob.companyEmail,
    companyWebsite: latestJob.companyWebsite,
    numberOfOccurrence: jobs.length,
    jobs,
  };

  return companyWithJobs;
};

const Page = async ({ params }: CompanyDetailsProps) => {
  const { slug } = params;
  const company = await getCompanyWithJobs(slug);

  if(!company){
    redirect('/control/companies')
  }
  return (
    <div>
      <CompanyDetails
        company={company}
      />
    </div>
  );
};

export default Page;
