import { Button } from "@/components/ui/button";
import { BellRing, Edit2 } from "lucide-react";
import React, { useState } from "react";
import NoDetailChatUserModal from "../models/workerMessage/NoDetailChatUserModal copy";
interface UserItems {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}
interface NoDetailUserChatProps {
  users: UserItems[];
}

const NoDetailUserChat = ({ users }: NoDetailUserChatProps) => {
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const onClose = () => setMessageOpen((prev) => !prev);
  const onConfirm = () => setMessageOpen((prev) => !prev);
  return (
    <div className="flex items-center flex-col justify-center mt-10 space-y-3">
      <NoDetailChatUserModal
        isOpen={messageOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        users={users}
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

export default NoDetailUserChat;
