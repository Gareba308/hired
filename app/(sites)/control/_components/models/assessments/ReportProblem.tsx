"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarDays,
  Check,
  Smartphone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {format } from "date-fns";

interface AllReportsItems {
    id: string;
    userId: string;
    initiateID: string;
    fullName: string;
    email: string;
    assessmentCategory: string;
    assessmentName: string;
    questionID: string;
    subject: string;
    report: string;
    sorted: boolean;
    createdAt: Date;
  }

interface RedeemedHistoryAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  report: AllReportsItems;
  loading: boolean;
}

export const ReportProblemAlertModal: React.FC<
  RedeemedHistoryAlertModelProps
> = ({ isOpen, onClose, onConfirm, report, loading }) => {
  return (
    <Modal
      title="Assessment problems report"
      description="This is user's problem report on the assessment."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Redeem Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Report Date
                  </span>
                  <span suppressHydrationWarning>{format(report.createdAt, "PPP")}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Assessment Category:
                  </span>
                  <span>{report.assessmentCategory}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Assessment Name:
                  </span>
                  <span>{report.assessmentName}</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span>Ksh. {report.fullName}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email Address</span>
                  <span>Ksh. {report.email}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Report Content</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subject</dt>
                  <dd>{report.subject}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Report</dt>
                  <dd>
                    <a href="mailto:">{report.report}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
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
          variant="default"
          className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          {<Check className="h-4 w-4 shrink-0 mr-1.5" /> }
          Sorted
        </Button>
      </div>
    </Modal>
  );
};
