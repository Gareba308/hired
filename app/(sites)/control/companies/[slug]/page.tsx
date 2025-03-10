import { db } from "@/db";
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

  const [registeredCompany, unregisteredCompany] = await Promise.all([
    db.company.findFirst({
      where: { company_name: { equals: trueCompanyName, mode: "insensitive" } },
      select: {
        company_name: true,
        logo: true,
        company_description: true,
        category: true,
        secondaryEmail: true,
        website: true,
      },
    }),
    db.unregisteredCompany.findFirst({
      where: { companyName: { equals: trueCompanyName, mode: "insensitive" } },
      select: {
        companyName: true,
        logo: true,
        companyDescription: true,
        companyCategory: true,
        companyEmail: true,
        companyWebsite: true,
      },
    }),
  ]);

  const companyData = registeredCompany || unregisteredCompany;

  if (!companyData) {
    return null; 
  }

  const jobs = await db.job.findMany({
    where: {
      company_name: {
        equals: trueCompanyName,
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

  const companyWithJobs: CompanyWithJobs = {
    company_name: registeredCompany?.company_name || unregisteredCompany?.companyName || trueCompanyName,
    companyLogo: registeredCompany?.logo || unregisteredCompany?.logo || null,
    company_description: registeredCompany?.company_description || unregisteredCompany?.companyDescription || null,
    companyCategory: registeredCompany?.category || unregisteredCompany?.companyCategory || null,
    companyEmail: registeredCompany?.secondaryEmail || unregisteredCompany?.companyEmail || null,
    companyWebsite: registeredCompany?.website || unregisteredCompany?.companyWebsite || null,
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