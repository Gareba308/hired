import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: {
    canonical: "/home/contact",
    languages: {
      "en-US": "/en-US",
    },
  },
}

const Page = () => {
  return <div>Talk to us</div>;
};

export default Page;
