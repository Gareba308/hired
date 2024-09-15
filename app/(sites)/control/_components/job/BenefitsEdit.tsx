"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Chip,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { Job } from "@prisma/client";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useBenefits } from "../data/create-job/Benefits";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  benefits: z.array(z.string()),
});
const maxBenefitsCharacters = 400;
const nilBenefitsCharacters = 0;

interface TitleEditProps {
  job: Job | null;
  jobId: string;
}
const BenefitsEdit = ({ job, jobId }: TitleEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const allBenefits = useBenefits();
  const { toast } = useToast();
  const filteredBenefits = createFilterOptions<string>({
    stringify: (option) => option,
    ignoreCase: true,
    limit: 100,
  });
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      benefits: job?.benefits ? job.benefits : [],
    },
  });

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The benefits details have successfully been updated",
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
          description: "There was a problem updating the benefits details",
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
              Additional Benefits
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
                        name="benefits"
                        render={({ field: { ref, onChange, ...field } }) => (
                          <Autocomplete
                            multiple
                            limitTags={6}
                            options={allBenefits}
                            fullWidth
                            disabled={isLoading || isSubmitting}
                            defaultValue={job?.benefits}
                            filterSelectedOptions
                            renderOption={(props, option) => {
                              return (
                                <li
                                  {...props}
                                  key={option}
                                  style={{
                                    fontSize: "0.88rem",
                                    lineHeight: "1.35rem",
                                  }}
                                >
                                  {option}
                                </li>
                              );
                            }}
                            renderTags={(tagValue, getTagProps) => {
                              return tagValue.map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option}
                                  label={option}
                                />
                              ));
                            }}
                            sx={{ width: "100%" }}
                            renderInput={(params) => (
                              <FormItem className="text-gray-800">
                                <FormLabel className="text-gray-800 font-normal text-base">
                                  Update the job&apos;s benefits
                                </FormLabel>
                                <FormControl>
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    onChange={onChange}
                                    disabled={isLoading}
                                    margin="normal"
                                    fullWidth
                                    inputRef={ref}
                                    placeholder="Start typing to search for benefits"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 font-normal text-[14px]" />
                              </FormItem>
                            )}
                            filterOptions={filteredBenefits}
                            onChange={(_, data) => onChange(data)}
                          />
                        )}
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 sm:gap-8 justify-start mt-4">
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
                          Job&apos;s Additional Benefits
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
                    {job?.benefits.length !== 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 -mt-0.5">
                        {job?.benefits.map((benefit) => (
                          <ul key={benefit} className="ml-6 text-gray-800">
                            <li className="list-disc">{benefit}</li>
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500 -mt-0.5">
                        No benefits detail found
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

export default BenefitsEdit;
