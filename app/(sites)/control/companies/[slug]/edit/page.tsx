import { db } from "@/db";
import React from "react";
import EditRegisteredCompany from "../../../_components/companies/editing/registered/EditRegistedCompany";
import EditUnregisteredCompany from "../../../_components/companies/editing/unregistered/EditUnregistedCompany";
import NoCompanyToEdit from "../../../_components/companies/NoCompanyToEdit";

interface AdminEditCompanyProps {
  params: {
    slug: string;
  };
}

const convertFromSlug = (str: string): string => {
  return decodeURIComponent(str).replace(/_/g, " ").trim();
};

const Page = async ({ params }: AdminEditCompanyProps) => {
  const slug = params.slug;
  const trueCompanyName = convertFromSlug(slug).trim();
  const unregisteredCompany = await db.unregisteredCompany.findFirst({
    where: {
      companyName: {
        equals: trueCompanyName,
        mode: "insensitive",
      },
    },
  });

  const registeredCompany = await db.company.findFirst({
    where: {
      company_name: {
        equals: trueCompanyName,
        mode: "insensitive",
      },
    },
  });
  return (
    <div className="space-y-2 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-2 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base rounded-lg">
      {unregisteredCompany ? (
        <EditUnregisteredCompany slug={slug} company={unregisteredCompany}/>
      ) : registeredCompany ? (
        <EditRegisteredCompany slug={slug} company={registeredCompany}/>
      ) : (
        <NoCompanyToEdit />
      )}
    </div>
  );
};

export default Page;
