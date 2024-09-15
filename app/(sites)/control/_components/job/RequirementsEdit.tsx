"use client";
import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
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
import {
  Autocomplete,
  Chip,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { Job } from "@prisma/client";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { z } from "zod";
import { useCachedSkills } from "../data/create-job/AllSkills";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  requirement: z.string(),
  personal_skills: z
    .array(z.string())
    .refine(
      (skill) => skill.length >= 4,
      "Kindly ensure you have a minimum of 4 skills."
    )
    .optional(),
});
const minSkills = 4;
const nilSkills = 0;
interface TitleEditProps {
  job: Job | null;
  jobId: string;
}
const RequirementsEdit = ({ job, jobId }: TitleEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const allSkills = useCachedSkills();
  const filterOptions = createFilterOptions<string>({
    stringify: (option) => option,
    ignoreCase: true,
    limit: 100,
  });
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      requirement: job?.requirement ? job?.requirement : "",
      personal_skills: job?.personal_skills ? job.personal_skills : [],
    },
  });

  const { control } = form;
  const skillsHere = useWatch({ control, name: "personal_skills" }) || [];
  const skillsLength = skillsHere.length;

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "The job qualification requirements has successfully been updated",
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
            "There was a problem updating the job qualification requirements",
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
              Qualifications & Skills
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
                        name="personal_skills"
                        render={({ field: { ref, onChange, ...field } }) => (
                          <Autocomplete
                            multiple
                            limitTags={6}
                            options={allSkills}
                            fullWidth
                            disabled={isLoading || isSubmitting}
                            defaultValue={job?.personal_skills}
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
                                  Update skills requirement
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
                                    placeholder="Start typing to search a skill"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 font-normal text-base">
                                  {skillsLength < minSkills && (
                                    <>
                                      Kindly ensure you have a minimum of 4
                                      skills.
                                    </>
                                  )}
                                </FormMessage>
                              </FormItem>
                            )}
                            filterOptions={filterOptions}
                            onChange={(_, data) => onChange(data)}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="requirement"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel className="font-normal text-base text-gray-800">
                              Update the job qualification detailed summary
                            </FormLabel>
                            <FormControl>
                              <Editor
                                {...field}
                                ref={(editor) => (editorRef.current = editor)}
                              />
                            </FormControl>
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
                  <div>
                    <div className="lg:flex justify-between items-center hidden">
                      <div>
                        <h2 className="text-base font-medium text-gray-800">
                          The Job&apos;s Desired Skills
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
                    {job?.personal_skills.length !== nilSkills ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 -mt-0.5">
                        {job?.personal_skills.map((skill) => (
                          <ul key={skill} className="ml-6 text-gray-800">
                            <li className="list-disc">{skill}</li>
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500 -mt-0.5">
                        No skills detail found
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="text-base font-medium text-gray-800">
                      The Job&apos;s Qualification Summary
                    </h2>
                    {job?.requirement ? (
                      <div className="font-normal text-gray-800 text-base -mt-1.5 w-full">
                        <Preview value={job?.requirement} />
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500 -mt-0.5">
                        No job qualifications details found
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

export default RequirementsEdit;
