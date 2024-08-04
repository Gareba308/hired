"use client";

import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Job,
  User,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import ReactQuill from "react-quill";
import { z } from "zod";
import {
  CheckSquare,
  FolderOpen,
  Loader2,
  Megaphone,
} from "lucide-react";

type FormSchemaTypes = z.infer<typeof formSchema>;

export const formSchema = z.object({
  whyMostQualified: z.string(),
});
interface ApplyJobProps {
  job: Job;
  user: User;
}

const maxCharacters = 2000;
const nilCharacters = 0;
const ApplyJob = ({
  job,
  user,
}: ApplyJobProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const editorRef = useRef<ReactQuill | null>(null);

  const form = useForm<FormSchemaTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyMostQualified: "",
    },
  });

  const { isSubmitting,} = form.formState;

  const { control } = form;

  const text = useWatch({ control, name: "whyMostQualified" }) || "";

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

  const onSubmit = (value: FormSchemaTypes) => {
    createApplication({
      ...value,
      jobId: job.id,
      companyId: job.companyId,
      isEmployerID: job.isEmployerID,
    });
  };
  return (
    <>
      <div className="pt-4 mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6">
        <div className="lg:col-span-2 lg:border-r  lg:border-gray-200 lg:pr-6 lg:mb-3">
          <div className="w-full">
            <div className="border-b border-gray-200 pb-2">
           <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                Easy Apply
              </span>
              <h2 className="font-semibold mb-2 tracking-tight text-2xl text-primary">
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
              <p className="text-base text-gray-800 mt-1">
                <span>Note: </span>
                <span className="italic text-sm">
                  Part of your portfolio details will be merged together with
                  this cover letter to form your full application.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <div className="hidden lg:block pt-4 lg:pb-5 lg:space-y-3 lg:bg-sky-100 lg:border border-sky-100 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-5 lg:px-3">
            <h2 className="text-xl text-primary flex justify-center">
              <Megaphone className="h-12 w-12" />
            </h2>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Job settings provides you opportunity to make changes to a job,
                add more filter details so as to get quality candidates.
              </span>
            </p>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Deleting a job, will see you lose other details related to the
                job, such as application.
              </span>
            </p>
          </div>

          <div className="mt-12 hidden lg:block pt-4 lg:pb-5 lg:space-y-3 lg:bg-sky-100 lg:border border-sky-100 lg:rounded-md lg:shadow-sm lg:-mx-3 lg:pt-5 lg:px-3">
            <h2 className="text-xl text-primary flex justify-center">
              <FolderOpen className="h-12 w-12" />
            </h2>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Job settings provides you opportunity to make changes to a job,
                add more filter details so as to get quality candidates.
              </span>
            </p>

            <p className="tracking-normal text-base flex items-start gap-2">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <span>
                Deleting a job, will see you lose other details related to the
                job, such as application.
              </span>
            </p>
          </div>
        </div>

        <div className="py-4 -mt-5 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-8 lg:pr-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="whyMostQualified"
                disabled={isSubmitting || isLoading}
                render={({ field }) => (
                  <FormItem className="text-gray-800 text-base">
                    <div className="flex flex-col">
                      <FormLabel className="text-xl">
                        Application Cover Letter
                        <span className="text-red-600 pl-1">*</span>
                      </FormLabel>
                      <FormLabel className="font-normal text-base text-gray-800">
                        <span className="font-bold">Q: </span>Based on you
                        qualifications, experiences, skills and the
                        understanding of this job role, why do you think you are
                        the most suitable candidate for this position?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Editor
                        disabled={isLoading || isSubmitting}
                        {...field}
                        ref={editorRef}
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
              <Button
                type="submit"
                size="lg"
                variant="default"
                className="hover:bg-primary mt-2 hover:opacity-90 w-full py-3 text-base rounded-sm font-normal sm:w-[200px]"
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
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

export default ApplyJob;
