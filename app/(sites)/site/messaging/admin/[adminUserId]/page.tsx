import { db } from "@/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminMessageDetails from "../../../_components/adminMessaging/AdminMessageDetails";

interface CompanyMessageProps {
  params: {
    adminUserId: string;
  };
}

const Page = async ({ params }: CompanyMessageProps) => {
  const { adminUserId } = params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login?origin=site/messaging/admin/${adminUserId}`);
  const userId = session.id;
  if (!userId) redirect(`/home/login?origin=site/messaging/admin/${adminUserId}`);
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

  if(!adminSenderExists) redirect('/site/messaging/admin')

  const oneAdminMessages = await db.contactWorker.findMany({
    where: {
      adminUserId: adminSenderExists?.id,
      workerUserId: dbUser.id,
      workerHide: {
        equals: false,
      },
      workerArchive: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  const allOneAdminMessages= await db.contactWorker.findMany({
    where: {
      adminUserId: adminSenderExists.id,
      workerUserId: userId
    }
  })

  const workerMessages = await db.contactWorker.findMany({
    where: {
      workerUserId: userId,
      workerHide: {
        equals: false,
      },
      workerArchive: {
        equals: false
      }
    },
  });

  return (
    <div>
      <AdminMessageDetails
        workerMessages={workerMessages}
        oneAdminMessages={oneAdminMessages}
        adminSenderExists={adminSenderExists}
        allOneAdminMessages={allOneAdminMessages}
      />
    </div>
  );
};

export default Page;
