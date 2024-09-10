import React from "react";
import SignUpPage1 from "../../_components/register/SignUpPage1";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register, Advertise Jobs & Recruit in Kenya",
  description: "Post job openings and find top talent on Hired - Kenya's premier job board. Advertise your vacancies and streamline your hiring process in Kenya today!",
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
