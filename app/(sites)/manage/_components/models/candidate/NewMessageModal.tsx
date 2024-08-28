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
import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import React, {useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label as ReChartLabel,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
type FormSchemaType = z.infer<typeof formSchema>;

const MAX_CHARACTERS = 500;

export const formSchema = z.object({
  subject: z.string(),
  message: z.string(),
});

interface NewCandidateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
  userName: string;
}
const NewCandidateMessageModal = ({
  isOpen,
  onClose,
  onConfirm,
  userId,
  userName
}: NewCandidateMessageModalProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
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

  const { mutate: sendMessage, isLoading } =
    trpc.employerContactWorker.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your message to the worker has been delivered.",
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
            description:
              "There was a problem sending your message. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    sendMessage({ ...values, userId:userId });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Modal
      title="Start a new conversation?"
      description="Compose a message that concerns a candidate's job application or profile."
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div>
        {userName && (
          <div className="mb-2">
            <h2 className="font-bold text-gray-600 text-xl">{userName}</h2>
          </div>
        )}
        <fieldset className="grid rounded-lg border border-slate-300 p-4">
          <legend className="-ml-1 px-1 text-lg text-gray-700 font-medium">
            Compose New Message
          </legend>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-sm mt-4 flex flex-col space-y-0">
                    <FormLabel className="text-gray-600 text-sm mb-0.5">
                      Subject
                    </FormLabel>
                    <Select required onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger disabled={isLoading || isSubmitting}>
                          <SelectValue
                            className="text-gray-400"
                            placeholder="---Select subject---"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full max-h-[300px] overflow-y-auto text-gray-700">
                        <SelectItem value="Incomplete User Profile">
                          Incomplete User Profile
                        </SelectItem>
                        <SelectItem value="Incomplete Portfolio">
                          Incomplete Portfolio
                        </SelectItem>
                        <SelectItem value="Target Audience">
                          Target Audience
                        </SelectItem>
                        <SelectItem value="Posting Duration">
                          Posting Duration
                        </SelectItem>
                        <SelectItem value="Promotional Strategies">
                          Promotional Strategies
                        </SelectItem>
                        <SelectItem value="Application Process">
                          Application Process
                        </SelectItem>
                        <SelectItem value="Response Handling">
                          Response Handling
                        </SelectItem>
                        <SelectItem value="Feedback Mechanism">
                          Feedback Mechanism
                        </SelectItem>
                        <SelectItem value="Job Performance Monitoring">
                          Job Performance Monitoring
                        </SelectItem>
                        <SelectItem value="Job Scam Concern">
                          Job Scam Concern
                        </SelectItem>
                        <SelectItem value="Other Concerns">
                          Other Concerns
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-base mt-4 space-y-0">
                    <Label htmlFor="message" className="text-gray-600">
                      Message
                    </Label>
                    <div className="relative overflow-hidden rounded-sm border bg-background focus-within:ring-1 focus-within:ring-ring">
                      <FormControl>
                        <Textarea
                          id="message"
                          maxRows={4}
                          required
                          disabled={isLoading || isSubmitting}
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
                          disabled={isLoading || isSubmitting}
                          size="sm"
                          className="ml-auto gap-1.5 hover:bg-primary hover:opacity-90"
                        >
                          Send
                          {isLoading || isSubmitting ? (
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

export default NewCandidateMessageModal;
