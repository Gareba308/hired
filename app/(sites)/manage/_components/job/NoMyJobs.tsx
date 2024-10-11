"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Squirrel} from "lucide-react";
import { useRouter } from "next/navigation";

const NoMyJobs = () => {
  const router = useRouter();
  return (
    <main className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <>
        <div className="max-w-lg mx-auto px-4 mt-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mb-6">
            <Squirrel className="h-20 w-20 sm:h-28 sm:w-28" />
          </h3>
          <p className="text-gray-600 text-2xl font-bold sm:text-3xl">
            You have not listed a Job
          </p>
          <p className="text-gray-600 text-base md:text-[15px]">
            Currently, you haven&apos;t listed a job. Please ensure you have
            your company&apos;s profile before posting a job
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-y-6 sm:gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/manage/jobs")}
              className="w-full font-normal text-base px-4 rounded-sm"
            >
               Homepage
            </Button>
            <Button
              variant="default"
              onClick={() => router.push("/manage/profile")}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              User Profile
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoMyJobs;
