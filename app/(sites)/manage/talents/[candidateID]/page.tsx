import { db } from "@/db";
import { redirect } from "next/navigation";
import CandidateDetails from "../../_components/candidates/CandidateDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface CandidateIDProps {
  params: {
    candidateID: string;
  };
}
export const dynamicParams = true;
export const revalidate = 60;
export async function generateStaticParams() {
  const candidates = await db.user.findMany({
    where: {
      role: {
        equals: "worker",
      },
    },
    select: {
      id: true
    }
  });

  return candidates.map((candidate) => ({
    candidateID: candidate.id.slice(0, 500),
  }));
}

const Page = async ({ params }: CandidateIDProps) => {
  const { candidateID } = params;
  const candidateAvailable = await db.user.findFirst({
    where: {
      id: candidateID,
    },
  });

  if (!candidateAvailable) redirect("/manage/talents");

  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login/enterprises?origin=manage/talents/${candidateID}`);
  const userId = session.id;
  if (!userId)
    redirect(`/home/login/enterprises?origin=manage/talents/${candidateID}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!dbUser)
    redirect(`/home/login/enterprises?origin=manage/talents/${candidateID}`);

  const workersBio = await db.workerBio.findFirst({
    where: {
      userId: candidateID,
    },
  });
  const bioId = workersBio?.id as string;
  const workersAbout = await db.about.findFirst({
    where: {
      userId: candidateID,
    },
  });
  const workersDesire = await db.workerDesires.findFirst({
    where: {
      userId: candidateID,
    },
  });
  const workersContact = await db.workerContact.findFirst({
    where: {
      userId: candidateID,
    },
  });
  const workersSkills = await db.skills.findFirst({
    where: {
      userId: candidateID,
    },
  });
  const workersCertification = await db.certificationLicense.findMany({
    where: {
      userId: candidateID,
    },
    orderBy: [
      {
        validStartYear: 'desc',
      },
      {
        validStartMonth: 'desc',
      },
    ],
  });
  const workersAward = await db.award.findMany({
    where: {
      userId: candidateID,
    },
    orderBy: [
      {
        awardedYear: 'desc',
      },
      {
        awardedMonth: 'desc',
      }
    ],
  });
  const workersLanguage = await db.language.findMany({
    where: {
      userId: candidateID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const workersExperience = await db.experience.findMany({
    where: {
      userId: candidateID,
    },
    orderBy: [
      {
        stillWorking: 'desc',
      },
      {
        startYear: 'desc',
      },
      {
        startMonth: 'desc',
      },
      {
        createdAt: 'desc',
      }
    ],
  });
  const workersSecondary = await db.secondaryEducation.findFirst({
    where: {
      userId: candidateID,
    },
  });
  const workersTertiary = await db.tertiaryEducation.findMany({
    where: {
      userId: candidateID,
    },
    orderBy: [
      {
        stillStudying: 'desc',
      },
      {
        startYear: 'desc',
      },
      {
        startMonth: 'desc',
      }
    ],
  });

  const candidateThumbed = await db.thumbsUp.findFirst({
    where: {
      userId,
      bioID: bioId,
    },
  });

  const myCompany= await db.company.findFirst({
    where: {
      userId: dbUser.id
    },
    select: {
      verified: true
    }
  })

  const iAmVerified= myCompany?.verified === true
  return (
    <div>
      <CandidateDetails
        candidateID={candidateID}
        workersBio={workersBio}
        workersAbout={workersAbout}
        workersDesire={workersDesire}
        workersContact={workersContact}
        workersSkills={workersSkills}
        workersCertification={workersCertification}
        workersAward={workersAward}
        workersLanguage={workersLanguage}
        workersExperience={workersExperience}
        workersSecondary={workersSecondary}
        workersTertiary={workersTertiary}
        candidateThumbed={candidateThumbed}
        iAmVerified={iAmVerified}
      />
    </div>
  );
};

export default Page;
