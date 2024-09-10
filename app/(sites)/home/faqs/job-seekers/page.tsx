import React from 'react'
import { Metadata } from "next";
import FAQsJobSeekers from '@/components/FAQSJobSeekers';

export const metadata: Metadata = {
  title: "Job Seekers FAQs",
  description: "Find top job listings and career opportunities on Kenya's best job board. Search for jobs, apply easily, and advance your career with our platform.",
  keywords: [
    "job board in Kenya",
    "job listings in Kenya",
    "career opportunities in Kenya",
    "employment opportunities in Kenya",
    "job search in Kenya",
    "recruitment platforms in Kenya",
    "find jobs in Kenya",
    "job vacancies in Kenya",
    "hiring now in Kenya",
    "career portal in Kenya",
    "job openings in Kenya",
  ],
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