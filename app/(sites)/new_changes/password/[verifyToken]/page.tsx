import { db } from "@/db"
import TokenNoExist from "../../_components/errors/password/TokenNoExist"
import NoPassword from "../../_components/errors/password/NoPassword"
import NoDbUser from "../../_components/errors/password/NoDbUser"
import TokenExpired from "../../_components/errors/password/TokenExpired"
import { redirect } from "next/navigation"
import Failed from "../../_components/errors/password/Failed"

interface PasswordVerificationProps{
  params: {
    verifyToken: string
  }
}

const Page = async ({params}: PasswordVerificationProps) => {

  const {verifyToken}= params

  const tokenExists= await db.updatePasswordVerify.findFirst({
    where: {
      verifyToken
    }
  })

  if(!tokenExists) {
    return (
      <>
        <TokenNoExist />
      </>
    )
  }

  const {userId, verifyTokenExpiry, newPassword}= tokenExists

  if(!newPassword){
    return(
      <>
        <NoPassword />
      </>
    )
  }

  const dbUser= await db.user.findFirst({
    where: {
      id: userId
    }
  })

  if(!dbUser){
    return(
      <>
        <NoDbUser />
      </>
    )
  }

  if(verifyTokenExpiry < new Date()){
    return (
      <>
        <TokenExpired />
      </>
    )
  }

  await db.user.update({
    where: {
      id: userId
    },
    data: {
      password: newPassword
    }
  })

  const isCompleted= await db.updatePasswordVerify.delete({
    where: {
      verifyToken,
      userId
    }
  })
  if(isCompleted){
    redirect('/home/security/password')
  }else{
    return (
      <>
        <Failed />
      </>
    )
  }
}

export default Page
