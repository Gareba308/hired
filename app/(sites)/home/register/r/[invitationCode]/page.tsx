import { db } from "@/db";
import { redirect } from "next/navigation";
import EmailReferSignUp from "../../../_components/register/EmailReferSignUp";

interface ReferralProps {
  params: {
    invitationCode: string;
  };
}

const Page = async ({ params }: ReferralProps) => {
  const { invitationCode } = params;

const referrer= await db.userReferrals.findFirst({
    where: {
        invitationCode: invitationCode
    },
})

  if(!referrer) redirect('/home/register')
  return (
    <div>
      <EmailReferSignUp referrer={referrer}/>
    </div>
  );
};

export default Page;