import React from 'react'
import { Metadata } from "next";
import FAQsJobSeekers from '@/components/FAQSJobSeekers';

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
    <div>
      <FAQsJobSeekers />
    </div>
  )
}

export default Page