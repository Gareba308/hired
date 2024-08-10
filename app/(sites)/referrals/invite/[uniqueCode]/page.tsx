import { db } from "@/db";
import { redirect } from "next/navigation";

interface InviteLinkProps {
  params: {
    uniqueCode: string;
  };
}

const Page = async ({ params }: InviteLinkProps) => {
  const { uniqueCode } = params;
  if (!uniqueCode) redirect("/");
  const codeExists = await db.user.findFirst({
    where: {
      referralCode: uniqueCode,
    },
  });

  if (!codeExists) redirect("/");

  redirect (`/home/register/ref/${uniqueCode}`)
};

export default Page;
