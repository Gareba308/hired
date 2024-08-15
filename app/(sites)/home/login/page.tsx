import React from 'react'
import SigninPageJobSeeker from '../_components/login/SigninPageJobSeeker'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Job Seekers Login",
  alternates: {
    canonical: "/home/login",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div><SigninPageJobSeeker /></div>
  )
}

export default Page