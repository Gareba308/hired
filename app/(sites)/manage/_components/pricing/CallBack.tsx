"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Loader } from "lucide-react";

const CallBack = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate: verifyPay } = trpc.verifyEmployerPayment.useMutation({
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        router.push("/manage/create-job");
      }, 500);
    },
    onError: (error) => {
      console.error("❌ Payment verification error:", error);
      setErrorMessage(
        error.message || "Something went wrong during payment verification."
      );
      setStatus("error");
    },
  });

  useEffect(() => {
    if (reference) {
      verifyPay({ reference });
    }
  }, [reference, verifyPay]);
  return (
    <div className="p-6 text-center">
      {status === "verifying" && (
        <p className="flex flex-row items-center">
          <Loader className="h-4 w-4 shrink-0 mr-1.5 animate-spin" />
          Verifying...
        </p>
      )}
      {status === "success" && (
        <p>✅ Payment successful! Redirecting...</p>
      )}
      {status === "error" && (
        <>
          <p>❌ Payment could not be verified</p>
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        </>
      )}
    </div>
  );
};

export default CallBack;
