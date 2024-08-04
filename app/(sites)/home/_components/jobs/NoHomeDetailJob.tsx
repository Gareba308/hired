"use client";

import React from "react";

const NoHomeDetailJob = () => {
  return (
    <main className="flex h-full w-full flex-col justify-center items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-16 w-16 sm:h-24 sm:w-24"
            >
              <path d="M12 12h.01" />
              <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <path d="M22 13a18.15 18.15 0 0 1-20 0" />
              <rect width="20" height="14" x="2" y="6" rx="2" />
            </svg>
          </h3>
          <p className="text-gray-600 text-2xl font-semibold sm:text-3xl">
            No job details found
          </p>
          <p className="text-gray-600 text-base md:text-base">
            Sorry, there is no a job to display the detail page.
          </p>
        </div>
    </main>
  );
};

export default NoHomeDetailJob;
