import React from 'react'
import ResendEmail from '../_components/register/ResendEmail'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registered user awaiting email resend confirmation",
  alternates: {
    canonical: "/home/resend",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div><ResendEmail /></div>
  )
}

export default Page