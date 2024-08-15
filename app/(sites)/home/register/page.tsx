import React from 'react'
import SignUpPage from '../_components/register/SignUpPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Job Seeker Registration",
  alternates: {
    canonical: "/home/register",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div><SignUpPage /></div>
  )
}

export default Page