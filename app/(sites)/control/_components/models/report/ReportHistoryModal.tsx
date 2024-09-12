"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import "@/lib/suppressHydration"

interface CombinedDataItems {
  id: string;
  userId: string;
  userName: string | null;
  jobId: string;
  jobName: string;
  companyId: string;
  employerName: string;
  subject: string;
  report: string;
  createdAt: Date;
  sorted: boolean;
  companyPhone: string;
  companyEmail: string;
}

interface ReportHistoryAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  report: CombinedDataItems;
}

export const ReportHistoryAlertModal: React.FC<
  ReportHistoryAlertModelProps
> = ({ isOpen, onClose, onConfirm, loading, report }) => {
  return (
    <Modal
      title="Detailed job report view"
      description="Job report with other details that may help you make decision based on the report."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full">
        <CardContent>
          <Separator className="my-2 -mt-1.5" />
          <div className="text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Report Details</div>
              <ul className="grid gap-1.5">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Job Title:</span>
                  <span>{report.jobName}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span>{report.employerName}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone No:</span>
                  <span>{report.companyPhone}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span>{report.subject}</span>
                </li>
                <Separator className="my-1.5" />
                <li className="flex items-center justify-between">
                  <span>{report.report}</span>
                </li>
              </ul>
              <Separator className="my-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 space-x-2 flex items-center justify-end w-full">
        <Button
          variant="outline"
          className="rounded-sm hidden bg-slate-200 border-none outline-none ring-0"
          size="lg"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          disabled={loading}
          variant="default"
          className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Check className="h-4 w-4 shrink-0 mr-1.5" /> Done
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};
