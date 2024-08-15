"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Squirrel, Undo2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const NoProfile = () => {
  const router = useRouter();
  const searchParams= useSearchParams();
  const origin= searchParams?.get('origin')
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
          <p className="text-gray-600 text-base md:text-[15px]">
            Sorry, you are unable to create a blog because currently you do not
            have a user profile. Create a user profile to be able to publish
            blogs.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/control/jobs")}
              className="w-full font-normal text-base px-4 rounded-sm"
            >
              <Undo2 className="h-4 w-4 mr-1" /> Homepage
            </Button>
            <Button
              variant="default"
              onClick={() => router.push(`/control/profile?origin=control/blogs/create`)}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Create Profile
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoProfile;
