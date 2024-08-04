"use client"

import { Button } from "@/components/ui/button";
import { BellRing, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NoAdminChat = () => {
  const router= useRouter()
  return (
    <div className="flex items-center flex-col justify-center mt-10 space-y-4">
      <div>
        <BellRing className="h-20 w-20 text-gray-600" />
      </div>
      <div>
        <h2 className="text-2xl text-gray-600 text-center font-bold">
          All quiet around here.
        </h2>
        <p className="text-center text-base text-gray-600">
          You haven&apos;st received a message from admin.
        </p>
      </div>
      <div className="sm:hidden">
        <Button
          type="button"
          variant="default"
          size="lg"
          className="hover:bg-primary hover:opacity-90 font-normal"
          onClick={() => router.push('/site/dashboard')}
        >
          <Edit className="h-4 w-4 mr-1.5 shrink-0" />
          To Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NoAdminChat ;
