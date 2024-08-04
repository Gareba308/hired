import { Button } from "@/components/ui/button";
import { Company } from "@prisma/client";
import { BellRing, Edit2 } from "lucide-react";
import React, { useState } from "react";
import NoDetailChatCompanyModal from "../models/job/NoDetailChatCompanyModal";

interface NoDetailCompanyChatProps {
  companies: Company[];
}

const NoDetailCompanyChat = ({ companies }: NoDetailCompanyChatProps) => {
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const onClose = () => setMessageOpen((prev) => !prev);
  const onConfirm = () => setMessageOpen((prev) => !prev);
  return (
    <div className="flex items-center flex-col justify-center mt-10 space-y-3">
      <NoDetailChatCompanyModal
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
        <p className="text-center text-gray-600">
          Drop in again later or initiate a conversation.
        </p>
      </div>
      <div>
        <Button
          type="button"
          variant="default"
          size="default"
          className="hover:bg-primary hover:opacity-90 font-normal"
          onClick={() => setMessageOpen(true)}
        >
          <Edit2 className="h-4 w-4 mr-1.5 shrink-0" />
          Compose
        </Button>
      </div>
    </div>
  );
};

export default NoDetailCompanyChat;
