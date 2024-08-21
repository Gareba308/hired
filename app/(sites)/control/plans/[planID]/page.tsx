import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PlanEdit from "../../_components/plans/PlanEdit";
interface PlanEditProps {
  params: {
    planID: string;
  };
}
export const revalidate = 60;
export async function generateStaticParams() {
  const plans = await db.employerPlans.findMany();

  return plans.map((plan) => ({ planID: plan.id }));
}

const Page = async ({ params }: PlanEditProps) => {
  const { planID } = params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/home/login?origin=control/plans/${planID}`);
  const userId = session?.id;
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=control/plans/${planID}`);

  const planExists = await db.employerPlans.findFirst({
    where: {
      id: planID,
    },
  });

  if (!planExists) redirect(`/control/plans?origin=control/plans/${planID}`);
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <PlanEdit plan={planExists} />
    </div>
  );
};

export default Page;
