import React from "react";
import { Metadata } from "next";
import Terms from "@/components/Terms";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  alternates: {
    canonical: "/home/terms",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <>
      <Terms />
    </>
  );
};

export default Page;
