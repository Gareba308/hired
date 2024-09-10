import React from "react";
import SignUpPage from "../_components/register/SignUpPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register & Find Your Dream Job in Kenya",
  description: "Find top job listings in Kenya. Apply for the latest vacancies, career growth opportunities & recruitment openings. Sign up free and start your career journey.",
  keywords: [
    "jobs in Kenya",
    "Kenya job vacancies",
    "Kenya recruitment",
    "part-time jobs Kenya",
    "full-time jobs Kenya",
    "internships Kenya",
    "graduate jobs Kenya",
    "professional jobs Kenya",
    "NGO jobs Kenya",
    "government jobs Kenya",
    "IT jobs Kenya",
  ],
  authors: [
    {
      name: "Hired",
      url: "https://www.hired.co.ke",
    },
  ],
  creator: "Hired",
  alternates: {
    canonical: "/home/register",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <SignUpPage />
    </div>
  );
};

export default Page;
