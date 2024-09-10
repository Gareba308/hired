import React from "react";
import { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Explore Kenya's top job board for posting jobs and finding candidates. Advertise openings, discover career opportunities, and connect with top talent.",
  alternates: {
    canonical: "/home/contact",
    languages: {
      "en-US": "/en-US",
    },
  },
  keywords: [
    "Job listings in Kenya",
    "Contact Hired jobs Kenya",
    "Apply for jobs in Kenya",
    "Find jobs in Kenya",
    "Job openings in Kenya",
    "Career opportunities in Kenya",
    "Search jobs Kenya",
    "Kenya recruitment",
    "Hiring now in Kenya",
    "Latest Kenyan job opportunities",
  ],
};

const Page = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default Page;
