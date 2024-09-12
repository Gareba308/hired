"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AssessmentBanner } from "@prisma/client";
import QuillPreview from "@/components/QuillPreview";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormSchemaType = z.infer<typeof formSchema>;
export const formSchema = z.object({
  acceptBeTested: z.boolean().default(false),
});
interface AcceptAssessmentAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  banner: AssessmentBanner;
  jobId: string;
}

export const AcceptAssessmentAlertModal: React.FC<
  AcceptAssessmentAlertProps
> = ({ isOpen, onClose, onConfirm, banner, jobId }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptBeTested: false,
    },
  });
  const { mutate: acceptAssessment, isLoading } =
    trpc.workerAcceptAssessment.useMutation({
      onSuccess: () => {
        toast({
          title: "Proceeding to assessment",
          description: "You have accepted to proceed to the assessment section",
          variant: "default",
          duration: 3000,
        });
        onConfirm();
        router.push(`/site/jobs/apply/${jobId}/${banner.id}?origin=site/jobs/apply/${jobId}`);
      },
      onError: (err) => {
        if (err) {
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
              "There was a problem setting up your assessment details. Try again later",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = (values: FormSchemaType) => {
    acceptAssessment({ ...values, testId: banner.id });
  };
  return (
    <Modal
      title="Instructions to the assessment"
      description="Carefully read and understand the provided instructions. Check 'accept' to proceed to the test."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-1">
              <div className="font-semibold">Detailed Instructions</div>
              <ul className="grid gap-1">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Test:
                  </span>
                  <span>{banner.name}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Date:
                  </span>
                  <span suppressHydrationWarning>{format(new Date(), "PPP")}</span>
                </li>
              </ul>
              <Separator className="my-1.5" />
              <div className="text-gray-700 text-sm">
                <QuillPreview htmlContent={banner.instructions as string} />
              </div>
            </div>
          </div>
        </CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardFooter className="flex flex-row items-center mt-3 border-t border-b bg-muted/70 px-3 py-3">
              <div className="text-sm text-gray-700">
                <FormField
                  control={form.control}
                  name="acceptBeTested"
                  render={({ field }) => (
                    <FormItem className="flex flex-col text-base">
                      <FormLabel>Accept to proceed:</FormLabel>
                      <div className="flex flex-row items-center space-x-2.5">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            disabled={isLoading}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label className="font-normal">
                          I have read and understood the instructions
                        </Label>
                      </div>
                      <FormMessage className="text-red-500 font-normal text-base" />
                    </FormItem>
                  )}
                />
              </div>
            </CardFooter>
            <div className="mt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                className="rounded-sm bg-slate-200 border border-gray-200"
                size="lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                variant="default"
                type="submit"
                className="hover:bg-primary text-base font-normal hover:opacity-90 border border-slate-200"
              >
                Proceed
                {isLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 ml-1.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 ml-1.5" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </Modal>
  );
};