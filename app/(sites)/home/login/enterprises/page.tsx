import React from 'react';
import { Metadata } from 'next'
import SigninPageEmployer from '../../_components/login/SigninPageEmployer';

export const metadata: Metadata = {
  title: "Employers Login",
  alternates: {
    canonical: "/home/login/enterprises",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div><SigninPageEmployer /></div>
  )
}

export default Page