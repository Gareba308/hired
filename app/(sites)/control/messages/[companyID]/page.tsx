import { db } from "@/db";
import CompanyMessageDetails from "../../_components/messages/CompanyMessageDetails";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CompanyMessageProps {
  params: {
    companyID: string;
  };
}
export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() {
  const companies = await db.company.findMany({
    select: {
      id: true
    }
  });

  return companies.map((company) => ({
    companyID: company.id,
  }));
}

const Page = async ({ params }: CompanyMessageProps) => {
  const { companyID } = params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login?origin=control/messages/${companyID}`);
  const userId = session.id;
  if (!userId) redirect(`/home/login?origin=control/messages/${companyID}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=control/messages/${companyID}`);
  const companyExists = await db.company.findFirst({
    where: {
      id: companyID,
    },
  });

  if (!companyExists) redirect("/control/messages");
  const companies = await db.company.findMany();

  const oneCompanyMessages = await db.contactEmployer.findMany({
    where: {
      companyId: companyExists?.id,
      adminHide: {
        equals: false,
      },
      adminArchive: {
        equals: false,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const allOneCompanyMessages = await db.contactEmployer.findMany({
    where: {
      companyId: companyExists.id,
      adminUserId: userId,
    },
  });

  const employerMessages = await db.contactEmployer.findMany({
    where: {
      adminUserId: userId,
      adminHide: {
        equals: false,
      },
      adminArchive: {
        equals: false,
      },
    },
  });

  const messagesCompanyIDs = employerMessages.map(
    (message) => message.companyId
  );

  const companiesWithMessages = await db.company.findMany({
    where: {
      id: {
        in: messagesCompanyIDs,
      },
    },
  });

  return (
    <div>
      <CompanyMessageDetails
        employerMessages={employerMessages}
        companiesWithMessages={companiesWithMessages}
        oneCompanyMessages={oneCompanyMessages}
        companyExists={companyExists}
        allOneCompanyMessages={allOneCompanyMessages}
        companies={companies}
      />
    </div>
  );
};

export default Page;
