import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import NewWorkerMessageModal from "../models/workerMessage/NewMessageModal";

interface UserItems {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}
interface NoSelectedMessageProps {
  users: UserItems[];
}

const NoSelectedMessage = ({ users }: NoSelectedMessageProps) => {
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const onClose = () => setMessageOpen((prev) => !prev);
  const onConfirm = () => setMessageOpen((prev) => !prev);
  return (
    <section className="relative max-w-screen-xl mx-auto pb-4">
      <div className="relative z-10 gap-2 items-center lg:flex">
        <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
          <NewWorkerMessageModal
            isOpen={messageOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            users={users}
          />
          <h3 className="text-3xl text-center lg:text-start tracking-tight text-gray-600 font-bold md:text-3xl">
            Message a <span className="text-cyan-700">worker</span>
          </h3>
          <p className="text-gray-600 text-base leading-normal mt-2">
            Pick on a currently existing chat to continue conversation. Or start
            a new conversation by clicking the{" "}
            <span className="font-bold">New Message</span>.
          </p>
          <div className="flex items-center justify-center lg:justify-start">
            <Button
              size="lg"
              variant="default"
              onClick={() => setMessageOpen(true)}
              type="button"
              className="hover:bg-primary mt-5 hover:opacity-90 font-normal"
            >
              <Edit className="h-5 w-5 mr-2" />
              New Message
            </Button>
          </div>
        </div>
        <div className="flex-1 relative shrink-0 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
          <Image
            src="https://res.cloudinary.com/dx0i37cyd/image/upload/v1711428882/bwink_ppl_05_single_08_ehxwmt.jpg"
            alt="Start Messaging"
            height={400}
            width={400}
            quality={100}
            priority={true}
          />
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm leading-normal italic">
          <span className="font-medium mr-1.5 not-italic">Note:</span> Please be
          aware that conversations in this section are kept private. We kindly
          request that you maintain a professional tone at all times.
        </p>
      </div>
    </section>
  );
};

export default NoSelectedMessage;
