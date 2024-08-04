"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import DOMPurify from "dompurify";

interface FinalDataCountsForTableItems {
  id: string;
  reason: string;
  subject: string;
  message: string;
  recipientsEmails: string[];
  emailedUserIdsCount: number;
  createdAt: Date;
}

interface ViewGeneralUserEmailAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: FinalDataCountsForTableItems;
}

export const ViewGeneralUserEmailAlertModal: React.FC<
  ViewGeneralUserEmailAlertModelProps
> = ({ isOpen, onClose, onConfirm, email }) => {
  const removeHtmlTags = (htmlString: string): string => {
    const sanitizedHtml = DOMPurify.sanitize(htmlString, {
      ALLOWED_TAGS: [],
      KEEP_CONTENT: true,
    });
    const textContent =
      new DOMParser().parseFromString(sanitizedHtml, "text/html")
        .documentElement.textContent || "";
    return textContent;
  };
  return (
    <Modal
      title="View Entire Email Content"
      description="For viewing the content of sent emails"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-2">
        <CardHeader className="mt-4">
          <CardTitle className="text-gray-700 text-base font-semibold capitalize">
            Message Body{" "}
            <span className="text-sm font-normal ml-2">
              (Recipients: {email.emailedUserIdsCount})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-0.5">
          <p className="text-sm text-gray-600 font-normal leading-none">
            {removeHtmlTags(email.message)}
          </p>
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
          className="hover:bg-primary hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          <Check className="h-4 w-4 shrink-0 mr-1.5" /> Done
        </Button>
      </div>
    </Modal>
  );
};
