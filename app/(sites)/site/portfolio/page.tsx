import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Competence from "../_components/portfolio/Competence";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login?origin=site/portfolio");

  const userId = session.id;

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/home/login?origin=site/portfolio");

  const about = await db.about.findFirst({
    where: {
      userId,
    },
  });

  const skills= await db.skills.findFirst({
    where: {
      userId
    }
  })

  const resume= await db.resume.findFirst({
    where:{
      userId
    }
  })

  const certification= await db.certificationLicense.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const awards= await db.award.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const languages= await db.language.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return (
    <div className="space-y-4 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] sm:rounded-lg prose pt-4 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base shadow-sm">
      <Competence
        about={about}
        resume= {resume}
        skills={skills}
        certification={certification}
        awards={awards}
        languages= {languages}
      />
    </div>
  );
};

export default Page;