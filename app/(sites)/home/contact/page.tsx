import React from "react";
import { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: {
    canonical: "/home/contact",
    languages: {
      "en-US": "/en-US",
    },
  },
  keywords: [
    "Talk to Hired Kenya",
    "Contact Hired jobs Kenya",
    "Information Hired",
    "Help",
    "Job openings in Kenya",
    "Jobs help",
    "Search jobs Kenya",
    "Kenya recruitment",
    "Career help",
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
