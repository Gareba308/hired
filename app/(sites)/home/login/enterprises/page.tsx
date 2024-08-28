import React from "react";
import { Metadata } from "next";
import SigninPageEmployer from "../../_components/login/SigninPageEmployer";

export const metadata: Metadata = {
  title: "Employers Login",
  keywords: [
    "Kenya recruitment services",
    "Kenya job board for employers",
    "recruitment platform Kenya",
    "hire employees Kenya",
    "Kenya talent acquisition",
    "online recruitment Kenya",
    "job posting site Kenya",
    "post jobs in Kenya",
    "find candidates Kenya",
    "Kenya recruitment solutions",
  ],
  authors: [
    {
      name: "Hired",
      url: "https://www.hired.co.ke",
    },
  ],
  creator: "Hired",
  alternates: {
    canonical: "/home/login/enterprises",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <SigninPageEmployer />
    </div>
  );
};

export default Page;
