import React from "react";
import { Metadata } from "next";

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
  return <div>About us</div>;
};

export default Page;
