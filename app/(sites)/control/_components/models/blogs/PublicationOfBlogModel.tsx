"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogPublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  hide: boolean;
}

export const BlogPublicationAlertModal: React.FC<BlogPublicationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  hide,
}) => {
  const accountAction = hide ? "Pull down this blog from being public." : "Make this blog go public.";
  const actionDescription = hide ? "unpublish" : "publish";
  return (
    <Modal
      title={`${accountAction}`}
      description={`Would you like to ${actionDescription} this blog? This can be reversed at any time.`}
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
            <>{hide ? "Unpublish" : "Publish"}</>
          )}
        </Button>
      </div>
    </Modal>
  );
};