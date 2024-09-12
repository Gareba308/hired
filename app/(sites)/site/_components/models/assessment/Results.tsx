"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { AssessmentStatus } from "@prisma/client";

interface CombinedDataItems {
  id: string;
  userId: string;
  fullName: string;
  testCategory: string;
  testId: string;
  testName: string;
  status: AssessmentStatus;
  score: number;
  createdAt: Date;
}

interface RedeemedHistoryAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  result: CombinedDataItems;
}

export const AssessmentResultsAlertModal: React.FC<
  RedeemedHistoryAlertModelProps
> = ({ isOpen, onClose, onConfirm, result }) => {
  return (
    <Modal
      title="Assessment Results"
      description="This is your detailed assessment result that you obtained."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-1">
              <div className="font-semibold">Detailed Results</div>
              <ul className="grid gap-1">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Date:
                  </span>
                  <span suppressHydrationWarning>{format(result.createdAt, "PPP")}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Test Category:
                  </span>
                  <span>{result.testCategory}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Test Name:
                  </span>
                  <span>{result.testName}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    My Score:
                  </span>
                  <span>{result.score}</span>
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
          variant="default"
          className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};
