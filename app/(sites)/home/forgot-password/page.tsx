import React from 'react'
import ForgotPassword from '../_components/login/ForgotPassword'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Account Password",
  alternates: {
    canonical: "/home/forgot-password",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div>
      <ForgotPassword />
    </div>
  )
}

export default Page