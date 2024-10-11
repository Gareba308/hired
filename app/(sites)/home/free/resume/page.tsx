import React from "react";
import Resume from "@/components/Resume";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    absolute: "Create Free, Professional PDF Resumes in Minutes | Hired",
  },
  description:
    "Generate high-quality, free PDF resumes with ease on Hired. Boost your job search in Kenya with our user-friendly resume builder. Get started now!",
  keywords: [
    "free resume maker",
    "create PDF resume",
    "professional CV",
    "resume builder",
    "free resume template",
    "Kenya job seekers",
    "online resume",
    "resume for jobs",
    "easy CV creation",
    "quick resume tool",
    "high-quality PDF resume",
  ],
  authors: [
    {
      name: "Hired Jobs In Kenya",
      url: "https://www.hired.co.ke",
    },
  ],
  creator: "Hired Jobs In Kenya",
  alternates: {
    canonical: "/home/free/resume",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: {
      absolute: "Create Free, Professional PDF Resumes in Minutes | Hired",
    },
    description:
      "Generate high-quality, free PDF resumes with ease on Hired. Boost your job search in Kenya with our user-friendly resume builder. Get started now!",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      absolute: "Create Free, Professional PDF Resumes in Minutes | Hired",
    },
    description:
      "Generate high-quality, free PDF resumes with ease on Hired. Boost your job search in Kenya with our user-friendly resume builder. Get started now!",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    creator: "@hiredke",
    site: "@hiredke",
  },
};

const Page = () => {
  return (
    <div>
      <Resume />
    </div>
  );
};

export default Page;
