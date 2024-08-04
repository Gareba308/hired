"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Squirrel, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NoCompanies = () => {
  const router = useRouter();
  return (
    <main className="min-h-[calc(100vh-16rem)] sm:rounded-lg">
      <>
        <div className="max-w-lg mx-auto px-4 mt-4 space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mb-8">
            <Squirrel className="h-20 w-20 sm:h-24 sm:w-24" />
          </h3>
          <p className="text-gray-600 text-2xl font-semibold sm:text-3xl">
            Empty Around Here
          </p>
          <p className="text-gray-600 text-base md:text-base">
            Sorry, there are no companies yet in this section. Could you please
            try checking later.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-6 sm:gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/control')}
              className="w-full font-normal text-base px-4 rounded-sm"
            >
              <Undo2 className="h-4 w-4 mr-1" /> Go Back
            </Button>
            <Button
              variant="default"
              onClick={() => router.push("/control/dashboard")}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Dashboard
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoCompanies;
