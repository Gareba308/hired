"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const EmailChanged = () => {
    const router= useRouter()
  return (
    <main>
      <div className="bg-white max-w-screen-xl mx-auto px-4 flex items-center justify-start min-h-[calc(100vh-80px)] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <p className="text-green-800 mb-6 sm:mb-8 font-bold text-3xl md:text-4xl">
            Email Changed
          </p>
          <h3 className="text-gray-600 font-semibold text-xl sm:text-2xl flex flex-col items-center mb-8">
            Successfully changed your primary email
          </h3>
          <p className="text-gray-600 md:text-lg">
            Your request to have email changed was successful. Please login with
            your new email and your valid password.
          </p>
          <div className="flex flex-wrap items-center justify-center pt-8">
            <button
              onClick={()=>router.push('/')}
            className="text-base sm:text-lg rounded-sm w-full bg-primary text-white p-3 hover:bg-primary/80 flex items-center justify-center"
            >
              Homepage
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmailChanged;