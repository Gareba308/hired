import { db } from "@/db";
import NoEmail from "../../_components/errors/email/NoEmail";
import NoDbUser from "../../_components/errors/email/NoDbUser";
import TokenNoExist from "../../_components/errors/email/TokenNoExist";
import Failed from "../../_components/errors/email/Failed";
import TokenExpired from "../../_components/errors/email/TokenExpired";
import { redirect } from "next/navigation";

interface VerifyTokenProps {
  params: {
    verifyToken: string;
  };
}

const Page = async ({ params }: VerifyTokenProps) => {
  const { verifyToken } = params;

  const tokenExists = await db.updateEmailVerify.findFirst({
    where: {
      verifyToken,
    },
  });

  if (!tokenExists) {
    return(
      <>
        <TokenNoExist />
      </>
    )
  }

  const { userId, verifyTokenExpiry, newEmail } = tokenExists;

  if (!newEmail) {
    return(
      <>
        <NoEmail />
      </>
    );
  }

  const userInDb = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!userInDb) {
    return(
      <>
        <NoDbUser />
      </>
    );
  }

  if (verifyTokenExpiry < new Date()) {
    return (
      <>
      <TokenExpired />
      </>
    );
  }

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      email: newEmail,
    },
  });

  const isCompleted= await db.updateEmailVerify.delete({
    where: {
      verifyToken,
      userId,
    },
  });

  if(isCompleted){
     redirect('/home/security/email')
    }else{
     return(
      <>
        <Failed />
      </>
     )
    }
};

export default Page;