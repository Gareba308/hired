"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Application } from "@prisma/client";

interface ApplicationHistoryAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: Application;
}

export const ApplicationHistoryAlertModal: React.FC<
  ApplicationHistoryAlertModelProps
> = ({ isOpen, onClose, onConfirm, application }) => {
  return (
    <Modal
      title="Job application scorecard"
      description="This is your job application scorecard with other scores that your application might have obtained."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-2">
              <div className="font-semibold">Application Details</div>
              <ul className="grid gap-2">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Job Title</span>
                  <span>{application.jobTitle}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Company Name</span>
                  <span>{application.companyName}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Application Date
                  </span>
                  <span suppressHydrationWarning>{format(application.createdAt, "PPP")}</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Cover Letter Score
                  </span>
                  <span>{application.ratingLetter * 4}/20</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">About Score</span>
                  <span>{application.aboutRating * 2}/10</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span>{application.experienceRating * 2}/10</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Education</span>
                  <span>{application.educationRating}/10</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Skills Score</span>
                  <span>{application.skillsRating * 2}/10</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Awards Score</span>
                  <span>{application.awardsRating * 2}/10</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Certification</span>
                  <span>{application.certificationRating * 2}/10</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Profile Score</span>
                  <span>{application.ratingGenerated * 4}/20</span>
                </li>
                <Separator className="mt-2.5" />
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Final Score</span>
                  <span>{application.finalScore}/100</span>
                </li>
              </ul>
            </div>
            <Separator className="my-2.5" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center mt-3 border-t border-b bg-muted/70 px-3 py-3">
          <div className="text-xs text-muted-foreground">
            <p>
              Your job application status currently reads{" "}
              <span className="font-bold">{application.status}</span>.
            </p>
          </div>
        </CardFooter>
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
          <CheckSquare className="h-4 w-4 shrink-0 mr-1.5" /> Done
        </Button>
      </div>
    </Modal>
  );
};
