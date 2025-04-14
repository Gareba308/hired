"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Squirrel, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NoProfile = () => {
  const router = useRouter();
  return (
    <main className="min-h-[calc(100vh-16rem)]">
      <>
        <div className="max-w-lg mx-auto px-4 mt-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mb-6">
            <Squirrel className="h-20 w-20 sm:h-24 sm:w-28" />
          </h3>
          <p className="text-gray-600 text-2xl font-bold sm:text-3xl">
            No User Profile Available
          </p>
          <p className="text-gray-600 text-base md:text-base">
            Sorry, we could not find your user profile. Create profile to post job
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button
              variant="default"
              onClick={() => router.push("/control/profile")}
              size="default"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Create Profile
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={() => router.push('/control/jobs')}
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

export default NoProfile;

