"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import { GripVertical, Loader2, PenLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  jobFormNonRegisteredCompany: z.boolean().optional(),
});

interface NonRegisteredEditProps {
  job: Job | null;
  jobId: string;
}
const NonRegisteredEdit = ({ job, jobId }: NonRegisteredEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      jobFormNonRegisteredCompany: job?.jobFormNonRegisteredCompany
    },
  });

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "The company's registration confirmation details updated successfully'",
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
          description:
            "There was a problem updating the company's registration confirmation details'",
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
              Non-Registered?
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
                      <FormField
                        control={form.control}
                        name="jobFormNonRegisteredCompany"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="flex items-start justify-between flex-row w-full gap-x-4">
                              <div>
                                <FormLabel className="text-base font-normal">
                                  Is job company unregistered in database?
                                </FormLabel>
                              </div>
                              <FormControl>
                              <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-x-8 lg:gap-6 justify-start mt-4">
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
                          The Company&apos;s Registration
                        </h2>
                      </div>
                      <div>
                        {!isEditing && (
                          <div className="ml-2 flex-shrink-0">
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
                    </div>
                    {job?.jobFormNonRegisteredCompany ? (
                      <div className="font-normal text-gray-800 text-base -mt-0.5 w-full">
                        {job?.jobFormNonRegisteredCompany === true ? (
                          <>Non Registered Company</>
                        ) : (
                          <>Registered Company</>
                        )}
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500">
                        No unregistered details found
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

export default NonRegisteredEdit;
