import React from "react";
import DisplayInvoice from "../../_components/transactions/DisplayInvoice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
interface PurchaseProps {
  params: {
    purchaseID: string;
  };
}

const Page = async ({ params }: PurchaseProps) => {
  const { purchaseID } = params;
  const purchaseExists = await db.purchaseJobPlan.findFirst({
    where: {
      id: purchaseID,
    },
  });

  if (!purchaseExists) redirect(`/manage/transactions/account`);
  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=manage/transactions/${purchaseID}`);

  const dbUser = await db.user.findFirst({
    where: {
      id: session.id,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=manage/transactions/${purchaseID}`);

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <DisplayInvoice purchase={purchaseExists}/>
    </div>
  );
};

export default Page;
