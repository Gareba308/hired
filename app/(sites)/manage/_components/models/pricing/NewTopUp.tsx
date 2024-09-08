import { trpc } from "@/app/_trpc/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { prices } from "../../data/create-job/PricingData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  paymentPhone: z.string(),
  amount: z.number(),
});

interface TopUpAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const NewTopUpAlertModal = ({
  isOpen,
  onClose,
  onConfirm,
}: TopUpAlertModalProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentPhone: "",
    },
  });

  const { control } = form;
  const watchedAmount = useWatch({ control, name: "amount" }) || 0;
  const watchedPaymentPhone = useWatch({ control, name: "paymentPhone" }) || "";
  const { isSubmitting } = form.formState;
  const { mutate: topUpWallet, isLoading } = trpc.employerTopUp.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Thank you. Your will shortly be asked to input your mPesa PIN to complete the transaction",
        variant: "default",
        duration: 3000,
      });
      form.reset();
      onConfirm();
      router.refresh();
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
          description:
            "There was a problem making this payment. Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    form.handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (values: FormSchemaType) => {
    topUpWallet({ ...values });
  };

  const formattedPhone = watchedPaymentPhone.startsWith("0")
    ? watchedPaymentPhone.slice(1)
    : watchedPaymentPhone;

  const { reset } = form;
  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <Modal
      title="Insufficient Balance, Top Up Via MPesa"
      description="Your account balance is insufficient, top up to get started"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="text-base -mt-2">
        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <Card className="w-full -mt-1.5">
              <CardContent>
                <div className="text-sm">
                  <div className="grid gap-1.5">
                    <div className="font-semibold">
                      Enter Payment Details
                    </div>
                    <div className="grid gap-2.5">
                      <div className="flex items-center justify-between">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem className="w-full space-y-0 -mt-1.5">
                              <FormLabel className="font-normal text-base text-gray-700">
                                What is the amount you would like to top up
                                with?
                              </FormLabel>
                              <Select
                                required
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                              >
                                <FormControl className="w-full">
                                  <SelectTrigger
                                    disabled={isLoading || isSubmitting}
                                  >
                                    <SelectValue
                                      className="text-gray-400"
                                      placeholder="---Select Payment Amount---"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full max-h-[350px] overflow-y-auto text-gray-700">
                                  {prices.map((price) => (
                                    <SelectItem
                                      key={price.value}
                                      value={price.value.toString()}
                                    >
                                      {price.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500 font-normal text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="paymentPhone"
                          render={({ field }) => (
                            <FormItem className="text-gray-700 text-base flex flex-col mt-1 space-y-0">
                              <FormLabel className="text-gray-700 font-normal text-base mb-0.5">
                                What is the phone number to use for top up?
                              </FormLabel>
                              <div className="flex items-center text-gray-700 rounded-sm">
                                <div className="flex px-1.5 border rounded-l-sm border-gray-200 items-center justify-center h-10 bg-slate-200">
                                  +254
                                </div>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    placeholder="712345678"
                                    required
                                    className="rounded-l-none"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage className="text-red-500 font-normal text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Separator className="mb-0 mt-4" />
                    <div className="font-semibold">Recipient Organization</div>
                    <dl className="grid 1.5">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Account Name</dt>
                        <dd className="font-bold text-base">Jobs Radar</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email Address</dt>
                        <dd>
                          <a href="mailto:">info@hired.co.ke</a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="mt-2 mb-1" />
                  <div className="grid gap-1.5">
                    <div className="font-semibold">
                      Final Payment Information
                    </div>
                    <ul className="grid gap-1.5">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Transaction Phone
                        </span>
                        {formattedPhone.length > 0 ? (
                          <span>+245{formattedPhone}</span>
                        ) : (
                          <span>+245*********</span>
                        )}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Transaction Fee
                        </span>
                        <span>Ksh. 00</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">
                          Total Payable
                        </span>
                        <span>Ksh. {watchedAmount}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center mt-1.5 border-t border-b bg-muted/70 px-3 py-2">
                <div className="text-xs text-gray-700">
                  <p>
                    <span className="font-medium">Note: </span>This transaction
                    is private. You will be asked PIN to validate.
                  </p>
                </div>
              </CardFooter>
            </Card>
            <div className="mt-2 space-x-4 flex items-center justify-end w-full">
              <Button
                onClick={handleClose}
                type="button"
                variant="secondary"
                size="lg"
                className="border-gray-300 border bg-slate-200 rounded-sm"
              >
                Cancel
              </Button>
              <Button
                size="lg"
                type="submit"
                disabled={isLoading || isSubmitting}
                className="rounded-sm hover:bg-primary hover:opacity-90"
              >
                {isLoading ? (
                  <span className="items-center flex">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  <>Buy Now</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default NewTopUpAlertModal;
