"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, Check, Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { HomepageContact } from "@prisma/client";

interface HomeContactModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contact: HomepageContact;
}

export const HomeContactAlertModal: React.FC<HomeContactModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contact,
}) => {
  function getFirstName(fullName: string): string {
    return fullName.split(" ")[0];
  }
  return (
    <Modal
      title="Homepage contact message"
      description="This is a contact message sent by a user on the homepage"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-1">
              <div className="font-semibold text-lg text-gray-600">Received Message</div>
              <ul>
                <li className="flex text-base items-center justify-between">
                  <span className="text-muted-foreground text-base">Contact Date</span>
                  <span className="text-base">{format(contact.createdAt, "PPP")}</span>
                </li>
                <li className="flex text-base items-center justify-between">
                  <span className="text-muted-foreground text-base">Contact Name</span>
                  <span className="text-base">{contact.fullName}</span>
                </li>
                <li className="flex text-base items-center justify-between">
                  <span className="text-muted-foreground text-base">Contact Email</span>
                  <span className="text-base">{contact.email}</span>
                </li>
              </ul>
              <fieldset className="grid rounded-lg border border-gray-300 px-4 pb-6 pt-0">
                <legend className="-ml-1 px-1 text-lg text-gray-600 font-semibold">
                  {getFirstName(contact.fullName)} says:
                </legend>
                <p className="flex items-center text-base text-muted-foreground justify-between">
                  {contact.message}
                </p>
              </fieldset>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 space-x-2 flex items-center justify-end w-full">
        <Button
          size="lg"
          variant="default"
          className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          Message Seen
        </Button>
      </div>
    </Modal>
  );
};
