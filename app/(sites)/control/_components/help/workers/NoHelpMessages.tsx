"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight} from "lucide-react";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NoHelpMessages = () => {
  const router= useRouter()

  return (
    <section className="relative max-w-screen-xl mx-auto pb-4">
      <div className="relative z-10 gap-2 items-center lg:flex">
        <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
          <h3 className="text-3xl text-center hidden sm:block lg:text-start tracking-tight text-gray-600 font-bold sm:text-4xl">
            Message me?
          </h3>
          <h3 className="text-2xl text-center sm:hidden lg:text-start tracking-tight text-gray-600 font-bold md:text-3xl">
            Want to message this{" "}
            <span className="text-cyan-700">worker?</span>
          </h3>
          <p className="text-gray-600 leading-normal mt-3">
            We did not find any message sent or received from{" "}
            <span className="font-bold">this worker</span>. Click{" "}
            <span className="font-bold">Write Message</span> button to write a
            message.
          </p>
          <div className="flex items-center justify-center lg:justify-start">
            <Button
              size="lg"
              variant="default"
              onClick={() => router.push('/site/dashboard')}
              type="button"
              className="hover:bg-primary mt-5 hover:opacity-90"
            >
              To Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
        <div className="flex-1 relative shrink-0 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
          <Image
            src="https://res.cloudinary.com/dx0i37cyd/image/upload/v1711533885/bwink_msc_04_single_02_xp7ubx.jpg"
            alt="Start Messaging"
            height={400}
            width={400}
            quality={100}
            priority={true}
          />
        </div>
      </div>
      <div>
      <p className="text-gray-600 text-sm leading-normal italic">
          <span className="font-medium mr-1.5 not-italic">Note:</span> Please be
          aware that conversations in this section are kept private. We kindly
          request that you maintain a professional tone at all times.
        </p>
      </div>
    </section>
  );
};

export default NoHelpMessages;