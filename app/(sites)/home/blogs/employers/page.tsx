import { db } from "@/db";
import React from "react";
import NoAllBlogs from "../../_components/employersBlogs/NoBlogs";
import AllBlogs from "../../_components/employersBlogs/AllBlogs";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Employer Blogs",
  description:
    "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
  keywords: [
    "recruitment in Kenya",
    "hiring in Kenya",
    "job board Kenya",
    "post jobs Kenya",
    "find talent Kenya",
    "recruitment solutions Kenya",
    "Kenya employment opportunities",
    "advertise vacancies Kenya",
    "talent pool Kenya",
    "recruitment platform Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Employer Blogs",
    description:
      "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogEmployerBlogs,
        width: 1200,
        height: 630,
        alt: "Employer Blogs",
      },
    ],
  },
  alternates: {
    canonical: "/home/blogs/employer",
    languages: {
      "en-US": "/en-US",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Employer Blogs",
    description:
      "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
    images: [
      {
        url: siteConfig.ogEmployerBlogs,
        width: 1200,
        height: 630,
        alt: "Employer Blogs",
      },
    ],
    creator: "@hiredke",
    site: "@hiredke",
  },
};

const Page = async () => {
  const employerBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700">
        {employerBlogs.length === 0 ? (
          <NoAllBlogs />
        ) : (
          <AllBlogs blogs={employerBlogs} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
