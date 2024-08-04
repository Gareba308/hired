"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ApproveEmployerCreditAlertModal: React.FC<AlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      title="Make changes on credits points"
      description="Would you like to make credit approval changes on this employer's referral?"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="mt-4 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          className="rounded-sm bg-slate-200 border border-gray-200"
          size="lg"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          size="lg"
          variant='default'
          className=" hover:bg-primary hover:opacity-90 rounded-sm"
          onClick={onConfirm}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : "Continue"}
        </Button>
      </div>
    </Modal>
  );
};
