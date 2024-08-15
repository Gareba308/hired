"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Undo2,} from "lucide-react";
import { useRouter } from "next/navigation";

const NoSavedJobs = () => {
  const router = useRouter();
  return (
    <main>
      <div className="bg-white max-w-screen-xl mx-auto px-6 flex rounded-lg items-start pt-8 lg:pt-12 justify-start min-h-[calc(100vh-90px)] md:px-8">
        <div className="max-w-lg mx-auto space-y-4 text-center">
          <p className="text-gray-600 text-3xl font-bold sm:text-4xl">
            No Saved Jobs Available
          </p>
          <p className="text-gray-600 text-base md:text-[15px]">
            You have no saved jobs in your Saved Jobs list. To be save a job open job&apos;s detail and click save button.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/site/jobs"
              title="Go back"
              className={buttonVariants({
                size: "lg",
                className: "block w-full  px-4 rounded-sm",
                variant: "outline",
              })}
            >
              <Undo2 className="h-4 w-4 mr-1.5" /> Go Back
            </Link>
            <Button
              variant="default"
              title="Explore available jobs"
              onClick={() => router.push("/site/jobs")}
              size="lg"
              className="w-full px-4 hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Explore Jobs
              <ArrowRight className="h-4 w-4 ml-1.5" /> 
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoSavedJobs;