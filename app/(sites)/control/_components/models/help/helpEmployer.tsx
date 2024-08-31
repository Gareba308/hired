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
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label as ReChartLabel,
} from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { HelpEmployer } from "@prisma/client";
type FormSchemaType = z.infer<typeof formSchema>;

const MAX_CHARACTERS = 500;

export const formSchema = z.object({
  message: z.string(),
});

interface HelpReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: HelpEmployer;
}
const HelpEmployerReplyAlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: HelpReplyModalProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { control } = form;
  const text = useWatch({ control, name: "message" }) || "";

  const remainingCharacters = MAX_CHARACTERS - text.length;

  const totalTasks = MAX_CHARACTERS;
  const colors = ["#e2e8f0", remainingCharacters === 0 ? "#dc2626" : "#1e293b"];
  const tasks = [
    { name: "Remaining Characters", value: remainingCharacters },
    { name: "Used Characters", value: totalTasks - remainingCharacters },
  ];

  const { isSubmitting } = form.formState;

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const { mutate: replyHelpMessage, isLoading: loadingReplyHelp } =
    trpc.adminReplyEmployerHelp.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your reply message has been delivered.",
          variant: "default",
          duration: 3000,
        });
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
            description: "There was a problem sending your reply message",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    replyHelpMessage({ ...values, helpMessageID: message.id });
  };
  return (
    <Modal
      title="Reply to help message"
      description="Write an employer a reply to their help message"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div>
        <div className="mb-2 -mt-2 -space-y-1 leading-tight">
          <h2 className="font-medium text-gray-600 text-base">
            Subject: {message.subject}
          </h2>
          <h2 className="font-medium text-gray-600 text-base">
            Sender: {message.fullName}
          </h2>
          <p className="text-sm font-normal text-gray-700">
            <span className="font-bold">Message:</span>{" "}
            <span className="line-clamp-2">{message.message}</span>
          </p>
        </div>
        <fieldset className="grid rounded-lg border border-slate-300 p-4">
          <legend className="-ml-1 px-1 text-base sm:text-lg text-gray-700 font-medium">
            Reply to help message
          </legend>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-base mt-6 space-y-0">
                    <Label htmlFor="message" className="text-gray-600">
                      Message
                    </Label>
                    <div className="relative overflow-hidden rounded-sm border bg-background focus-within:ring-1 focus-within:ring-ring">
                      <FormControl>
                        <Textarea
                          id="message"
                          maxRows={4}
                          required
                          disabled={loadingReplyHelp || isSubmitting}
                          rows={4}
                          {...field}
                          minRows={4}
                          maxLength={MAX_CHARACTERS}
                          placeholder="What is on your mind...?"
                          className="min-h-12 resize-none placeholder:text-gray-500 border-0 p-3 shadow-none focus-visible:ring-0 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                        />
                      </FormControl>
                      <div className="flex items-center mt-1 p-3 pt-0">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full relative">
                            <div className="relative flex items-center justify-center rounded-full h-full w-full">
                              <ResponsiveContainer
                                width="100%"
                                height={200}
                                style={{ outline: "none" }}
                              >
                                <PieChart className="no-chart-outline">
                                  <Pie
                                    data={tasks}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={14}
                                    outerRadius={18}
                                    fill="#8884d8"
                                    startAngle={90}
                                    endAngle={450}
                                    paddingAngle={0}
                                    labelLine={false}
                                    style={{ outline: "none", border: "none" }}
                                  >
                                    {tasks.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index]}
                                        style={{
                                          outline: "none",
                                          border: "none",
                                        }}
                                      />
                                    ))}
                                    <ReChartLabel
                                      className="flex text-xs items-center justify-center"
                                      position="center"
                                    >
                                      {remainingCharacters}
                                    </ReChartLabel>
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={loadingReplyHelp || isSubmitting}
                          size="sm"
                          className="ml-auto gap-1.5 hover:bg-primary hover:opacity-90"
                        >
                          Send
                          {loadingReplyHelp || isSubmitting ? (
                            <Loader2 className="h-4 w-4 ml-0.5 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </fieldset>
      </div>
    </Modal>
  );
};

export default HelpEmployerReplyAlertModal;
