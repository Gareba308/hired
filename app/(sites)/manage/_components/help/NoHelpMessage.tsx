"use client";

import React from "react";
import { Button,} from "@/components/ui/button";
import {ArrowRight, MailWarning, Undo2} from "lucide-react";
import { useRouter } from "next/navigation";

interface NoHelpMessageProps{
  toggleView: ()=>void
}

const NoHelpMessage = ({toggleView}: NoHelpMessageProps) => {
  const router = useRouter();
  return (
    <main>
      <>
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-600 font-semibold text-2xl flex flex-col items-center mb-8">
            <MailWarning className="h-16 w-16 sm:h-20 sm:w-20" />
          </h3>
          <p className="text-gray-600 text-3xl font-semibold sm:text-4xl">
            No Help Messages
          </p>
          <p className="text-gray-600 md:text-lg">
            You have not written or received any help message. All your help messages will all appear in this section.
          </p>
          <div className="mt-4 flex flex-col w-full sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              variant='outline'
              size='lg'
              onClick={toggleView}
              className='w-full font-normal text-base px-4 rounded-sm'
            >
              <Undo2 className="h-4 w-4 mr-1" /> Go Back
            </Button>
            <Button
              variant="default"
              onClick={() => router.push("/manage/dashboard")}
              size="lg"
              className="w-full px-4 font-normal text-base hover:bg-primary hover:opacity-90 rounded-sm"
            >
              Dashboard<ArrowRight className="h-4 w-4 ml-1" /> 
            </Button>
          </div>
        </div>
      </>
    </main>
  );
};

export default NoHelpMessage;