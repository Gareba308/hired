import BetterResume from "@/app/(sites)/manage/_components/applications/BetterResume";
import NoApplication from "@/app/(sites)/manage/_components/applications/NoApplication";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ResumeRenderProps {
  params: {
    applicationID: string;
  };
}

const Page = async ({ params }: ResumeRenderProps) => {
  const applicationID = params.applicationID;

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login/enterprises?origin=manage/applications/${applicationID}/resume`);

  const userId = session.id;
  const email = session.user?.email as string;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });

  if (!dbUser)
    redirect(`/home/login/enterprises?origin=manage/applications/${applicationID}/resume`);

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
    <div className="min-h-[calc(100vh-90px)] sm:rounded-md bg-white sm:shadow-sm pt-2 max-w-7xl px-4 pb-4 mx-auto">
      <BetterResume application={application} applicationID={applicationID} />
    </div>
  );
};

export default Page;
