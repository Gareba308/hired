"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface FinalDataCountsForTableItems {
  id: string;
  recipientsUserIdsCount: number;
  recipientsEmails: string[];
  toEmailJobIDsCount: number;
  toEmailJobIDs: string[];
  emailedJobTitles: string[];
  message: string;
  subject: string;
  reason: string;
  createdAt: Date;
}

interface EmailOnSkillAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: FinalDataCountsForTableItems;
}

export const EmailOnSkillAlertModal: React.FC<EmailOnSkillAlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  email,
}) => {
  return (
    <Modal
      title="View Email Recipients"
      description="For viewing the email address of email recipients"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-2">
        <CardHeader>
          <CardTitle className="text-gray-700 text-base font-semibold capitalize">
            Email On Skills Recipients
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-0.5">
          {email.recipientsEmails.flatMap((email, index) => (
            <div key={index}>
              <div className="mb-4 items-start pb-4 last:mb-0 last:pb-0">
                <div className="space-y-1">
                  <div>
                    <p className="text-sm text-gray-600 font-normal leading-none">
                      {index + 1}. {email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-8 space-x-2 flex items-center justify-end w-full">
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
          className="hover:bg-primary hover:opacity-90  rounded-none"
          onClick={onConfirm}
        >
          <Check className="h-4 w-4 shrink-0 mr-1.5" /> Done
        </Button>
      </div>
    </Modal>
  );
};
