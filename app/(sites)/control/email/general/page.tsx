import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import GeneralEmail from "../../_components/emailing/GeneralEmail";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=control/emailing");
  const userId = session.id;
  const email = session.user?.email;
  if (!userId || !email) redirect("/home/login?origin=control/emailing");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email,
    },
  });
  if (!dbUser) redirect("/home/login?origin=control/emailing");

  const allWorkersBio = await db.workerBio.findMany({
    select: { userId: true },
  });
  const allWorkersDesires = await db.workerDesires.findMany({
    select: { userId: true },
  });
  const allWorkersContact = await db.workerContact.findMany({
    select: { userId: true },
  });

  const allWorkersBioUserIds = new Set(allWorkersBio.map((bio) => bio.userId));
  const allWorkersDesiresUserIds = new Set(
    allWorkersDesires.map((desires) => desires.userId)
  );
  const allWorkersContactUserIds = new Set(
    allWorkersContact.map((contact) => contact.userId)
  );

  const userProfileIdSets = [
    new Set(allWorkersBioUserIds),
    new Set(allWorkersDesiresUserIds),
    new Set(allWorkersContactUserIds),
  ];

  const commonProfileUserIds = userProfileIdSets.reduce(
    (intersection, currentSet) => {
      if (intersection.size === 0) {
        return currentSet;
      }
      return new Set(
        Array.from(intersection).filter((userId) => currentSet.has(userId))
      );
    },
    new Set()
  );

  const emailedOnIncompleteProfile = await db.emailWorkerGeneral.findMany({
    where: {
      reason: {
        equals: "Incomplete profile",
      },
    },
    select: {
      emailedUserIds: true,
    },
  });

  const emailedOnIncompleteProfileUserIds = emailedOnIncompleteProfile.flatMap(
    (profile) => profile.emailedUserIds
  );

  const userIncompleteProfile = await db.user.findMany({
    where: {
      AND: [
        {
          id: {
            notIn: Array.from(commonProfileUserIds),
          },
        },
        {
          id: {
            notIn: Array.from(emailedOnIncompleteProfileUserIds),
          },
        },
      ],
      role: {
        equals: "worker",
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const allWorkersSkills = await db.skills.findMany({
    select: { userId: true },
  });
  const allWorkersAbout = await db.about.findMany({ select: { userId: true } });
  const allWorkersExperience = await db.experience.findMany({
    select: { userId: true },
  });
  const allWorkersSecondaryEducation = await db.secondaryEducation.findMany({
    select: { userId: true },
  });
  const allWorkersTertiaryEducation = await db.tertiaryEducation.findMany({
    select: { userId: true },
  });
  const allWorkersResume = await db.resume.findMany({
    select: { userId: true },
  });

  const allWorkersSkillsUserIds = new Set(
    allWorkersSkills.map((skills) => skills.userId)
  );
  const allWorkersAboutUserIds = new Set(
    allWorkersAbout.map((about) => about.userId)
  );
  const allWorkersExperienceUserIds = new Set(
    allWorkersExperience.map((item) => item.userId)
  );
  const allWorkersSecondaryEducationUserIds = new Set(
    allWorkersSecondaryEducation.map((item) => item.userId)
  );
  const allWorkersTertiaryEducationUserIds = new Set(
    allWorkersTertiaryEducation.map((item) => item.userId)
  );
  const allWorkersResumeUserIds = new Set(
    allWorkersResume.map((item) => item.userId)
  );
  const userIdSets = [
    new Set(allWorkersSkillsUserIds),
    new Set(allWorkersAboutUserIds),
    new Set(allWorkersExperienceUserIds),
    new Set(allWorkersSecondaryEducationUserIds),
    new Set(allWorkersTertiaryEducationUserIds),
    new Set(allWorkersResumeUserIds),
  ];

  const commonUserIds = userIdSets.reduce((intersection, currentSet) => {
    if (intersection.size === 0) {
      return currentSet;
    }
    return new Set(
      Array.from(intersection).filter((userId) => currentSet.has(userId))
    );
  }, new Set());

  const emailedOnIncompletePortfolio = await db.emailWorkerGeneral.findMany({
    where: {
      reason: {
        equals: "Incomplete portfolio",
      },
    },
    select: {
      emailedUserIds: true,
    },
  });

  const emailedOnIncompletePortfolioUserIds =
    emailedOnIncompletePortfolio.flatMap((profile) => profile.emailedUserIds);

  const userIncompletePortfolio = await db.user.findMany({
    where: {
      AND: [
        {
          id: {
            notIn: Array.from(commonUserIds),
          },
        },
        {
          id: {
            notIn: Array.from(emailedOnIncompletePortfolioUserIds),
          },
        },
      ],
      role: {
        equals: "worker",
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const wantNotEmailed = await db.workerDesires.findMany({
    where: {
      noEmails: true,
    },
    select: {
      userId: true,
    },
  });
  const wantNotEmailedUserId = wantNotEmailed.flatMap((item) => item.userId);
  const allWorkersForGeneralEmails = await db.user.findMany({
    where: {
      role: {
        equals: "worker",
      },
      id: {
        notIn: wantNotEmailedUserId,
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const allGeneralEmailed = await db.emailWorkerGeneral.findMany();
  const latestSevenOnGeneral = allGeneralEmailed.slice(0, 3);
  const finalGeneralDataCounts = latestSevenOnGeneral.map((item) => ({
    id: item.id,
    reason: item.reason,
    emailedUserIdsCount: item.emailedUserIds.length,
    createdAt: item.createdAt,
  }));

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-100px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <GeneralEmail
        allWorkersForGeneralEmails={allWorkersForGeneralEmails}
        userIncompleteProfile={userIncompleteProfile}
        userIncompletePortfolio={userIncompletePortfolio}
        finalDataCounts={finalGeneralDataCounts}
      />
    </div>
  );
};

export default Page;
