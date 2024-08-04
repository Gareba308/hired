import { db } from "@/db";
import React from "react";
import NoAllBlogs from "../../_components/blogs/NoBlogs";
import AllBlogs from "../../_components/blogs/AllBlogs";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Job Search Blogs",
  description:
    "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Job Search Blogs",
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
    title: "Job Search Blogs",
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

const Page = async () => {
  const workerBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {workerBlogs.length === 0 ? (
        <NoAllBlogs />
      ) : (
        <AllBlogs blogs={workerBlogs} />
      )}
    </div>
  );
};

export default Page;
