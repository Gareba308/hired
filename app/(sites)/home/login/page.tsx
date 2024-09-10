import React from "react";
import SigninPageJobSeeker from "../_components/login/SigninPageJobSeeker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login for Top Jobs & Career Opportunities",
  description: "Discover the latest job vacancies in Kenya. Apply for career opportunities & recruitment listings. Sign up free, explore companies, and grow your career.",
  keywords: [
    "jobs in Kenya",
    "Kenya job vacancies",
    "job opportunities Kenya",
    "online jobs Kenya",
    "latest jobs in Kenya",
    "jobs Nairobi",
    "Kenya job search",
    "employment opportunities Kenya",
    "Kenya career opportunities",
    "find jobs in Kenya",
  ],
  authors: [
    {
      name: "Hired",
      url: "https://www.hired.co.ke",
    },
  ],
  creator: "Hired",
  alternates: {
    canonical: "/home/login",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <SigninPageJobSeeker />
    </div>
  );
};

export default Page;
