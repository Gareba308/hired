"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Squirrel, Undo2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const NoProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  return (
    <main className="min-h-[calc(100vh-90px)] lg:max-h-[calc(100vh-90px)]">
      <>
        <div className="max-w-lg mx-auto px-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mp-4 mb-6">
            <Squirrel className="h-20 w-20 sm:h-28 sm:w-28" />
          </h3>
          <p className="text-gray-600 text-2xl font-bold sm:text-3xl">
            No User Profile Available
          </p>
          <p className="text-gray-600 text-base md:text-[15px]">
            You are unable to view or download for <b>FREE</b> your resume
            because you have an incomplete user profile. Create a user profile
            to be able to open this section.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/site/jobs")}
              className="w-full font-normal text-base px-4 rounded-sm"
            >
              Explore Jobs
            </Button>
            <Button
              variant="default"
              onClick={() => router.push(`/site/profile?origin=site/documents`)}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Create Profile
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoProfile;
