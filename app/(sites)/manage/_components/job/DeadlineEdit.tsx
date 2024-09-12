"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import { CalendarIcon, GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  deadline: z.coerce.date(),
});

interface TitleEditProps {
  job: Job | null;
  jobId: string;
}
const DeadlineEdit = ({ job, jobId }: TitleEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      deadline: job?.deadline!,
    },
  });

  const { mutate: updateJob, isLoading } = trpc.employerUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Successfully updated application deadline",
        description: "The application deadline has successfully been updated",
        variant: "default",
        duration: 3000,
      });
      toggleEdit();
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
          description: "There was a problem updating the application deadline",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const onSubmit = (values: ReminderFormSchemaType) => {
    updateJob({ ...values, jobID: jobId });
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Application Deadline
            </div>
          </div>
          {!isEditing && (
            <div className="ml-4 lg:hidden flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="text-primary hover:text-primary rounded-md"
                onClick={toggleEdit}
              >
                <PenLine className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>
      </dt>
      <dd className="text-gray-800 sm:col-span-2">
        <ul role="list">
          <li>
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-normal">
                              Update the job application deadline
                            </FormLabel>
                            <Popover
                              open={popoverOpen}
                              onOpenChange={setPopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    suppressHydrationWarning
                                    className={cn(
                                      "w-full sm:w-[350px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setPopoverOpen(false);
                                  }}
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-start mt-4">
                        <button
                          type="submit"
                          disabled={isLoading || isSubmitting}
                          className={cn(
                            "rounded-sm w-full font-medium lg:w-[120px] bg-primary border hover:opacity-90 border-primary text-primary-foreground py-3 flex items-center justify-center",
                            isLoading || isSubmitting ? "opacity-90" : ""
                          )}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="h-5 w-5 animate-spin" />
                            </span>
                          ) : (
                            <span>Update</span>
                          )}
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={toggleEdit}
                            disabled={isLoading || isSubmitting}
                            className="rounded-sm font-medium w-full lg:w-[120px] bg-slate-200 border border-gray-300 text-secondary-foreground py-3 flex items-center justify-center"
                          >
                            <span>Close</span>
                          </button>
                        )}
                      </div>
                    </form>
                  </Form>
                </span>
              ) : (
                <>
                  <div className="-mt-2">
                    <div className="lg:flex justify-between items-center hidden">
                      <div>
                        <h2 className="text-base font-medium text-gray-800">
                          Job&apos;s Application Deadline
                        </h2>
                      </div>
                      <div>
                        {!isEditing && (
                          <div className="ml-2 flex-shrink-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              type="button"
                              className="text-primary hover:text-primary rounded-md"
                              onClick={toggleEdit}
                            >
                              <PenLine className="h-4 w-4 mr-1" /> Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {job?.deadline ? (
                      <div suppressHydrationWarning className="font-normal text-base text-gray-500 -mt-0.5 w-full">
                        {format(job.deadline, "PPP")}
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500">
                        No deadline details
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </li>
        </ul>
      </dd>
    </div>
  );
};

export default DeadlineEdit;
