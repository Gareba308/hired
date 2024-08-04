"use client";

import React from "react";
import { Squirrel } from "lucide-react";

const NoAssessments = () => {
  return (
    <main className="mt-8">
      <>
        <div className="max-w-lg mx-auto px-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mp-4 mb-6">
            <Squirrel className="h-20 w-20 sm:h-24 sm:w-28" />
          </h3>
          <p className="text-gray-600 text-2xl font-bold sm:text-3xl">
            No Assessment Found
          </p>
          <p className="text-gray-600 text-base md:text-base">
            We did not find what you are looking for, the record could be
            missing at this moment. We encourage you to check later.
          </p>
        </div>
      </>
    </main>
  );
};

export default NoAssessments;
