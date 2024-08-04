import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
import QuillPreview from "@/components/QuillPreview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { About } from "@prisma/client";
import { Loader2, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ReactQuill from "react-quill";
import { z } from "zod";

type FormSchemaType = z.infer<typeof formSchema>;
const maxCharacters = 600;
const nilCharacters = 0;
export const formSchema = z.object({
  about: z.string(),
});

interface AboutEditProps {
  about: About;
  toggleCreate: () => void;
}

const AboutEdit = ({ about, toggleCreate }: AboutEditProps) => {
  const { toast } = useToast();

  const router = useRouter();
  const editorRef = useRef<ReactQuill | null>(null);
  const [currentlyDeletingAbout, setCurrentlyDeletingAbout] = useState<
    string | null
  >(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: about.about ? about.about : "",
    },
  });
  const { control } = form;
  const text = useWatch({ control, name: "about" }) || "";
  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;
  const excessCharacters = nilCharacters - remainingCharacters;
  const { isSubmitting } = form.formState;

  const { mutate: deleteAbout, isLoading: loadingDeleteAbout } =
    trpc.workerDeleteAbout.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted your about summary",
          variant: "default",
          duration: 3000,
        });
        toggleCreate();
        router.refresh();
      },
      onMutate: ({ aboutID }) => {
        setCurrentlyDeletingAbout(aboutID);
      },
      onSettled: () => {
        setCurrentlyDeletingAbout(null);
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
              "There was a problem deleting your about summary. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const { mutate: updateAbout, isLoading } = trpc.workerUpdateAbout.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated your about section",
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
              "There was a problem updating your about record. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    }
  );

  const onsubmit = async (values: FormSchemaType) => {
    updateAbout({ ...values, aboutID: about.id });
  };

  const deleteSubmit = () => {
    deleteAbout({ aboutID: about.id });
  };
  return (
    <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
      <dt className="text-base leading-6 text-gray-600">
        <div className="flex flex-1 justify-between bg-secondary border-b lg:border-none border-gray-200 lg:bg-inherit items-center py-1.5 lg:py-0 lg:px-0 px-2">
          <div className="text-lg font-medium text-gray-600">Summary</div>
          {!isEditing && (
            <div className="ml-4 pl-4 h-5 lg:hidden lg:ml-8 flex-shrink-0 flex justify-between items-center">
              <Button
                variant="link"
                type="button"
                size="sm"
                disabled={loadingDeleteAbout || isLoading}
                className="font-normal flex items-center"
                onClick={toggleEdit}
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" />
              <Button
                variant="link"
                type="button"
                size="sm"
                onClick={deleteSubmit}
                disabled={loadingDeleteAbout || isLoading}
              >
                {loadingDeleteAbout && currentlyDeletingAbout === about.id ? (
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
                      <div className=""></div>
                      <FormField
                        control={form.control}
                        name="about"
                        disabled={
                          isLoading || isSubmitting || remainingCharacters < 0
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base">
                              Update your about summary.
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
                        <button
                          type="submit"
                          disabled={
                            isLoading || isSubmitting || remainingCharacters < 0
                          }
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
                <div className="lg:border lg:border-gray-200 rounded-md h-full pb-2">
                  <div className="hidden lg:flex flex-row items-center justify-between bg-secondary border-b border-gray-200 py-1.5 px-2">
                    <h2 className="text-gray-600 text-lg font-medium">
                      My Summary
                    </h2>
                    {!isEditing && (
                      <div className="ml-4 mt-2 hidden pl-4 lg:ml-8 flex-shrink-0 lg:flex h-5 items-center justify-between">
                        <Button
                          variant="link"
                          type="button"
                          size="sm"
                          disabled={loadingDeleteAbout || isLoading}
                          className="font-normal flex items-center"
                          onClick={toggleEdit}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>

                        <Separator orientation="vertical" />

                        <Button
                          variant="link"
                          type="button"
                          size="sm"
                          onClick={deleteSubmit}
                          disabled={loadingDeleteAbout || isLoading}
                        >
                          {loadingDeleteAbout &&
                          currentlyDeletingAbout === about.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive-foreground" />
                          ) : (
                            <Trash className="h-4 w-4 text-destructive-foreground" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-white lg:px-2 pt-1">
                    {about.about ? (
                      <div className="mt-2 w-full text-base text-gray-700">
                        <QuillPreview htmlContent={about.about} />
                      </div>
                    ) : (
                      <>
                        <span className="italic text-gray-600">
                          No details on about found. Please click{" "}
                          <span className="font-medium">edit</span> to fill in
                          your about record.
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

export default AboutEdit;
