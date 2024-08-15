"use client";

import React from "react";
import { Squirrel } from "lucide-react";

const NoPlan = () => {
  return (
    <main className="mt-8 sm:mt-10">
      <>
        <div className="max-w-lg mx-auto px-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mp-4 mb-6">
            <Squirrel className="h-20 w-20 sm:h-28 sm:w-28" />
          </h3>
          <p className="text-gray-600 text-2xl font-bold sm:text-3xl">
            No Pricing Plan
          </p>
          <p className="text-gray-600 text-base md:text-[15px]">
            We did not find what you are looking for, the record could be
            missing at this moment or you haven&apos;t created. We encourage
            you to check later.
          </p>
        </div>
      </>
    </main>
  );
};

export default NoPlan;