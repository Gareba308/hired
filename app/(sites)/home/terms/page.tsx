import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  alternates: {
    canonical: "/home/terms",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page