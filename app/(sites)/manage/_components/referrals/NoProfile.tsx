"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Undo2,  UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NoProfile = () => {
  const router = useRouter();
  return (
    <main>
      <div className="bg-white max-w-screen-xl mx-auto flex items-start pt-8 lg:pt-12 justify-start min-h-[calc(100vh-90px)]">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-600 text-3xl font-bold sm:text-4xl">
            No Profile Details
          </p>
          <p className="text-gray-600 text-base md:text-[15px] mt-4">
            You have an incomplete profile. To be able to utilize the referral section, you
            are required to have{" "}
            <span className="text-primary font-medium">company profile</span> details.
          </p>
          <div className="mt-8 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/manage/jobs"
              className={buttonVariants({
                size: "lg",
                className: "block w-full  px-4 rounded-sm font-normal",
                variant: "outline",
              })}
            >
              <Undo2 className="h-4 w-4 mr-1" /> Homepage
            </Link>
            <Button
              variant="default"
              onClick={() => router.push("/manage/profile")}
              size="lg"
              className="w-full px-4 font-normal hover:bg-primary hover:opacity-90 rounded-sm"
            >
              <UserPlus2 className="h-4 w-4 mr-1" /> Create Profile
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoProfile;
