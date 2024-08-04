"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Layers, Undo2, User2, UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NoApplication = () => {
  const router = useRouter();
  return (
    <main>
      <div className="bg-white max-w-screen-xl mx-auto px-6 flex rounded-lg items-start pt-8 lg:pt-12 justify-start min-h-[calc(100vh-80px)] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <p className="text-gray-600 text-3xl font-semibold sm:text-4xl">
            Unavailable Application
          </p>
          <p className="text-gray-600 md:text-lg">
            Sorry, we could not find application details for this application. It could be that the job or the application has been deleted.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/site"
              className={buttonVariants({
                size: "lg",
                className: "block w-full  px-4 text-base rounded-sm font-normal",
                variant: "outline",
              })}
            >
              <Undo2 className="h-4 w-4 mr-1" /> Homepage
            </Link>
            <Button
              variant="default"
              onClick={() => router.push("/site/applications")}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              <Layers className="h-4 w-4 mr-1" /> Applications
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoApplication;