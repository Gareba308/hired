import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import DisplayReceipt from "../../../_components/transactions/DisplayReceipt";
interface ReceiptProps {
  params: {
    receiptID: string;
  };
}

const Page = async ({ params }: ReceiptProps) => {
  const { receiptID } = params;
  const receiptExists = await db.payment.findFirst({
    where: {
      id: receiptID,
    },
  });

  if (!receiptExists) redirect(`/manage/transactions`);
  const session = await getServerSession(authOptions);
  if (!session)
    redirect(`/home/login?origin=manage/transactions/receipt/${receiptID}`);

  const dbUser = await db.user.findFirst({
    where: {
      id: session.id,
    },
  });

  if (!dbUser) redirect(`/home/login?origin=manage/transactions/receipt/${receiptID}`);

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <DisplayReceipt receipt={receiptExists}/>
    </div>
  );
};

export default Page;