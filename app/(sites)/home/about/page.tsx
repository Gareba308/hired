import React from "react";
import { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About",
  alternates: {
    canonical: "/home/about",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return <div>
    <About />
  </div>;
};

export default Page;
