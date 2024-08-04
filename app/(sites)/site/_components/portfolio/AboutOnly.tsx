import { trpc } from "@/app/_trpc/client";
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
import { About } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import AboutCreated from "./created/AboutCreated";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { Editor } from "@/components/Editor";
import ReactQuill from "react-quill";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  about: z.string(),
});

interface AboutProps {
  about: About | null;
}
const maxCharacters = 600;
const nilCharacters = 0;

const AboutOnly = ({ about }: AboutProps) => {
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const toggleCreate = () => setIsCreating((current) => !current);
  const editorRef = useRef<ReactQuill | null>(null);
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const { control } = form;
  const text = useWatch({ control, name: "about" }) || "";
  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;
  const excessCharacters = nilCharacters - remainingCharacters;
  const { isSubmitting } = form.formState;

  const { mutate: createAbout, isLoading } = trpc.workerCreateAbout.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully created the about section",
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
    }
  );

  const onsubmit = async (values: FormSchemaType) => {
    createAbout({ ...values });
  };
  return (
    <>
      {about ? (
        <>
          <AboutCreated about={about} toggleCreate={toggleCreate} />
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}>
            <div className="font-normal mt-5 sm:mt-8 lg:mt-0 space-y-4">
              <dl className="border lg:border-t-0 lg:border-r-0 lg:border-l-0 rounded-none border-gray-200">
                <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-600 bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-2 lg:py-0 lg:px-0 px-2">
                    Summary<span className="text-red-500 ml-0.5">*</span>
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base bg-white px-2">
                    {isCreating ? (
                      <div>
                        <FormField
                          control={form.control}
                          name="about"
                          disabled={
                            isLoading || isSubmitting || remainingCharacters < 0
                          }
                          render={({ field }) => (
                            <FormItem className="text-gray-700">
                              <FormLabel className="font-normal text-base text-gray-600">
                                Write an official summary about yourself,
                                briefly explaining who you are, your skills and
                                even qualifications.
                              </FormLabel>
                              <Label className="text-base font-normal flex">
                                {remainingCharacters >= 0 ? (
                                  <p className="-mt-1.5">
                                    Max Characters Left:{" "}
                                    <b className="text-gray-700">
                                      {remainingCharacters}/{maxCharacters}
                                    </b>
                                  </p>
                                ) : (
                                  <div className="-mt-1.5">
                                    <p className="text-red-600">
                                      You have reached maximum characters
                                    </p>
                                    <p className="-mt-0.5">
                                      Excess Characters:{" "}
                                      <b className="text-red-600">
                                        {excessCharacters}
                                      </b>
                                    </p>
                                  </div>
                                )}
                              </Label>
                              <FormControl>
                                <Editor
                                  {...field}
                                  ref={(editor) => (editorRef.current = editor)}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 font-normal text-sm" />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col gap-4 sm:flex-row mt-4 justify-start items-center">
                          {isLoading ||
                          isSubmitting ||
                          remainingCharacters < 0 ? (
                            <button
                              type="submit"
                              disabled={
                                isLoading ||
                                isSubmitting ||
                                remainingCharacters < 0
                              }
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
                          ) : (
                            <button
                              type="submit"
                              disabled={
                                isLoading ||
                                isSubmitting ||
                                remainingCharacters < 0
                              }
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
                          )}
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
                              My professional summary
                            </h2>
                          </div>
                          <div className="lg:pl-4 lg:pt-2 lg:pb-4">
                            <p className="text-start mb-1">
                              Your professional summary will appear here.
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
                                Create Your Summary
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

export default AboutOnly;
