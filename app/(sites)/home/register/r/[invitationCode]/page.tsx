import { db } from "@/db";
import { redirect } from "next/navigation";
import EmailReferSignUp from "../../../_components/register/EmailReferSignUp";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Registration On Invitation",
  robots: {
    index: false,
    follow: true,
  }
}

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

  if(!referrer) redirect('/')
  return (
    <div>
      <EmailReferSignUp referrer={referrer}/>
    </div>
  );
};

export default Page;