import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ExperiencePortfolio from "../../_components/portfolio/ExperiencePortfolio";

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

  const experiences = await db.experience.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] sm:rounded-lg prose pt-4 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base shadow-sm">
      <ExperiencePortfolio
        experiences={experiences}
      />
    </div>
  );
};

export default Page;