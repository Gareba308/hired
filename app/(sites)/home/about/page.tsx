import React from "react";
import { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About Us",
  description: "Post and find jobs on Kenya's leading job board. Discover top talent, advertise vacancies, and find your dream job all in one place.",
  keywords: [
    "creative jobs Kenya",
    "agriculture jobs Kenya",
    "real estate jobs Kenya",
    "tourism jobs Kenya",
    "aviation jobs Kenya",
    "retail jobs Kenya",
    "Kenya job board",
    "Kenya recruitment marketplace",
    "Kenya hiring solutions",
    "Kenya job market",
    "Kenya job board posting",
    "Kenya job portal recruitment",
  ],
  authors: [
    {
      name: "Hired",
      url: "https://www.hired.co.ke",
    },
  ],
  creator: "Hired",
  alternates: {
    canonical: "/home/about",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <About />
    </div>
  );
};

export default Page;
