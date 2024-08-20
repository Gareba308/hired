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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, PickAssessCandidate } from "@prisma/client";
import {
  GripVertical,
  Loader2,
  PenLine,
  CheckIcon,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  assessmentOneID: z.string().optional(),
});

interface TitleEditProps {
  job: Job | null;
  jobId: string;
  orderedAssessments: PickAssessCandidate[];
}
const AssessmentOneIDEdit = ({
  job,
  jobId,
  orderedAssessments,
}: TitleEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);
  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      assessmentOneID: job?.assessmentOneID ? job?.assessmentOneID : "",
    },
  });

  const shownAssessment = orderedAssessments.find(
    (picked) => picked.testID === job?.assessmentOneID
  );

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "The job assessment details have successfully been updated",
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
          description: "There was a problem updating the assessment details",
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
  const [popoverOpen1, setPopoverOpen1] = useState<boolean>(false);
  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Assessment One
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
      <dd className="text-gray-700 sm:col-span-2">
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
                        name="assessmentOneID"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-normal text-base text-gray-700">
                              Update the assessment you would like included in
                              the job listing?
                              <span className="text-xs text-gray-600">
                                (e.g., Talanta Language Test)
                              </span>
                            </FormLabel>
                            <Popover
                              open={popoverOpen1}
                              onOpenChange={setPopoverOpen1}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={isLoading}
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? orderedAssessments.find(
                                          (test) => test.testID === field.value
                                        )?.testName
                                      : "---Select the test name---"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                <Command>
                                  <CommandInput placeholder="Search for assessment..." />
                                  <CommandEmpty>
                                    No assessment found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {orderedAssessments
                                      .sort((a, b) =>
                                        a.testName!.localeCompare(b.testName!)
                                      )
                                      .map((test) => (
                                        <CommandItem
                                          value={test.testID}
                                          key={test.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "assessmentOneID",
                                              test.testID
                                            );
                                            setPopoverOpen1(false);
                                          }}
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              test.testID === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {test.testName}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-sm" />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-start mt-4">
                        <button
                          type="submit"
                          disabled={isLoading || isSubmitting}
                          className={cn(
                            "rounded-sm w-full font-medium lg:w-[120px] bg-primary border border-primary text-primary-foreground py-3 flex items-center hover:opacity-90 justify-center",
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
                    <div className="flex w-full justify-between items-center">
                      <h2 className="font-medium text-gray-700">
                        Assessment Name:
                      </h2>
                      {!isEditing && (
                        <div className="ml-4 hidden lg:flex pl-4 lg:ml-8 flex-shrink-0">
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
                    {job?.assessmentOneID ? (
                      <div className="lg:-mt-1">
                        <span className="font-normal text-gray-700 text-base">
                          {shownAssessment?.testName}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="italic text-sm text-gray-500">
                          No record found.
                        </span>
                      </div>
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

export default AssessmentOneIDEdit;
