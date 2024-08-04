import { Button } from "@/components/ui/button";
import { Company } from "@prisma/client";
import { ArrowLeft, BellRing, Edit2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


const NoDetailCompanyChat = () => {
  const router= useRouter()
  return (
    <div className="flex items-center flex-col justify-center mt-10 space-y-3">
      <div>
        <BellRing className="h-20 w-20 text-gray-600" />
      </div>
      <div>
        <h2 className="text-2xl text-gray-600 text-center font-bold">
          All quiet around here.
        </h2>
        <p className="text-center text-gray-600">
          You haven&apos;t received a message from admin.
        </p>
      </div>
      <div>
        <Button
          type="button"
          variant="default"
          size="default"
          className="hover:bg-primary hover:opacity-90 font-normal"
          onClick={() => router.push('/manage/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5 shrink-0" />
          To Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NoDetailCompanyChat;
