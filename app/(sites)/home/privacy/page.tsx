import React from 'react';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "The Privacy Policy",
  alternates: {
    canonical: "/home/privacy",
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