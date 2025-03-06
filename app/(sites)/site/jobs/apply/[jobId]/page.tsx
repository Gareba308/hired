import { db } from "@/db";
import NoJobs from "../../../_components/job/NoJobs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NoProfile from "../../../_components/profile/Unavailable";
import NoPortfolio from "../../../_components/portfolio/NoPortfolio";
import { differenceInMonths, differenceInYears, parse } from "date-fns";
import { Metadata } from "next";
import NewApplyJob from "../../../_components/job/NewApply";

export const metadata: Metadata = {
  title: "Submit Job Application",
};

interface Applicant {
  skills: string[];
  experienceYears: number;
  experiences: string;
  qualifications: string;
  email: string;
}

interface JobCriteria {
  desiredSkills: string[];
  desiredExperienceYears: number;
  desiredExperiences: string;
  desiredQualifications: string;
  skillsWeight: number;
  experienceWeight: number;
  qualificationsWeight: number;
}

interface ApplyJobProps {
  params: {
    jobId: string;
  };
}
export const revalidate = 60;

export async function generateStaticParams() {
  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return jobs.map((job) => ({ jobId: job.id }));
}

const Page = async ({ params }: ApplyJobProps) => {
  const { jobId } = params;

  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login?origin=site/jobs/apply/${jobId}`);

  const userId = session.id;

  const userEmail = session?.user?.email;

  if (!userId || !userEmail)
    redirect(`/home/login?origin=site/jobs/apply/${jobId}`);

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
      email: userEmail,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=site/jobs/apply/${jobId}`);

  const extractNumber = (text: string | undefined): number | null => {
    if (!text) return null;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const myAbout = await db.about.findFirst({
    where: {
      userId,
    },
  });

  if (!myAbout) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const uploadedResume = await db.resume.findFirst({
    where: {
      userId,
    },
    select: {
      resume: true,
    },
  });

  const myExperiences = await db.experience.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        stillWorking: "desc",
      },
      {
        startYear: "desc",
      },
      {
        startMonth: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  if (myExperiences.length === 0) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const secondaryEducation = await db.secondaryEducation.findFirst({
    where: {
      userId,
    },
  });

  if (!secondaryEducation) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const workerBio = await db.workerBio.findFirst({
    where: {
      userId,
    },
  });

  if (!workerBio) {
    return (
      <>
        <NoProfile />
      </>
    );
  }

  const contact = await db.workerContact.findFirst({
    where: {
      userId,
    },
  });

  if (!contact) {
    return (
      <>
        <NoProfile />
      </>
    );
  }

  const skills = await db.skills.findFirst({
    where: {
      userId,
    },
  });

  if (skills?.skills.length === 0) {
    return (
      <>
        <NoPortfolio />
      </>
    );
  }

  const myCertificates = await db.certificationLicense.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        validStartYear: "desc",
      },
      {
        validStartMonth: "desc",
      },
    ],
  });

  const myAwards = await db.award.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        awardedYear: "desc",
      },
      {
        awardedMonth: "desc",
      },
    ],
  });

  const myAcademicQualification = await db.tertiaryEducation.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        stillStudying: "desc",
      },
      {
        startYear: "desc",
      },
      {
        startMonth: "desc",
      },
    ],
  });

  const jobExists = await db.job.findFirst({
    where: {
      id: jobId,
    },
  });
  const myCareerDetails = await db.careerWizard.findFirst({
    where: {
      userId,
    },
  });

  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const jobRequired = jobs.find(
    (job) => job.id === (myCareerDetails?.jobId as string)
  );

  async function calculateTotalExperience(userId: string): Promise<number> {
    const experiences = await db.experience.findMany({
      where: {
        userId: userId,
      },
    });

    let totalExperienceYears = 0;

    for (const experience of experiences) {
      const startDate = parse(
        `${experience.startYear}-${experience.startMonth}-01`,
        "yyyy-MM-dd",
        new Date()
      );
      const endDate = experience.stillWorking
        ? new Date()
        : parse(
            `${experience.endYear}-${experience.endMonth}-01`,
            "yyyy-MM-dd",
            new Date()
          );

      const years = differenceInYears(endDate, startDate);
      const months = differenceInMonths(endDate, startDate) % 12;

      totalExperienceYears += years + months / 12;
    }

    return totalExperienceYears;
  }

  async function getTotalExperienceYears(userId: string): Promise<number> {
    try {
      const totalExperienceYears = await calculateTotalExperience(userId);
      return totalExperienceYears;
    } catch (error) {
      console.error(
        "Error calculating total experience for user with userId",
        userId + ":",
        error
      );
      throw error;
    }
  }

  const theYears = await getTotalExperienceYears(userId);

  function extractKeywords(text: string | undefined): string[] {
    if (!text) return [];
    const stopWords = [
      "a",
      "an",
      "the",
      "in",
      "on",
      "at",
      "of",
      "and",
      "or",
      "with",
      "to",
      "for",
      "by",
      "from",
    ];

    const stem = (word: string): string => {
      if (word.endsWith("ies")) return word.slice(0, -3) + "y";
      if (word.endsWith("es")) return word.slice(0, -2);
      if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
      return word;
    };

    return text
      .toLowerCase()
      .replace(/[.,]/g, "")
      .split(/\s+/)
      .filter((word) => !stopWords.includes(word))
      .map(stem);
  }

  function calculateQualificationScore(
    applicantQualifications: string,
    desiredQualifications: string
  ): number {
    const applicantKeywords = extractKeywords(applicantQualifications);
    const desiredKeywords = extractKeywords(desiredQualifications);

    const uniqueDesiredKeywords = new Set(desiredKeywords);
    const matchedKeywords = applicantKeywords.filter((keyword) =>
      uniqueDesiredKeywords.has(keyword)
    ).length;

    const matchPercentage =
      (matchedKeywords / uniqueDesiredKeywords.size) * 100;

    if (matchPercentage >= 70) {
      return 100;
    } else {
      return (matchPercentage / 70) * 100;
    }
  }

  function calculateSkillsScore(
    applicantSkills: string[],
    desiredSkills: string[]
  ): number {
    if (!desiredSkills) return 0;
    const matchedSkills = applicantSkills.filter((skill) =>
      desiredSkills.includes(skill)
    ).length;
    const matchPercentage = (matchedSkills / desiredSkills.length) * 100;

    if (matchPercentage >= 70) {
      return 100;
    } else {
      return (matchPercentage / 70) * 100;
    }
  }

  function calculateExperienceScore(
    applicantExperience: number,
    desiredExperience: number
  ): number {
    const matchPercentage = (applicantExperience / desiredExperience) * 100;

    if (matchPercentage >= 70) {
      return 100;
    } else {
      return (matchPercentage / 70) * 100;
    }
  }

  function calculateApplicationScore(
    applicant: Applicant,
    jobCriteria: JobCriteria
  ): number {
    const qualificationScore = calculateQualificationScore(
      applicant.qualifications,
      jobCriteria.desiredQualifications
    );
    const skillsScore = calculateSkillsScore(
      applicant.skills,
      jobCriteria.desiredSkills
    );
    const experienceScore = calculateExperienceScore(
      applicant.experienceYears,
      jobCriteria.desiredExperienceYears
    );

    const totalScore =
      qualificationScore * jobCriteria.qualificationsWeight +
      skillsScore * jobCriteria.skillsWeight +
      experienceScore * jobCriteria.experienceWeight;
    return totalScore;
  }

  const qualifications = [
    myAcademicQualification
      .map(
        (qual) =>
          `${qual.programArea} ${qual.field} ${qual.activities} ${qual.grade}`
      )
      .join(", "),
    myCertificates
      .map((cert) => `${cert.certificateLicenseName}: ${cert.description}`)
      .join(", "),
    myAwards.map((award) => `${award.title}: ${award.description}`).join(", "),
    myAbout?.about ?? "",
  ].join(". ");

  const experiences = [
    myExperiences.map((exp) => exp.description).join(", "),
    myAwards.map((award) => `${award.title}: ${award.description}`).join(", "),
    myAbout?.about ?? "",
  ].join(". ");

  const myApplicant: Applicant = {
    skills: skills?.skills ?? [],
    experienceYears: theYears,
    experiences: experiences,
    qualifications: qualifications,
    email: dbUser.email,
  };

  const myJobCriteria: JobCriteria = {
    desiredSkills: jobRequired?.personal_skills ?? [],
    desiredExperienceYears:
      extractNumber(jobRequired?.experience as string) ?? 0,
    desiredExperiences: jobRequired?.responsibilities ?? "",
    desiredQualifications: jobRequired?.requirement ?? "",
    skillsWeight: 0.3,
    experienceWeight: 0.3,
    qualificationsWeight: 0.4,
  };
  const applicationScore = calculateApplicationScore(
    myApplicant,
    myJobCriteria
  );

  if (!jobExists) {
    return (
      <>
        <NoJobs />
      </>
    );
  }

  const assessmentIds = [
    jobExists?.assessmentOneID,
    jobExists?.assessmentTwoID,
    jobExists?.bonusTestID,
  ].filter((id): id is string => id !== null && id !== undefined);

  const assessmentsPicked = await db.assessmentBanner.findMany({
    where: {
      id: {
        in: assessmentIds,
      },
    },
  });

  const myAcceptedAssessments = await db.acceptToBeAssessed.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  const companyOfJob = await db.company.findFirst({
    where: {
      id: jobExists.companyId,
    },
  });
  if (!companyOfJob) redirect("/site/jobs");

  const resumeUrl =
    uploadedResume && uploadedResume.resume ? uploadedResume.resume : null;
  return (
    <div className="space-y-6 pb-2 max-w-7xl mx-auto min-h-[calc(100vh-80px)] bg-white px-4 md:px-6 text-gray-700 rounded-lg shadow-sm">
      <NewApplyJob
        job={jobExists}
        user={dbUser}
        banners={assessmentsPicked}
        assessmentIds={assessmentIds}
        acceptedAssessments={myAcceptedAssessments}
        resume={resumeUrl}
      />
    </div>
  );
};

export default Page;
