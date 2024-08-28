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
      `/home/login/enterprises?origin=manage/applications/${applicationID}/tests`
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
      `/home/login/enterprises?origin=manage/applications/${applicationID}/tests`
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

  const job= await db.job.findFirst({
    where: {
      id: application.jobId
    }
  })

  const bannerIds = [
    job?.assessmentOneID,
    job?.assessmentTwoID,
  ].filter((id): id is string => id !== null && id !== undefined);


  const applicantAssessmentResults= await db.acceptToBeAssessed.findMany({
    where: {
      userId: application.userId,
      isWorkerID: application.isWorkerID,
      testId: {
        in: bannerIds
      },
      status: {
        notIn: ["UNINITIATED", "INITIATED"]
      }
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      testName: true,
      testCategory: true,
      myAttempts: true,
      completeTime: true,
      status: true,
      score: true,
      createdAt: true,
      updatedAt: true
    }
  })
  return (
    <div className="min-h-[calc(100vh-90px)] sm:rounded-md  pt-2 bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto">
      <BetterUploaded
        application={application}
        applicationID={applicationID}
        applicantAssessmentResults={applicantAssessmentResults}
      />
    </div>
  );
};

export default Page;
