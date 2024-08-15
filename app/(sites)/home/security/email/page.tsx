import React from 'react'
import EmailChanged from '../../_components/login/EmailChanged'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Email Details Changed",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/home/security/email",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div><EmailChanged /></div>
  )
}

export default Page