"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Squirrel } from "lucide-react";
import { useRouter } from "next/navigation";

interface NoSearchResultProps {
  subcategory: string;
}
const NoSearchResult = ({ subcategory }: NoSearchResultProps) => {
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
            We apologize, but we couldn&apos;t find any {subcategory} listings
            at the moment. Please check back later for updates.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              variant="default"
              onClick={() => router.push("/")}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              All Jobs
            </Button>
            <Button
              variant="outline"
              size="lg"
              
              onClick={() => router.push("/home/jobs")}
              className="w-full font-normal text-base px-4 rounded-sm"
            >
              Homepage
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoSearchResult;
