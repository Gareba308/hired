import { db } from "@/db";
import ReferSignUpPage from "../../../_components/register/ReferSignUpPage";
import { redirect } from "next/navigation";
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
    referralCode: string;
  };
}

const Page = async ({ params }: ReferralProps) => {
  const { referralCode } = params;
  const referrer = await db.user.findFirst({
    where: {
      referralCode: referralCode,
    },
    select: {
      email: true,
      name: true,
      id: true,
      role: true,
    },
  });
  if (!referrer) redirect("/");
  return (
    <div>
      <ReferSignUpPage
        referrer={referrer}
        referrerUniqueCode={referralCode}
      />
    </div>
  );
};

export default Page;
