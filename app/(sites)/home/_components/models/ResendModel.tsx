"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ResendAlertModal: React.FC<AlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      title="Resend a verification email"
      description="Are you sure you would like to obtain another verification email again?"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-4 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          type="button"
          size="lg"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="default"
          type="button"
          size="lg"
          className="hover:bg-primary hover:opacity-90"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
