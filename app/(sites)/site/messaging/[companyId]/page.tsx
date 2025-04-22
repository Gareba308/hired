import { db } from "@/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WorkerMessageDetails from "../../_components/messaging/WorkerMessageDetails";

interface UserMessageProps {
  params: {
    companyId: string;
  };
}

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() {
  const companies = await db.employerContactWorker.findMany();

  return companies.map((company) => ({
    companyId: company.companyId,
  }));
}

const Page = async ({ params }: UserMessageProps) => {
  const { companyId } = params;

  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login?origin=site/messaging/${companyId}`);
  const userId = session.id;
  if (!userId) redirect(`/home/login?origin=site/messaging/${companyId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=site/messaging/${companyId}`);

  const companyExists = await db.company.findFirst({
    where: {
      id: companyId,
    },
  });

  if (!companyExists) redirect("/site/messaging");

  const oneCompanyMessages = await db.employerContactWorker.findMany({
    where: {
      companyId: companyId,
      workerUserId: dbUser.id,
      workerHide: {
        equals: false,
      },
      workerArchive: {
        equals: false,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const allOneCompanyMessages = await db.employerContactWorker.findMany({
    where: {
      companyId: companyId,
      workerUserId: dbUser.id,
    },
  });

  const workerMessages = await db.employerContactWorker.findMany({
    where: {
      workerUserId: userId,
      workerHide: {
        equals: false,
      },
      workerArchive: {
        equals: false,
      },
    },
  });

  const messagesCompanyID = workerMessages.map((message) => message.companyId);

  const companiesWithMessages = await db.company.findMany({
    where: {
      id: {
        in: messagesCompanyID,
      },
    },
  });

  return (
    <div>
      <WorkerMessageDetails
        workerMessages={workerMessages}
        companiesWithMessages={companiesWithMessages}
        oneCompanyMessages={oneCompanyMessages}
        companyExists={companyExists}
        allOneCompanyMessages={allOneCompanyMessages}
      />
    </div>
  );
};

export default Page;
