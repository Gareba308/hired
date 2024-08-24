import React from "react";
import { Metadata } from "next";
import Policy from "@/components/Policy";

export const metadata: Metadata = {
  title: "The Privacy Policy",
  alternates: {
    canonical: "/home/privacy",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <Policy />
    </div>
  );
};

export default Page;
