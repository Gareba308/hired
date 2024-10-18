import { db } from "@/db";
import NoApplication from "../../../_components/applications/NoApplication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import BetterApplication from "../../../_components/applications/BetterApplication";

interface ApplicationsDetailsProps {
  params: {
    applicationID: string;
  };
}


const Page = async ({ params }: ApplicationsDetailsProps) => {
  const applicationID = params.applicationID;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(
      `/home/login/enterprises?origin=manage/applications/${applicationID}`
    );

  const userId = session.id;
  const email = session.user?.email as string;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser)
    redirect(
      `/home/login/enterprises?origin=manage/applications/${applicationID}`
    );

  const application = await db.application.findFirst({
    where: {
      id: applicationID,
    },
  });

  if (!application) {
    return (
      <>
        <NoApplication />
      </>
    );
  }

  return (
    <div className="min-h-[calc(100vh-90px)] sm:rounded-md bg-white  pt-2 sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto">
      <BetterApplication
        application={application}
        applicationID={applicationID}
      />
    </div>
  );
};

export default Page;
