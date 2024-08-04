"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Job } from "@prisma/client";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy } from "lucide-react";

interface CopyJobDetailsAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobs: Job[];
}

export const CopyJobDetailsAlertModal: React.FC<
  CopyJobDetailsAlertModelProps
> = ({ isOpen, onClose, onConfirm, jobs }) => {
  const { toast } = useToast();
  const divRef = useRef<HTMLDivElement>(null);
  const copyContent = () => {
    if (divRef.current) {
      let allJobsContent = "";
      jobs.forEach((job) => {
        allJobsContent += `${job.job_title}\n`;
        allJobsContent += `https://www.hired.co.ke/home/jobs/${job.id}\n\n`;
      });
      navigator.clipboard
        .writeText(allJobsContent)
        .then(() => {
          toast({
            title: "Copied content",
            description: "Content has been copied to clipboard",
            variant: "default",
            duration: 3000,
          });
          onConfirm();
        })
        .catch((error) => {
          toast({
            title: "Something went wrong",
            description: `Was unable to copy the content to clipboard, ${error}`,
            variant: "default",
            duration: 3000,
          });
        });
    }
  };
  return (
    <Modal
      title="Copy Jobs Details"
      description="For being able to copy links and names of jobs matching selected category"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1">
        <CardHeader>
          <CardTitle className="text-gray-700 text-xl">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="mt-0.5">
          {jobs.flatMap((job) => (
            <div key={job.id} ref={divRef}>
              <div className="mb-4 items-start pb-4 last:mb-0 last:pb-0">
                <div className="space-y-1">
                  <div>
                    <p className="text-sm text-gray-700 font-medium leading-none">
                      {job.job_title}
                    </p>
                    <p className="text-sm text-[#005580]">
                      {`https://www.hired.co.ke/home/jobs/${job.id}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-4 space-x-2 flex items-center justify-end w-full">
        <Button
          variant="outline"
          className="rounded-sm bg-slate-200 border border-gray-200"
          size="lg"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          variant="default"
          className="hover:bg-primary hover:opacity-90 border"
          onClick={copyContent}
        >
          <Copy className="h-4 w-4 shrink-0 mr-1.5" /> Copy
        </Button>
      </div>
    </Modal>
  );
};
