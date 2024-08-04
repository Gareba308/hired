import { db } from "@/db";
import ReferSignUpPage from "../../../_components/register/ReferSignUpPage";
import { redirect } from "next/navigation";

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
  if (!referrer) redirect("/home/register");
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
