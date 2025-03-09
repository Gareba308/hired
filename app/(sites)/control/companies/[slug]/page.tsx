import { db } from "@/db";
import { redirect } from "next/navigation";
import CompanyDetails from "../../_components/companies/CompanyDetails";

interface CompanyDetailsProps {
  params: {
    slug: string;
  };
}

interface OurJob {
  company_name: string;
  updatedAt: Date;
  company_description: string | null;
  companyLogo: string | null;
  companyCategory: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  id: string;
  ownPlatformMethod: string | null;
  job_title: string;
  createdAt: Date;
  county: string | null;
  job_type: string | null;
  possible_pay: string | null;
}

type CompanyWithJobs = {
  company_name: string;
  companyLogo: string | null;
  company_description: string | null;
  companyCategory: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  numberOfOccurrence: number;
  jobs: OurJob[];
};

const convertFromSlug = (str: string): string => {
  return decodeURIComponent(str).replace(/_/g, " ").trim();
};

const getCompanyWithJobs = async (slug: string) => {
  const trueCompanyName = convertFromSlug(slug).trim();

  const pickJobs = await db.job.findMany({
    where: {
      company_name: {
        contains: trueCompanyName,
        mode: "insensitive",
      },
    },
    select: {
      company_name: true,
      updatedAt: true,
      companyLogo: true,
      company_description: true,
      companyCategory: true,
      companyEmail: true,
      companyWebsite: true,
      id: true,
      ownPlatformMethod: true,
      job_title: true,
      createdAt: true,
      county: true,
      job_type: true,
      possible_pay: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const jobs = pickJobs.filter((job) => 
    job.company_name.trim().toLowerCase() === trueCompanyName.toLowerCase()
  );

  const latestJob = jobs.length > 0
    ? jobs.reduce((latest, job) => new Date(job.updatedAt) > new Date(latest.updatedAt) ? job : latest)
    : null;

  const companyWithJobs: CompanyWithJobs = {
    company_name: latestJob?.company_name || trueCompanyName,
    companyLogo: latestJob?.companyLogo || null,
    company_description: latestJob?.company_description || null,
    companyCategory: latestJob?.companyCategory || null,
    companyEmail: latestJob?.companyEmail || null,
    companyWebsite: latestJob?.companyWebsite || null,
    numberOfOccurrence: jobs.length,
    jobs,
  };

  return companyWithJobs;
};

const Page = async ({ params }: CompanyDetailsProps) => {
  const { slug } = params;
  const company = await getCompanyWithJobs(slug);

  return (
    <div>
      <CompanyDetails company={company} />
    </div>
  );
};

export default Page;
