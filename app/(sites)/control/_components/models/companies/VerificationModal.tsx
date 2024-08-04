"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface EmployerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  verified: boolean;
}

export const EmployerVerificationAlertModal: React.FC<
  EmployerVerificationModalProps
> = ({ isOpen, onClose, onConfirm, verified }) => {
  const accountAction = verified ? "Remove company from verified list" : "Verify this company";
  const actionDescription = verified ? "uncheck" : "verify";
  return (
    <Modal
      title={`${accountAction}`}
      description={`Would you like to ${actionDescription} this employer? This can be reversed at any time.`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="mt-3 space-x-2 flex items-center justify-end w-full">
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
          className="bg-primary hover:bg-primary hover:opacity-90 rounded-sm text-white"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
