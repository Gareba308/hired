import React from "react";
import Registered from "../_components/register/Registered";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registered user awaiting email confirmation",
  alternates: {
    canonical: "/home/registered",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const Page = () => {
  return (
    <div>
      <Registered />
    </div>
  );
};

export default Page;
