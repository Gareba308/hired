import React from "react";
import SignUpPage1 from "../../_components/register/SignUpPage1";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Registration",
  keywords: [
    "Kenya hiring platform",
    "Kenya staffing services",
    "Kenya recruitment agency",
    "Kenya job portal for employers",
    "Kenya employee recruitment",
    "Kenya talent sourcing",
    "Kenya workforce recruitment",
    "Kenya HR recruitment",
    "Kenya job advertising",
    "Kenya job listing site",
    "Kenya employer job board",
  ],
  authors: [
    {
      name: "Hired",
      url: "https://www.hired.co.ke",
    },
  ],
  creator: "Hired",
  alternates: {
    canonical: "/home/register/enterprises",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <SignUpPage1 />{" "}
    </div>
  );
};

export default Page;
