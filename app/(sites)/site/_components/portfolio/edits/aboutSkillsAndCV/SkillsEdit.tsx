import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skills } from "@prisma/client";
import { Loader2, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useCachedSkills } from "../../../data/create-job/AllSkills";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Chip } from "@mui/material";
import { Separator } from "@/components/ui/separator";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  skills: z
    .array(z.string())
    .refine(
      (skill) => skill.length >= 5,
      "Kindly ensure you have a minimum of 5 skills"
    ),
});

interface SkillsProps {
  skills: Skills;
  toggleCreate: () => void;
}

const SkillsEdit = ({ skills, toggleCreate }: SkillsProps) => {
  const allSkills = useCachedSkills();
  const { toast } = useToast();
  const filterOptions = createFilterOptions<string>({
    stringify: (option) => option,
    ignoreCase: true,
    limit: 100,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: skills.skills ? skills.skills : [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: deleteSkills, isLoading: loadingDeleteSkills } =
    trpc.workerDeleteSkills.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted you skills record",
          variant: "default",
          duration: 3000,
        });
        toggleCreate();
        router.refresh();
      },

      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem deleting your skills record. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const { mutate: updateSkills, isLoading } =
    trpc.workerUpdateSkills.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated you skills record",
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
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem updating your skills record. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onsubmit = async (values: FormSchemaType) => {
    updateSkills({ ...values, skillsID: skills.id });
  };

  const deleteSubmit = () => {
    deleteSkills({ skillsID: skills.id });
  };

  return (
    <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
      <dt className="text-base leading-6 text-gray-600">
        <div className="flex flex-1 justify-between bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit items-center py-1.5 lg:py-0 lg:px-0 px-2">
          <div className="text-lg font-medium text-gray-600">
            Professional Skills
          </div>
          {!isEditing && (
            <div className="ml-4 pl-4 h-5 lg:hidden lg:ml-8 flex-shrink-0 flex justify-between items-center">
              <Button
                variant="link"
                type="button"
                size="sm"
                disabled={loadingDeleteSkills || isLoading}
                className="font-normal flex items-center"
                onClick={toggleEdit}
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" />
              <Button
                variant="link"
                size="sm"
                type="button"
                onClick={deleteSubmit}
                disabled={loadingDeleteSkills || isLoading}
              >
                {loadingDeleteSkills ? (
                  <Loader2 className="h-4 w-4 animate-spin text-destructive-foreground" />
                ) : (
                  <Trash className="h-4 w-4 text-destructive-foreground" />
                )}
              </Button>
            </div>
          )}
        </div>
      </dt>
      <dd className=" text-gray-600 sm:col-span-2 px-2">
        <ul role="list" className="">
          <li className="justify-between flex flex-1 ">
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)}>
                      <div className="-mb-2">
                        <Label className="text-base font-normal">
                          Start typing select relevant professional skills from
                          the suggestion list or remove some skills as you so
                          wish.
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field: { ref, onChange, ...field } }) => (
                          <Autocomplete
                            multiple
                            limitTags={6}
                            options={allSkills}
                            fullWidth
                            disabled={isLoading || isSubmitting}
                            defaultValue={skills.skills}
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
                              <FormItem className="text-gray-700">
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
                                <FormMessage className="text-red-500 font-normal text-base" />
                              </FormItem>
                            )}
                            filterOptions={filterOptions}
                            onChange={(_, data) => onChange(data)}
                          />
                        )}
                      />
                      <div className="flex flex-col gap-4 sm:flex-row mt-4 justify-start items-center">
                        <button
                          type="submit"
                          disabled={isLoading || isSubmitting}
                          className="rounded-sm w-full font-medium lg:w-[120px] bg-primary border border-primary text-primary-foreground py-2.5 flex items-center justify-center"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="h-5 w-5 animate-spin" />
                            </span>
                          ) : (
                            <span>Update</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={toggleEdit}
                          disabled={isLoading || isSubmitting}
                          className="rounded-sm font-medium w-full lg:w-[120px] bg-slate-200 border border-gray-300 text-secondary-foreground py-2.5 flex items-center justify-center"
                        >
                          <span>Close</span>
                        </button>
                      </div>
                    </form>
                  </Form>
                </span>
              ) : (
                <div className="lg:border lg:border-gray-200 h-full rounded-md pb-1">
                  <div className="hidden lg:flex flex-row items-center justify-between bg-secondary border-b border-gray-200 py-1.5 px-2">
                    <h2 className="text-lg font-medium text-gray-600">
                      My professional Skills
                    </h2>
                    {!isEditing && (
                      <div className="ml-4 mt-2 hidden pl-4 lg:ml-8 flex-shrink-0 lg:flex h-5 items-center justify-between">
                        <Button
                          variant="link"
                          type="button"
                          size="sm"
                          disabled={loadingDeleteSkills || isLoading}
                          className="font-normal flex items-center"
                          onClick={toggleEdit}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" />
                        <Button
                          variant="link"
                          size="sm"
                          type="button"
                          onClick={deleteSubmit}
                          disabled={loadingDeleteSkills || isLoading}
                        >
                          {loadingDeleteSkills ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive-foreground" />
                          ) : (
                            <Trash className="h-4 w-4 text-destructive-foreground" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-white lg:px-2 pt-2">
                    {skills.skills.length !== 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 sm:mt-1.5">
                        {skills.skills.map((skill, index) => (
                          <ul key={index} className="ml-6">
                            <li className="list-disc">{skill}</li>
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <>
                        <span className="italic">
                          No details on skills found. Please click{" "}
                          <span className="font-medium">edit</span> to fill in
                          your professional skills record.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </dd>
    </div>
  );
};

export default SkillsEdit;
