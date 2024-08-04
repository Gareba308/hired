import { db } from "@/db";
import CompanyMessageDetails from "../../../_components/adminMessaging/CompanyMessageDetails";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CompanyMessageProps {
  params: {
    adminUserId: string;
  };
}

const Page = async ({ params }: CompanyMessageProps) => {
  const { adminUserId } = params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login?origin=manage/messaging/admin/${adminUserId}`);
  const userId = session.id;
  if (!userId) redirect(`/home/login?origin=manage/messaging/admin/${adminUserId}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=manage/messaging/admin/${adminUserId}`);
  const adminSenderExists = await db.user.findFirst({
    where: {
      id: adminUserId,
    },
    select:{
      id: true,
      name: true,
    }
  });

  if(!adminSenderExists) redirect('/manage/messaging/admin')

  const oneCompanyMessages = await db.contactEmployer.findMany({
    where: {
      adminUserId: adminSenderExists?.id,
      employerUserId: dbUser.id,
      employerHide: {
        equals: false,
      },
      employerArchive: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  const allOneCompanyMessages= await db.contactEmployer.findMany({
    where: {
      adminUserId: adminSenderExists.id,
      employerUserId: userId
    }
  })

  const employerMessages = await db.contactEmployer.findMany({
    where: {
      employerUserId: userId,
      employerHide: {
        equals: false,
      },
      employerArchive: {
        equals: false
      }
    },
  });

  return (
    <div>
      <CompanyMessageDetails
        employerMessages={employerMessages}
        oneCompanyMessages={oneCompanyMessages}
        adminSenderExists={adminSenderExists}
        allOneCompanyMessages={allOneCompanyMessages}
      />
    </div>
  );
};

export default Page;
