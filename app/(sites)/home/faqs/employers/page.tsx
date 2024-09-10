import React from "react";
import { Metadata } from "next";
import FAQsEmployers from "@/components/FAQsEmployers";

export const metadata: Metadata = {
  title: "Employers FAQs",
  description:
    "Post jobs and recruit top talent with Kenya's leading job board. Advertise vacancies and streamline hiring with our premier recruitment platform.",
  keywords: [
    "recruitment in Kenya",
    "hiring in Kenya",
    "job board Kenya",
    "post jobs Kenya",
    "find talent Kenya",
    "recruitment solutions Kenya",
    "Kenya employment opportunities",
    "advertise vacancies Kenya",
    "talent pool Kenya",
    "recruitment platform Kenya",
  ],
  alternates: {
    canonical: "/home/faqs/employers",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <FAQsEmployers />
    </div>
  );
};

export default Page;
