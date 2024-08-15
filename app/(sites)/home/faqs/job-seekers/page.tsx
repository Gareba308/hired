import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Seekers FAQs",
  alternates: {
    canonical: "/home/faqs/job-seekers",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page