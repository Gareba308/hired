"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Squirrel} from "lucide-react";
import { useRouter } from "next/navigation";

const NoSearchResult = () => {
  const router = useRouter();
  return (
    <main className="md:min-h-[calc(100vh-16rem)] pb-4 border border-gray-200 sm:rounded-lg flex flex-col justify-center items-center">
      <>
        <div className="max-w-lg mx-auto px-4 mt-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mb-8">
            <Squirrel className="h-16 w-16 sm:h-24 sm:w-24" />
          </h3>
          <p className="text-gray-600 text-2xl font-semibold sm:text-3xl">
            Empty Around Here
          </p>
          <p className="text-gray-600 text-base md:text-base">
            Sorry, we could not find jobs by your query, kindly make
            changes to your search query or the job filter.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button
              variant="default"
              onClick={() => router.push("/")}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Homepage
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.reload()}
              className="w-full font-normal text-base px-4 rounded-sm"
            >
              Go Back
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoSearchResult;
