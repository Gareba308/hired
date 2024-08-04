import { Button } from "@/components/ui/button";
import { Company } from "@prisma/client";
import { BellRing, Edit } from "lucide-react";
import React, { useState } from "react";
import NewMessageModal from "../models/job/NewMessageModal";

interface NoCompanyChatProps {
  companies: Company[];
}

const NoCompanyChat = ({ companies }: NoCompanyChatProps) => {
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const onClose = () => setMessageOpen((prev) => !prev);
  const onConfirm = () => setMessageOpen((prev) => !prev);
  return (
    <div className="flex items-center flex-col justify-center mt-10 space-y-4">
      <NewMessageModal
        isOpen={messageOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        companies={companies}
      />
      <div>
        <BellRing className="h-20 w-20 text-gray-600" />
      </div>
      <div>
        <h2 className="text-2xl text-gray-600 text-center font-bold">
          All quiet around here.
        </h2>
        <p className="text-center text-base text-gray-600">
          Drop in again later or initiate a conversation.
        </p>
      </div>
      <div className="sm:hidden">
        <Button
          type="button"
          variant="default"
          size="lg"
          className="hover:bg-primary hover:opacity-90 font-normal"
          onClick={() => setMessageOpen(true)}
        >
          <Edit className="h-4 w-4 mr-1.5 shrink-0" />
          New Message
        </Button>
      </div>
    </div>
  );
};

export default NoCompanyChat;
