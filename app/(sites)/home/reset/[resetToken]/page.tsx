import React from 'react'
import ResetPassword from '../../_components/login/ResetPassword';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset account details",
  robots: {
    index: false,
    follow: true,
  }
};

interface ResetProps{
  params: {
    resetToken: string
  }
}

const Page = async ({params}: ResetProps) => {
  const {resetToken}= params;

  const resetExists= await db.reset.findFirst({
    where: {
      resetToken: resetToken
    }
  })

  if(!resetExists) redirect('/')

  return (
    <div>
      <ResetPassword resetExists={resetExists}/>
    </div>
  )
}

export default Page