import { trpc } from "@/app/_trpc/client";
import {
  Form,
  FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormSchemaType = z.infer<typeof formSchema>;

const maxCharacters = 500;

export const formSchema = z.object({
  subject: z.string(),
  report: z.string(),
});

interface JobReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobId: string;
}
const JobReportModal = ({
  isOpen,
  onClose,
  onConfirm,
  jobId,
}: JobReportModalProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      report: "",
    },
  });

  const { control } = form;
  const text = useWatch({ control, name: "report" }) || "";

  const remainingCharacters = maxCharacters - text.length;

  const { isSubmitting } = form.formState;

  const { mutate: createReport, isLoading } = trpc.workerReportJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you. We have received your report about this job.",
        variant: "default",
        duration: 3000,
      });
      router.refresh();
      onConfirm();
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
            "There was a problem submitting this report. Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const onSubmit = async (values: FormSchemaType) => {
    createReport({ ...values, jobId: jobId });
  };
  return (
    <Modal
      title="REPORT THIS JOB"
      description="Write us a private report about this job. We take all the details private."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-base">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="text-gray-700 text-base flex flex-col space-y-0">
                  <FormLabel className="text-gray-700 text-base mb-0.5">
                    Subject
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl className="w-full">
                      <SelectTrigger disabled={isLoading || isSubmitting}>
                        <SelectValue
                          className="text-gray-400"
                          placeholder="---Select subject---"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full text-gray-700">
                      <SelectItem value="Inaccurate Job Details">
                        Inaccurate Job Details
                      </SelectItem>
                      <SelectItem value="Unprofessional Behavior">
                        Unprofessional Behavior
                      </SelectItem>
                      <SelectItem value="Payment Issues">
                        Payment Issues
                      </SelectItem>
                      <SelectItem value="Job Scams">Job Scams</SelectItem>
                      <SelectItem value="Lack of Response">
                        Lack of Response
                      </SelectItem>
                      <SelectItem value="Violation of Labor Laws">
                        Others
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 font-normal text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="report"
              render={({ field }) => (
                <FormItem className="text-gray-700 text-base mt-6 space-y-0">
                  <div className="flex flex-col">
                    <FormLabel className="text-gray-700 text-base">
                      Report
                    </FormLabel>
                    <Label className="font-normal mt-0.5 mb-0.5">
                      Max Characters: {remainingCharacters}
                    </Label>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      required
                      className="resize-none"
                      disabled={isLoading || isSubmitting}
                      placeholder="Write your report here..."
                      maxLength={maxCharacters}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-normal text-sm">
                    {remainingCharacters <= 0 && (
                      <>You have reached maximum characters length.</>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />

            <div className="pt-4 space-x-4 flex items-center justify-start w-full">
              <Button
                size="lg"
                type="submit"
                disabled={isLoading || isSubmitting || remainingCharacters <= 0}
                className="rounded-sm hover:bg-primary hover:opacity-90"
              >
                {isLoading ? (
                  <span className="items-center flex">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  <>Submit</>
                )}
              </Button>
              <Button
                onClick={onClose}
                type="button"
                variant="secondary"
                size="lg"
                className="border-gray-300 border bg-slate-200 rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default JobReportModal;
