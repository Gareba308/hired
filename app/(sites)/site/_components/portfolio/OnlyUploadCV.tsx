import { Resume } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import ImageUpload from "@/components/ImageUpload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import CreatedResume from "./created/CreatedResume";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  resume: z.string(),
});
interface OnlyUploadCVProps {
  resume: Resume | null;
}

const OnlyUploadCV = ({ resume }: OnlyUploadCVProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const toggleCreate = () => setIsCreating((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: uploadResume, isLoading } =
    trpc.workerUploadResume.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully uploaded your resume",
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
            description: "There was a problem uploading your resume",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onsubmit = async (values: FormSchemaType) => {
    uploadResume({ ...values });
  };
  return (
    <>
      {resume ? (
        <>
          <CreatedResume resume={resume} toggleCreate={toggleCreate} />
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}>
            <div className="font-normal mt-5 sm:mt-8 lg:mt-0 space-y-4">
              <dl className="border lg:border-t-0 lg:border-r-0 lg:border-l-0 rounded-none border-gray-200">
                <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-600 bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-2 lg:py-0 lg:px-0 px-2">
                    Upload your CV
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base bg-white px-2">
                    {isCreating ? (
                      <div>
                        <FormField
                          control={form.control}
                          name="resume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-normal text-base">
                                Upload an upto date CV
                              </FormLabel>
                              <FormControl>
                                <ImageUpload
                                  disabled={isLoading}
                                  onChange={(url) => field.onChange(url)}
                                  value={field.value ? field.value : ""}
                                  onRemove={() => field.onChange("")}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage />
                            </FormItem>
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
                                My Uploaded CV
                              </h2>
                            </div>
                            <div className="lg:pl-4 lg:pt-2 lg:pb-4">
                              <p className="text-start mb-1">
                                Link to your uploaded CV will appear here.
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
                                  Upload Current CV
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
      )}
    </>
  );
};

export default OnlyUploadCV;
