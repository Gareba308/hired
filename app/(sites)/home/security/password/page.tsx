import React from 'react'
import { Metadata } from "next";
import PasswordChanged from '../../_components/login/PasswordChanged';

export const metadata: Metadata = {
  title: "Password Details Changed",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/home/security/password",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div><PasswordChanged /></div>
  )
}

export default Page