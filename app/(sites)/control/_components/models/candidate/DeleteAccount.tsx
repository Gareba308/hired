"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const DeleteAccountAlertModal: React.FC<AlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      title="Delete entire user account"
      description="This is an irreversible action. The entire user's details will be deleted"
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
          className="bg-red-700 hover:bg-red-700 hover:opacity-80 rounded-sm text-white"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
