import { db } from "@/db";
import React from "react";
import NoAllBlogs from "../../_components/blogs/NoBlogs";
import AllBlogs from "../../_components/blogs/AllBlogs";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import Footer from "@/components/Footer";

export const revalidate = 0;
async function getBlogs() {
  const blogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
      hide: {
        equals: true
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs;
}

export const metadata: Metadata = {
  title: {
    absolute: "Finding Jobs in Kenya, Essential Career Insights",
  },
  keywords: [
    "hiring now in Kenya",
    "career portal in Kenya",
    "job openings in Kenya",
    "job seekers in Kenya",
    "recruit talent in Kenya",
    "apply for jobs in Kenya",
    "job postings in Kenya",
    "job market in Kenya",
    "talent acquisition in Kenya",
    "job opportunities Kenya",
  ],
  description:
    "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: {
      absolute: "Finding Jobs in Kenya, Essential Career Insights",
    },
    description:
      "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogWorkerBlogs,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  alternates: {
    canonical: "/home/blogs/job-seekers",
    languages: {
      "en-US": "/en-US",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: {
      absolute: "Finding Jobs in Kenya, Essential Career Insights",
    },
    description:
      "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
    images: [
      {
        url: siteConfig.ogWorkerBlogs,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    creator: "@hiredke",
    site: "@hiredke",
  },
};

export default async function Page() {
  const blogs = await getBlogs();
  return (
    <>
      <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700">
        {blogs.length > 0 ? <AllBlogs blogs={blogs} /> : <NoAllBlogs />}
      </div>
      <Footer />
    </>
  );
}
