"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import CloudUpload from "@/components/CloudUpload";
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
import {
  Job,
  AssessmentBanner,
  AcceptToBeAssessed,
  User,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/Editor";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { z } from "zod";
import { CheckSquare, FolderOpen, Loader2, Megaphone } from "lucide-react";
import AllAssessments from "./AllAssessments";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type FormSchemaTypes = z.infer<typeof formSchema>;

export const formSchema = z.object({
  whyMostQualified: z.string(),
  useGeneratedResume: z.boolean(),
  useUploadedCover: z.boolean().default(false),
  coverLetterUrl: z.string(),
});
interface ApplyJobProps {
  job: Job;
  user: User;
  banners: AssessmentBanner[];
  acceptedAssessments: AcceptToBeAssessed[];
  assessmentIds: string[];
  resume: string | null;
}

const maxCharacters = 2000;
const nilCharacters = 0;
const NewApplyJob = ({
  job,
  user,
  banners,
  acceptedAssessments,
  assessmentIds,
  resume,
}: ApplyJobProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchemaTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyMostQualified: "",
      useGeneratedResume: false,
      useUploadedCover: false,
      coverLetterUrl: "",
    },
  });

  const { isSubmitting } = form.formState;

  const { control } = form;
  const editorRef = useRef<ReactQuill | null>(null);
  const text = useWatch({ control, name: "whyMostQualified" }) || "";
  const watchCoverLetter = useWatch({ control, name: "useUploadedCover" });
  const agreeToUploadedCover = watchCoverLetter === true;
  const watchResume = useWatch({ control, name: "useGeneratedResume" });

  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;

  const excessCharacters = nilCharacters - remainingCharacters;

  const { mutate: createApplication, isLoading } =
    trpc.workerCreateApplication.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully submitted you job application",
          variant: "default",
          duration: 3000,
        });
        router.push("/site/jobs");
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
              "There was a problem submitting your job application. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (value: FormSchemaTypes) => {
    createApplication({
      ...value,
      jobId: job.id,
      companyId: job.companyId,
      isEmployerID: job.isEmployerID,
    });
  };
  const isSubmitDisabled = assessmentIds.some((id) => {
    const assessment = acceptedAssessments.find((a) => a.testId === id);
    return !assessment || assessment.status === "UNINITIATED";
  });
  return (
    <>
      <div className="pt-4 mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6">
        <div className="lg:col-span-2 lg:border-r  lg:border-gray-200 lg:pr-6 lg:mb-3">
          <div className="w-full">
            <div className="border-b border-gray-200 pb-2">
              <span className="inline-flex items-center rounded-sm bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                Easy Apply
              </span>
              <h2 className="font-semibold mb-2 tracking-tight text-xl md:text-2xl text-primary">
                {job?.job_title}
              </h2>
              {job.company_name && (
                <p className="text-base font-normal text-gray-800">
                  <span className="font-medium mr-2">Company:</span>{" "}
                  {job.company_name}
                </p>
              )}
              {job.county && (
                <p className="text-base font-normal text-gray-800">
                  <span className="font-medium mr-2">County:</span> {job.county}
                </p>
              )}
              {user.name && (
                <p className="flex items-center text-base font-normal">
                  <span className="font-medium mr-2">Full Name:</span>{" "}
                  {user.name}
                </p>
              )}
              {user.email && (
                <p className="flex items-center text-base font-normal">
                  <span className="font-medium mr-2">User Email:</span>{" "}
                  <span className="text-blue-600">{user.email}</span>
                </p>
              )}
            </div>
            <div>
              <p className="text-xs sm:text-base text-gray-800 mt-1">
                <b>Note: </b>
                <span className="italic text-xs sm:text-base">
                  You can choose to upload a cover letter or let us generate one
                  for you. For a generated one you&apos;ll <b>ONLY</b> write the{" "}
                  <b>body</b>
                </span>
              </p>
              <p className="text-xs sm:text-base text-gray-800 mt-2">
                <b>Hint: </b>
                <span className="italic text-xs sm:text-base">
                  Our system generates a professional resume from your
                  portfolio, ready for application submission.
                </span>
              </p>
              {banners.length !== 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    Required Assessment(s)
                  </h2>
                  <p className="text-sm mb-2">
                    Please note that this job requires you to complete the
                    following assessment(s) before submitting your application.
                  </p>
                  <AllAssessments
                    jobId={job.id}
                    banners={banners}
                    acceptedAssessments={acceptedAssessments}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <div className="hidden lg:block pt-4 lg:pb-5 lg:space-y-3 lg:bg-slate-200 lg:border border-slate-200 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-5 lg:px-3">
            <h2 className="text-xl text-primary flex justify-center">
              <Megaphone className="h-12 w-12" />
            </h2>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Our system streamlines the job application process, ensuring
                that all applications submitted through this platform are
                directly delivered to the employer.
              </span>
            </p>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Feedback on your job application will be communicated to you via
                email or our messaging system. Please note that applying is free
                of charge.
              </span>
            </p>
          </div>

          <div className="mt-12 hidden lg:block pt-4 lg:pb-5 lg:space-y-3 lg:bg-slate-200 lg:border border-slate-200 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-5 lg:px-3">
            <h2 className="text-xl text-primary flex justify-center">
              <FolderOpen className="h-12 w-12" />
            </h2>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Before submitting your job application, please ensure your
                portfolio and profile is up to date. Our system will also
                automatically generate a resume for you.
              </span>
            </p>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                If the employer requires you to take a test, please ensure that
                the necessary assessment is completed before submitting your job
                application.
              </span>
            </p>
          </div>
        </div>

        <div className="py-4 -mt-5 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-8 lg:pr-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="useGeneratedResume"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel className="text-base">
                      Would you like to use your own uploaded resume?
                    </FormLabel>
                    <div className="flex flex-row items-center space-x-2 -space-y-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-base">
                        Yes, I want to use my own uploaded resume.
                      </FormLabel>
                    </div>
                    <FormMessage className="text-red-500 font-normal text-xs sm:text-base">
                      {watchResume === true && !resume && (
                        <span>
                          You haven&apos;t uploaded your resume in{" "}
                          <b>Portfolio Section</b>. <Link href="/site/portfolio">Upload Now</Link>
                        </span>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="useUploadedCover"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-3">
                    <FormLabel className="text-base">
                      Do you prefer to upload your own cover letter?
                    </FormLabel>
                    <div className="flex flex-row items-center space-x-2 -space-y-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-base">
                        Yes, I want upload my own cover letter.
                      </FormLabel>
                    </div>
                    <FormMessage className="text-red-500 font-normal text-base" />
                  </FormItem>
                )}
              />

              {agreeToUploadedCover && (
                <FormField
                  control={form.control}
                  name="coverLetterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-base">
                        Upload your cover letter here. It must be up to date in
                        respect to this job
                      </FormLabel>
                      <FormControl>
                        <CloudUpload
                          disabled={isLoading}
                          onChange={(url) => field.onChange(url)}
                          value={field.value ? field.value : ""}
                          onRemove={() => field.onChange("")}
                          accept="application/pdf"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!agreeToUploadedCover && (
                <FormField
                  control={form.control}
                  name="whyMostQualified"
                  disabled={isSubmitting || isLoading}
                  render={({ field }) => (
                    <FormItem className="text-gray-800 mt-2 text-base">
                      <div className="flex flex-col">
                        <FormLabel className="text-lg font-semibold">
                          Justify Why You&apos;re Qualified
                          <span className="text-red-600 pl-1">*</span>
                        </FormLabel>
                        <FormLabel className="font-normal text-base text-gray-800">
                          <span className="font-bold">Q: </span>Considering your
                          qualifications, experience, skills, and understanding
                          of this role, explain why you are the ideal candidate
                          for this position.
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Editor
                          disabled={isLoading}
                          {...field}
                          ref={(editor) => (editorRef.current = editor)}
                        />
                      </FormControl>
                      <FormMessage className="font-normal text-base">
                        {remainingCharacters >= 0 ? (
                          <span className="text-gray-800">
                            Max Characters:{" "}
                            <b className="text-gray-800">
                              {remainingCharacters}/{maxCharacters}
                            </b>
                          </span>
                        ) : (
                          <span className="flex flex-col">
                            <span className="text-red-600">
                              You have reached maximum characters
                            </span>
                            <span className="-mt-0.5 text-gray-800">
                              Excess Characters:{" "}
                              <b className="text-red-600">{excessCharacters}</b>
                            </span>
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}
              <Button
                type="submit"
                size="lg"
                variant="default"
                className="hover:bg-primary mt-2 hover:opacity-90 w-full py-3 text-base rounded-sm font-normal sm:w-[200px]"
                disabled={isLoading || isSubmitting || isSubmitDisabled || watchResume === true && !resume}
              >
                {isLoading || isSubmitting ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                ) : (
                  <>Submit Application</>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default NewApplyJob;
