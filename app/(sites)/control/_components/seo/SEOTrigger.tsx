"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LastRequestBlogsIndex, LastRequestJobsIndex } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { format, add } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useRouter } from "next/navigation";

interface SEOTriggerProps {
  blogReq: LastRequestBlogsIndex | null;
  jobReq: LastRequestJobsIndex | null;
}
const SEOTrigger = ({ blogReq, jobReq }: SEOTriggerProps) => {
  const { toast } = useToast();
  const router= useRouter()
  const { mutate: triggerIndexing, isLoading } =
    trpc.adminTriggerIndexing.useMutation({
      onSuccess: () => {
        toast({
          title: "Success indexing",
          description: "Request to have jobs indexed has been done successfully",
          variant: "default",
          duration: 3000,
        });

        router.refresh()
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

  const { mutate: triggerIndexingBlogs, isLoading: loadingBlogs } =
    trpc.adminTriggerIndexingBlogs.useMutation({
      onSuccess: () => {
        toast({
          title: "Success indexing",
          description: "Request to have blogs indexed has been done successfully",
          variant: "default",
          duration: 3000,
        });

        router.refresh()
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

  const nextIndexJobsDate = add(jobReq?.updatedAt ?? new Date(), { hours: 6 });
  const nextIndexBlogsDate = add(blogReq?.updatedAt ?? new Date(), {
    hours: 6,
  });
  return (
    <div>
      <h2 className="font-bold text-center text-gray-600 text-3xl sm:text-4xl">
        SEO & Indexing
      </h2>
      <p className="mt-4 mb-1 text-center text-gray-700 text-base">
        This is the requests submitted to to google for indexing. The real
        indexing happens within 48 hours.
      </p>
      <div className="mb-6">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <Card className="border border-gray-200 text-center flex flex-col items-center justify-center rounded-md p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center font-semibold text-gray-600">
                Jobs Indexing Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{jobReq?.number ?? 0}
              </div>
              <p className="text-sm tracking-tight flex flex-col justify-between gap-y-1 text-gray-600">
                <span className="flex flex-col mb-5">
                  <span className="font-medium text-base flex flex-col">
                    Updated Time:
                  </span>
                  <span suppressHydrationWarning>
                    Last: {format(jobReq?.updatedAt ?? new Date(), "PPP")},{" "}
                    {format(jobReq?.updatedAt ?? new Date(), "HHmm")}
                  </span>
                  <span suppressHydrationWarning>
                    Next: {format(nextIndexJobsDate, "PPP")},{" "}
                    {format(nextIndexJobsDate, "HHmm")}
                  </span>
                </span>
                <Button
                  type="button"
                  onClick={() => triggerIndexing()}
                  disabled={loadingBlogs || isLoading}
                  variant="default"
                  size="lg"
                  className="bg-primary w-full sm:w-fit hover:bg-primary hover:opacity-90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 shrink-0 animate-spin" />{" "}
                      Indexing pages{" "}
                    </>
                  ) : (
                    "Request Jobs Indexing"
                  )}
                </Button>
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 text-center flex flex-col items-center justify-center rounded-md p-4 sm:p-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center font-semibold text-gray-600">
                Blogs Indexing Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{blogReq?.number ?? 0}
              </div>
              <p className="text-sm tracking-tight flex flex-col justify-between gap-y-1 text-gray-600">
                <span className="flex flex-col mb-5">
                  <span className="font-medium text-base flex flex-col">
                    Updated Time
                  </span>
                  <span suppressHydrationWarning>
                    
                    Last: {format(blogReq?.updatedAt ?? new Date(), "PPP")},{" "}
                    {format(blogReq?.updatedAt ?? new Date(), "HHmm")}
                  </span>
                  <span suppressHydrationWarning>
                    Next: {format(nextIndexBlogsDate, "PPP")},{" "}
                    {format(nextIndexBlogsDate, "HHmm")}
                  </span>
                </span>
                <Button
                  type="button"
                  onClick={() => triggerIndexingBlogs()}
                  variant="default"
                  disabled={loadingBlogs || isLoading}
                  size="lg"
                  className="bg-gray-200 w-full sm:w-fit hover:bg-gray-200 text-primary hover:opacity-90"
                >
                  {loadingBlogs ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 shrink-0 animate-spin" />{" "}
                      Indexing pages{" "}
                    </>
                  ) : (
                    "Request Blogs Indexing"
                  )}
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SEOTrigger;
