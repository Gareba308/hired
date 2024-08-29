import { db } from "@/db";
import React from "react";
import { HomepageContacts } from "../_components/contact/HomePageContact";

const Page = async () => {
  const allHomepageMessages = await db.homepageContact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return <div className="space-y-6 pt-2  pb-5 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-3 md:px-4 text-gray-800 sm:shadow-sm sm:rounded-lg">
    <HomepageContacts contact={allHomepageMessages}/>
  </div>;
};

export default Page;
