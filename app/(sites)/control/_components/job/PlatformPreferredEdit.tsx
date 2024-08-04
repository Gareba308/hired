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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import EmailPlatformEdit from "./EmailPlatformEdit";
import LinkPlatformEdit from "./LinkPlatformEdit";
import OtherPlatformEdit from "./OtherPlatformEdit";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  platform: z.string(),
});

interface TitleEditProps {
  job: Job | null;
  jobId: string;
}
const PlatformPreferredEdit = ({ job, jobId }: TitleEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      platform: job?.platform ? job.platform : "",
    },
  });

  const { control } = form;

  const platformMethod = useWatch({ control, name: "platform" }) || "";

  const isEmail = platformMethod === "email";
  const isLink = platformMethod === "link";
  const isOther = platformMethod === "office";

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "The preferred external application platform method has successfully been updated.",
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
            "There was a problem updating the preferred external application platform method",
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
    <>
      <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
        <dt className="font-medium pb-2">
          <div className="flex items-center justify-between">
            <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Application Method
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
                          disabled={isLoading}
                          control={form.control}
                          name="platform"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-normal text-base text-gray-800">
                                Update your preferred external method to receive
                                job applications?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  disabled={isLoading}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="email" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Submit via email address
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="link" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Through URL link
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="office" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Physically submit application
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-base" />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 lg:gap-6 justify-start mt-4">
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
                            My External Application Platform
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
                      {job?.platform ? (
                        <div className="font-normal text-base text-gray-800 -mt-0.5 w-full">
                          {job?.platform === "email" && <>Via email address</>}
                          {job?.platform === "link" && (
                            <>Via external URL link</>
                          )}
                          {job?.platform === "office" && (
                            <>Physical submission and/or other methods</>
                          )}
                        </div>
                      ) : (
                        <span className="italic text-sm text-gray-500">
                          No external application platform method found.
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
      {isEmail && job?.platform ==='email' && <EmailPlatformEdit job={job} jobId={job?.id as string} />}
      {isLink && job?.platform === 'link' && <LinkPlatformEdit job={job} jobId={job?.id as string} />}
      {isOther && job?.platform === 'office' && <OtherPlatformEdit job={job} jobId={job?.id as string} />}
    </>
  );
};

export default PlatformPreferredEdit;
