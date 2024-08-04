"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuspendEmployerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  suspended: boolean;
}

export const SuspendEmployerAlertModal: React.FC<SuspendEmployerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  suspended,
}) => {
  const accountAction = suspended ? "Unsuspend" : "Suspend";
  const actionDescription = suspended ? "unsuspend" : "suspend";
  return (
    <Modal
      title={`${accountAction} an employer account.`}
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
          variant="default"
          onClick={onConfirm}
          className={cn(
            "hover:opacity-90",
            suspended
              ? "bg-primary text-primary-foreground hover:bg-primary"
              : "bg-[#b91c1c] text-primary-foreground hover:bg-red-700"
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>{suspended ? "Unsuspend" : "Suspend"}</>
          )}
        </Button>
      </div>
    </Modal>
  );
};
