"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SpecialEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  special: boolean;
}

export const SpecialEmployerAlertModal: React.FC<SpecialEmployerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  special,
}) => {
  const accountAction = special ? "Downgrade this account from special" : "Upgrade this account to special";
  const actionDescription = special ? "downgrade" : "upgrade";
  return (
    <Modal
      title={`${accountAction}`}
      description={`Would you like to ${actionDescription} this employer? This can be reversed at any time.`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="mt-3 space-x-2 flex items-center justify-end w-full">
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
          onClick={onConfirm}
          className="hover:bg-primary hover:opacity-90"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>{special ? "Downgrade" : "Upgrade"}</>
          )}
        </Button>
      </div>
    </Modal>
  );
};