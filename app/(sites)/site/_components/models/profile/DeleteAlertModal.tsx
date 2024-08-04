"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {User } from "@prisma/client";

interface AlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  user: User;
}

export const DeleteProfileAlertModal: React.FC<AlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  user,
}) => {
  return (
    <Modal
      title="Are you sure about this?"
      description={`Hello, "${user.name}", are you sure you want to delete this user account? This is IRREVERSIBLE.`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="mt-6 space-x-2 flex items-center justify-end w-full">
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
          Continue
        </Button>
      </div>
    </Modal>
  );
};
