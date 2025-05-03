"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import {
  CheckIcon,
  ChevronDown,
  GripVertical,
  Loader2,
  PenLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { counties } from "../data/create-job/CreateJobData";
import { Label } from "@/components/ui/label";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  county: z.string().optional(),
  address: z.string().optional(),
});

interface TitleEditProps {
  job: Job | null;
  jobId: string;
}
const CountyEdit = ({ job, jobId }: TitleEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      county: job?.county ? job.county : "",
      address: job?.address ? job.address : "",
    },
  });

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Successfully updated location",
        description: "The job location details have successfully been updated",
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
          description: "There was a problem updating the location details",
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
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Job Location
            </div>
          </div>
          {!isEditing && (
            <div className="ml-4 lg:hidden flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="text-primary hover:text-primary hover:opacity-90"
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
                      <Label className="font-normal text-gray-800">
                        Update job location&apos;s details?
                      </Label>
                      <div className="flex flex-col gap-3 mt-1 sm:flex-row sm:items-center sm:gap-2 w-full">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className="font-normal text-base">
                                County
                              </FormLabel>
                              <Popover
                              open={popoverOpen}
                              onOpenChange={setPopoverOpen}
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
                                        ? counties.find(
                                            (county) =>
                                              county.value === field.value
                                          )?.label
                                        : "Select location county"}
                                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                  <Command>
                                    <CommandInput placeholder="Search county..." />
                                    <CommandEmpty>
                                      No county found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {counties
                                        .sort((a, b) =>
                                          a.label.localeCompare(b.label)
                                        )
                                        .map((county) => (
                                          <CommandItem
                                            value={county.label}
                                            key={county.value}
                                            disabled={isLoading}
                                            onSelect={() => {
                                              form.setValue(
                                                "county",
                                                county.value
                                              );
                                              setPopoverOpen(false);
                                            }}
                                          >
                                            <CheckIcon
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                county.value === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {county.label}
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormDescription></FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="font-normal text-base">
                                Physical location
                              </FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  maxLength={30}
                                  placeholder="e.g. Jambo House Waiyaki Way"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-normal text-red-600" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-x-8 lg:gap-6 justify-start mt-4">
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
                      <h2 className="font-medium text-gray-800">County:</h2>
                      {!isEditing && (
                        <div className="ml-4 hidden lg:flex pl-4 lg:ml-8 flex-shrink-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            className="text-primary hover:text-primary hover:opacity-90"
                            onClick={toggleEdit}
                          >
                            <PenLine className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      )}
                    </div>
                    {job?.county ? (
                      <div className="lg:-mt-1">
                        <span className="font-normal text-gray-800 text-base">
                          {job?.county}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="italic text-sm text-gray-500">
                          No record found. Please update county details
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="font-medium text-gray-800">
                      Physical Address:
                    </h2>
                    {job?.address ? (
                      <div>
                        <span className="font-normal text-gray-800 text-base">
                          {job.address}
                        </span>
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500">
                        No record found.Please update your address
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

export default CountyEdit;
