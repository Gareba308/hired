import { db } from "@/db";
import { redirect } from "next/navigation";

interface InviteLinkProps {
  params: {
    invitationCode: string;
  };
}

const Page = async ({ params }: InviteLinkProps) => {
  const { invitationCode } = params;
  if (!invitationCode) redirect("/");
  const codeExists = await db.userReferrals.findFirst({
    where: {
        invitationCode
    },
    select: {
        uniqueCode: true
    }
  })

  if (!codeExists) redirect("/");

  redirect (`/home/register/r/${invitationCode}`)
};

export default Page;