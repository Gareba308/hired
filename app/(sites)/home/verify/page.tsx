import React from 'react'
import VerifyForgotPassword from '../_components/login/Verification'
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Account Verification",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/home/verify",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div><VerifyForgotPassword /></div>
  )
}

export default Page