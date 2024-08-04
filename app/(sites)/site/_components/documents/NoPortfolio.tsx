"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Edit3, Squirrel, Undo2, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NoPortfolio = () => {
  const router = useRouter();
  return (
    <main>
      <div className="bg-white max-w-screen-xl pt-4 mx-auto px-6 flex items-start rounded-lg justify-start min-h-[calc(100vh-7rem)] lg:max-h-[calc(100vh-90px)] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-600 font-medium text-2xl flex flex-col items-center mb-6">
            <Squirrel className="h-20 w-20 sm:h-24 sm:w-28" />
          </h3>
          <p className="text-gray-600 text-2xl font-bold sm:text-3xl">
            Incomplete User Portfolio
          </p>
          <p className="text-gray-600 md:text-lg">
            To view your documents, your portfolio should have details on your{" "}
            <span className="text-primary font-medium">skills</span>, a{" "}
            <span className="text-primary font-medium">summary</span> about
            yourself,{" "}
            <span className="text-primary font-medium">experiences</span> and
            <span className="text-primary font-medium"> education</span>.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/site/jobs"
              className={buttonVariants({
                size: "lg",
                className: "block w-full  px-4 rounded-sm font-normal",
                variant: "outline",
              })}
            >
              <Undo2 className="h-4 w-4 mr-1" /> Go Back
            </Link>
            <Button
              variant="default"
              onClick={() => router.push("/site/portfolio")}
              size="lg"
              className="w-full px-4 font-normal hover:bg-primary hover:opacity-90 rounded-sm"
            >
              <Edit3 className="h-4 w-4 mr-1" /> Create Portfolio
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoPortfolio;
