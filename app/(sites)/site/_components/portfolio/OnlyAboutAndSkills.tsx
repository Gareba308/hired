import { trpc } from "@/app/_trpc/client";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  About,
  Award,
  CertificationLicense,
  Language,
  Resume,
  Skills,
} from "@prisma/client";
import { ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useCachedSkills } from "../data/create-job/AllSkills";
import { Label } from "@/components/ui/label";
import SkillsCreated from "./created/SkillsCreated";
import AboutOnly from "./AboutOnly";
import { Chip } from "@mui/material";
import OnlyUploadCV from "./OnlyUploadCV";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import OnlyCertification from "./OnlyCertification";
import OnlyAwards from "./OnlyAwards";
import OnlyLanguage from "./OnlyLanguage";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  skills: z
    .array(z.string())
    .refine(
      (skill) => skill.length >= 5,
      "Kindly select a minimum of 5 skills"
    ),
});

interface AboutProps {
  skills: Skills | null;
  about: About | null;
  resume: Resume | null;
  certification: CertificationLicense[];
  awards: Award[];
  languages: Language[];
}

const OnlyAboutAndSkills = ({
  skills,
  about,
  resume,
  certification,
  awards,
  languages,
}: AboutProps) => {
  const allSkills = useCachedSkills();

  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const toggleCreate = () => setIsCreating((current) => !current);

  const [showMore, setShowMore] = useState<boolean>(false);

  const toggleMore = () => setShowMore((current) => !current);

  const filterOptions = createFilterOptions<string>({
    stringify: (option) => option,
    ignoreCase: true,
    limit: 100,
  });

  const router = useRouter();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting } = form.formState;

  const { mutate: createSkills, isLoading } =
    trpc.workerCreateSkills.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully created the skills section",
          variant: "default",
          duration: 3000,
        });

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
            description: "There was a problem submitting your data",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onsubmit = async (values: FormSchemaType) => {
    createSkills({ ...values });
  };
  return (
    <>
      <div className="">
        <h2 className="font-bold text-gray-600 text-xl sm:text-2xl">
          Competence Section
        </h2>
        <p className="text-gray-600 text-base my-1">
          Fill in required details to create this section of your portfolio, to
          help recruiters know you better. We will keep all sensitive
          information private. User profile helps employer know who you are.
        </p>
      </div>
      {skills ? (
        <>
          <SkillsCreated skills={skills} toggleCreate={toggleCreate} />
        </>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)}>
              <div className="font-normal mt-4">
                <dl className="lg:border-r-0 lg:border-l-0 border border-gray-200 bg-white rounded-none lg:rounded-none">
                  <div className="lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                    <dt className="font-medium text-lg leading-6 text-gray-600 bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-2 lg:py-0 lg:px-0 px-2">
                      Professional skills<span className="text-red-500 ml-0.5">*</span>
                    </dt>

                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base bg-white px-2">
                      {isCreating ? (
                        <div>
                          <div className="-mb-2">
                            <Label className="text-base font-normal">
                              Start typing select relevant skills from the
                              list that will help tell your professional
                              qualification and experience.
                            </Label>
                          </div>

                          <FormField
                            control={form.control}
                            name="skills"
                            render={({
                              field: { ref, onChange, ...field },
                            }) => (
                              <Autocomplete
                                multiple
                                limitTags={6}
                                options={allSkills}
                                disabled={isLoading || isSubmitting}
                                fullWidth
                                filterSelectedOptions
                                renderOption={(props, option) => {
                                  return (
                                    <li {...props} key={option}>
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
                                onChange={(_, data) => onChange(data)}
                                filterOptions={filterOptions}
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
                                <span>Save</span>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={toggleCreate}
                              disabled={isLoading || isSubmitting}
                              className="rounded-sm font-medium w-full lg:w-[120px] bg-slate-200 border border-gray-300 text-secondary-foreground py-2.5 flex items-center justify-center"
                            >
                              <span>Close</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="sm:py-4">
                          <div className="lg:border lg:border-gray-200 rounded-none">
                            <div className="hidden lg:flex bg-secondary border-b border-gray-200 py-1.5 pl-4">
                              <h2 className="text-lg font-medium text-gray-600">
                                My professional skills
                              </h2>
                            </div>
                            <div className="lg:pl-4 lg:pt-2 lg:pb-4">
                              <p className="text-start mb-1">
                                All the professional skills you pick will appear
                                here.
                              </p>
                              <div className="flex items-center justify-start ">
                                <Button
                                  size="lg"
                                  variant="outline"
                                  type="button"
                                  onClick={toggleCreate}
                                  className="text-gray-600 text-[15px] hover:bg-inherit hover:text-primary hover:underline"
                                >
                                  <Plus className="h-5 w-5 mr-1.5" />
                                  Add Your Skills
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </form>
          </Form>
        </>
      )}
      <AboutOnly about={about} />
      <OnlyUploadCV resume={resume} />
      <OnlyCertification certification={certification} />
      <div className="flex items-center justify-start my-4">
        {!showMore ? (
          <button
            type="button"
            onClick={toggleMore}
            className="flex items-center flex-row justify-center text-primary text-lg font-medium hover:underline"
          >
            <ChevronDown className="h-5 w-5 mr-1.5" />
            Add more sections
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleMore}
            className="flex items-center flex-row justify-center text-primary text-lg font-medium hover:underline"
          >
            <ChevronUp className="h-5 w-5 mr-1.5" />
            Show less sections
          </button>
        )}
      </div>
      {showMore && (
        <>
          <OnlyAwards awards={awards} />
          <OnlyLanguage languages={languages} />
        </>
      )}
    </>
  );
};

export default OnlyAboutAndSkills;
