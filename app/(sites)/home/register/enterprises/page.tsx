import React from 'react'
import SignUpPage1 from '../../_components/register/SignUpPage1'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Employer Registration",
  alternates: {
    canonical: "/home/register/enterprises",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div><SignUpPage1 /> </div>
  )
}

export default Page