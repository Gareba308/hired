import { db } from "@/db";
import React from "react";
import AllCandidates from "../_components/candidates/AllCandidates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login/enterprises?origin=manage/candidates");
  const userId = session.id;
  const email = session?.user?.email;
  if (!userId || !email) redirect("/home/login/enterprises?origin=manage/candidates");
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
  if (!dbUser) redirect("/home/login/enterprises?origin=manage/candidates");

  const isEmployer = await db.employers.findFirst({
    where: {
      employerEmail: email,
    },
    select: {
      id: true
    }
  });
  if (!isEmployer) redirect("/home/login/enterprises?origin=manage/candidates");
  const {id:isEmployerID}= isEmployer;
  const workersBio = await db.workerBio.findMany();
  const workersAbout = await db.about.findMany();
  const workersDesire = await db.workerDesires.findMany();
  const workersContact = await db.workerContact.findMany();
  const workersSkills = await db.skills.findMany();
  const workersCertification = await db.certificationLicense.findMany();
  const workersAward = await db.award.findMany();
  const workersLanguage = await db.language.findMany();
  const workersExperience = await db.experience.findMany();
  const workersSecondary = await db.secondaryEducation.findMany();
  const workersTertiary = await db.tertiaryEducation.findMany();

  const myProfileViews = await db.profileView.findMany();

  //ensure that user has both workersBio, workersAbout, workersDesire, workersContact, workersExperience, if non return null meaning they will not appear
  return (
    <>
      <div className="bg-white min-h-[calc(100vh-90px)] sm:rounded-md sm:shadow-sm max-w-7xl mx-auto px-4 pt-2 md:px-5">
        <AllCandidates
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
          userId={dbUser.id}
          myProfileViews={myProfileViews}
        />
      </div>
    </>
  );
};

export default Page;
