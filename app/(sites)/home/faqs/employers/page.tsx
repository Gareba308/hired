import React from 'react'
import { Metadata } from "next";
import FAQsEmployers from '@/components/FAQsEmployers';

export const metadata: Metadata = {
  title: "Employers FAQs",
  alternates: {
    canonical: "/home/faqs/employers",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return (
    <div>
      <FAQsEmployers />
    </div>
  )
}

export default Page