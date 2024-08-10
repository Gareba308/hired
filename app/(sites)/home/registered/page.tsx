"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCw as Refresh } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { ResendAlertModal } from "../_components/models/ResendModel";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const confirm = () => {
    setLoading(true);
    router.push("/home/verify");
    setLoading(false);
  };
  return (
    <MaxWidthWrapper className="mt-4">
      <ResendAlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
        loading={loading}
      />

      <section className="relative z-10 overflow-hidden min-h-[calc(100vh-70px)] pt-2 lg:pt-[40px]">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mx-auto px-4 w-full sm:max-w-[540px] rounded-md py-6 sm:py-12 sm:border sm:border-gray-200 sm:shadow-md sm:px-[60px]">
              <p className="text-[15px] sm:text-xl lg:text-2xl font-semibold text-green-600">
                You&apos;re almost there!!
              </p>
              <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-700 lg::text-4xl">
                Check your email for verification
              </h1>
              <p className="mt-6 text-base leading-7 text-zinc-600">
                If you did not receive the verification email, you may select{" "}
                <span className="text-primary font-semibold text-base">
                  Resend
                </span>{" "}
                to try again, or contact{" "}
                <span className="text-primary font-semibold text-base">
                  Support
                </span>{" "}
                for assistance.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => setOpen(true)}
                  type="button"
                  className="hover:bg-primary border border-gray-200 hover:opacity-90 w-full"
                >
                  <Refresh className="w-4 h-4 mr-1.5" />
                  Resend
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  type="button"
                  className="w-full border border-gray-200"
                >
                  Support <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default Page;
