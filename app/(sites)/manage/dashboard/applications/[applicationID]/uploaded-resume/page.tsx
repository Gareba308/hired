import BetterUploaded from "@/app/(sites)/manage/_components/applications/BetterUploaded";
import NoApplication from "@/app/(sites)/manage/_components/applications/NoApplication";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface UploadedResumeProps {
  params: {
    applicationID: string;
  };
}

const Page = async ({ params }: UploadedResumeProps) => {
  const applicationID = params.applicationID;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(
      `/home/login/enterprises?origin=manage/applications/${applicationID}/uploaded-resume`
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
      `/home/login/enterprises?origin=manage/applications/${applicationID}/uploaded-resume`
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
    <div className="min-h-[calc(100vh-7rem)] lg:max-h-[calc(100vh-90px)] sm:rounded-md  pt-2 bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto">
      <BetterUploaded
        application={application}
        applicationID={applicationID}
      />
    </div>
  );
};

export default Page;
