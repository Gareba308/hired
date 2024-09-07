"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import React from "react";

const SEOTrigger = () => {
  const { toast } = useToast();
  const { mutate: triggerIndexing, isLoading } =
    trpc.adminTriggerIndexing.useMutation({
      onSuccess: () => {
        toast({
          title: "Success indexing",
          description: "The indexing has been done successfully",
          variant: "default",
          duration: 3000,
        });
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message ||
            "There was a problem trying to request indexing of your pages",
          variant: "destructive",
          duration: 3000,
        });
      },
    });
  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        type="button"
        onClick={() => triggerIndexing()}
        variant="default"
        size="lg"
        className="bg-primary hover:bg-primary hover:opacity-90"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-1.5 shrink-0 animate-spin" />{" "}
            Indexing pages{" "}
          </>
        ) : (
          "Request Indexing"
        )}
      </Button>
    </div>
  );
};

export default SEOTrigger;
