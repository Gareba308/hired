"use client";

import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Undo2 } from "lucide-react";

const TokenExpired = () => {
  return (
    <main>
      <div className="bg-white max-w-screen-xl mx-auto px-4 flex items-center justify-start min-h-[calc(100vh-80px)] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <p className="text-gray-600 font-semibold text-3xl md:4xl lg:text-5xl">
            Request Failed
          </p>
          <h3 className="text-gray-600 font-semibold text-xl sm:text-2xl flex flex-col items-center mb-8">
            Login with old details and try again
          </h3>
          <p className="text-gray-600 md:text-lg">
            Your request to have email changed failed because verification token
            expired. Please login with your old details and try again.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className={buttonVariants({
                size: "lg",
                className: "block  px-4 rounded-none text-base",
                variant: "outline",
              })}
            >
              <Undo2 className="h-4 w-4 mr-1" /> To homepage
            </Link>
            <Link
              href="/home/help"
              className={buttonVariants({
                size: "lg",
                className: "block  px-4 rounded-none text-base",
                variant: "secondary",
              })}
            >
              For support
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TokenExpired;
