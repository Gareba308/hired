"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarDays,
  Check,
  Smartphone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format} from "date-fns";

interface CombinedDataItems {
  id: string;
  fullName: string;
  paymentID: string;
  phoneNumber: string;
  paymentDate: Date;
  paymentPhone: string;
  userId: string;
  email: string;
  availablePoints: number;
  subtotal: number;
  tax: number;
  transactionFee: number;
  totalPayable: number;
  paid: boolean;
  hide: boolean;
  createdAt: Date;
}

interface RedeemedHistoryAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  redeem: CombinedDataItems;
}

export const RedeemedHistoryAlertModal: React.FC<
  RedeemedHistoryAlertModelProps
> = ({ isOpen, onClose, onConfirm, redeem }) => {
  return (
    <Modal
      title="Detailed redeem history view"
      description="This is your detailed redeem history with other details that were considered to arrive at the redeemable amount"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Redeem Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Redeem Date
                  </span>
                  <span>{format(redeem.createdAt, "PPP")}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Available Points{" "}
                    <span>{redeem.availablePoints}</span>
                  </span>
                  <span>Ksh. {redeem.availablePoints}</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Ksh. {redeem.subtotal}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction Fee</span>
                  <span>Ksh. {redeem.transactionFee}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax Deduction</span>
                  <span>Ksh. {redeem.tax}</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total Payable</span>
                  <span>Ksh. {redeem.totalPayable}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Recipient&apos;s Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Full Name</dt>
                  <dd>{redeem.fullName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email Address</dt>
                  <dd>
                    <a href="mailto:">{redeem.email}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone Number</dt>
                  <dd>
                    <a href="tel:">{redeem.phoneNumber}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">
                Payment Information{" "}
                <span className="font-normal text-xs">
                  (Phone number is only editable in your profile)
                </span>
              </div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    Mpesa Number
                  </dt>
                  <dd>{redeem.paymentPhone}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Potential Pay Date
                  </dt>
                  <dd>{format(redeem.paymentDate, "PPP")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center mt-3 border-t border-b bg-muted/70 px-3 py-3">
          <div className="text-xs text-muted-foreground">
              <p>
                You have{" "}
                <span className="font-semibold">Ksh.{redeem.totalPayable}</span> in
                payable amount. Payment is only done on Thursdays.
              </p>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4 space-x-2 flex items-center justify-end w-full">
        <Button
          variant="outline"
          className="rounded-sm hidden bg-slate-200 border-none outline-none ring-0"
          size="lg"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          variant="default"
          className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          <Check className="h-4 w-4 shrink-0 mr-1.5" /> Done
        </Button>
      </div>
    </Modal>
  );
};
