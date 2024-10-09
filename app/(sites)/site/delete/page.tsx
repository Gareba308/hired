import React from "react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NoPortfolio from "../_components/documents/NoPortfolio";
import NoProfile from "../_components/documents/NoProfile";
import DocumentsRenderPdf from "../_components/documents/DocumentsRenderPdf";

const PdfDocument = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/home/login?origin=site/documents");

  const userId = session.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/documents");

  const about = await db.about.findFirst({
    where: {
      userId: dbUser.id,
    },
  });

  if (!about) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const experiences = await db.experience.findMany({
    where: {
      userId: dbUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (experiences.length === 0) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const secondary = await db.secondaryEducation.findFirst({
    where: {
      userId: dbUser.id,
    },
  });

  if (!secondary) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const tertiary = await db.tertiaryEducation.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  const bio = await db.workerBio.findFirst({
    where: {
      userId: dbUser.id,
    },
  });

  if (!bio) {
    return (
      <>
        <NoProfile />
      </>
    );
  }

  const contact = await db.workerContact.findFirst({
    where: {
      userId: dbUser.id,
    },
  });

  if (!contact) {
    return (
      <>
        <NoProfile />
      </>
    );
  }

  const resume = await db.resume.findFirst({
    where: {
      userId: dbUser.id,
    },
  });

  const skills = await db.skills.findFirst({
    where: {
      userId: dbUser.id,
    },
  });

  if (skills?.skills.length === 0) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const awards = await db.award.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  const certification = await db.certificationLicense.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  const languages = await db.language.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  const combinedData = {
    dbUser,
    about,
    experiences,
    secondary,
    tertiary,
    bio,
    contact,
    resume,
    skills,
    awards,
    certification,
    languages,
  };
  return (
    <>
      <DocumentsRenderPdf document={combinedData} />
    </>
  );
};

export default PdfDocument;
