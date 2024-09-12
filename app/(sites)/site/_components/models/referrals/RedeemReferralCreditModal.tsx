"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  Loader2,
  Smartphone,
} from "lucide-react";
import { User, WorkerContact, WorkerCreditPoints } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { addDays, format, isThursday } from "date-fns";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface RedeemReferralCreditAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountBalance: WorkerCreditPoints | null;
  contact: WorkerContact | null;
  user: User;
}

export const RedeemReferralCreditAlertModal: React.FC<
  RedeemReferralCreditAlertModelProps
> = ({ isOpen, onClose, onConfirm, accountBalance, contact, user }) => {
  const { toast } = useToast();
  const router= useRouter()
  const availablePoints = accountBalance?.balance as number;
  const availableAmount = (accountBalance?.balance as number) * 1;
  const subTotalAmount = (accountBalance?.balance as number) * 1;
  const totalTax = Math.round(((accountBalance?.balance as number) * 4) / 100);
  const transactionFee = Math.round(
    ((accountBalance?.balance as number) * 5) / 100
  );
  const payableAmount = subTotalAmount - (totalTax + transactionFee);

  const getNextThursday = (currentDate: Date): Date => {
    let daysToAdd = (4 - currentDate.getDay() + 7) % 7;
    if (isThursday(currentDate)) {
      daysToAdd += 7;
    }

    return addDays(currentDate, daysToAdd);
  };

  const currentDate = new Date();
  const nextThursday = getNextThursday(currentDate);

  const { mutate: redeemCredit, isLoading } =
    trpc.workerRequestRedeem.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "You have successfully placed a request to redeem your your credit points",
          variant: "default",
          duration: 3000,
        });
        onConfirm();
        router.refresh()
        router.push('/site/referrals/my-referrals/history?origin=site/referrals/my-referrals')
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your redeem request",
            variant: "destructive",
            duration: 3000,
          });
        }
        onClose();
      },
    });

  const submitRedeem = () => {
    redeemCredit({
      availablePoints: availablePoints,
      subTotal: subTotalAmount,
      tax: totalTax,
      totalPayable: payableAmount,
      transactionFee: transactionFee,
      paymentDate: nextThursday,
    });
  };

  const cancelRedeem=()=>{
    toast({
      title: "Failed to meet minimum points",
      description: "You did not meet the minimum required points of 200 to be able to redeem your credit points.",
      variant:"destructive",
      duration: 3000
    }),
    onConfirm()
  }
  return (
    <Modal
      title="Submit a request to redeem your credit points."
      description="You are about to put in a request to redeem your points. The minimum redeemable credit points is 200."
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
                    Current Date
                  </span>
                  <span suppressHydrationWarning>{format(currentDate, "PPP")}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Available Points{" "}
                    <span>({accountBalance?.balance} x Ksh.1)</span>
                  </span>
                  <span>Ksh. {availableAmount}</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Ksh. {subTotalAmount}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction Fee</span>
                  <span>Ksh. {transactionFee}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax Deduction</span>
                  <span>Ksh. {totalTax}</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total Payable</span>
                  <span>Ksh. {payableAmount}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Recipient&apos;s Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Full Name</dt>
                  <dd>{user.name as string}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email Address</dt>
                  <dd>
                    <a href="mailto:">{user.email}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone Number</dt>
                  <dd>
                    <a href="tel:">{contact?.phone as string}</a>
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
                  <dd>{contact?.phone as string}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Potential Pay Date
                  </dt>
                  <dd suppressHydrationWarning>{format(nextThursday, "PPP")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center mt-3 border-t border-b bg-muted/70 px-3 py-3">
          <div className="text-xs text-muted-foreground">
            {availablePoints >= 200 ? (
              <p>
                You have{" "}
                <span className="font-semibold">Ksh.{payableAmount}</span> in
                payable amount. Payment is only done on Thursdays.
              </p>
            ) : (
              <p>
                With{" "}
                <span className="font-semibold">{accountBalance?.balance}</span>{" "}
                as your available credit points, you are below the minimum
                required <span className="font-semibold">200 points.</span>
              </p>
            )}
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
        {availablePoints >= 10 ? (
          <Button
            size="lg"
            variant="default"
            disabled={isLoading}
            className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
            onClick={() => submitRedeem()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 shrink-0 mr-1.5 animate-spin" />
            ) : (
              <CheckSquare className="h-4 w-4 shrink-0 mr-1.5" />
            )}
            Redeem
          </Button>
        ) : (
          <Button
            size="lg"
            variant="default"
            className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
            onClick={cancelRedeem}
          >
            <CheckSquare className="h-4 w-4 shrink-0 mr-1.5" /> Redeem
          </Button>
        )}
      </div>
    </Modal>
  );
};
