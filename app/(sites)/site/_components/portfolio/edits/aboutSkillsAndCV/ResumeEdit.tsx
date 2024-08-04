import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resume } from "@prisma/client";
import { File, Link, Loader2, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  resume: z.string(),
});

interface ResumeEditProps {
  resume: Resume;
  toggleCreate: () => void;
}

const ResumeEdit = ({ resume, toggleCreate }: ResumeEditProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [currentlyDeletingResume, setCurrentlyDeletingResume] = useState<
    string | null
  >(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: resume.resume ? resume.resume : "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: deleteResume, isLoading: loadingDeleteResume } =
    trpc.workerDeleteResume.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted your resume",
          variant: "default",
          duration: 3000,
        });
        toggleCreate();
        router.refresh();
      },
      onMutate({ resumeID }) {
        setCurrentlyDeletingResume(resumeID);
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
              "There was a problem deleting your resume. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onSettled() {
        setCurrentlyDeletingResume(null);
      },
    });

  const { mutate: updateResume, isLoading } =
    trpc.workerUpdateResume.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated your resume",
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
              "There was a problem updating your resume. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onsubmit = async (values: FormSchemaType) => {
    updateResume({ ...values, resumeID: resume.id });
  };

  const deleteSubmit = () => {
    deleteResume({ resumeID: resume.id });
  };
  return (
    <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
      <dt className="text-base leading-6 text-gray-600">
        <div className="flex flex-1 justify-between bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit items-center py-1.5 lg:py-0 lg:px-0 px-2">
          <div className="text-lg font-medium text-gray-600">Resume</div>
          {!isEditing && (
            <div className="ml-4 pl-4 h-5 lg:hidden lg:ml-8 flex-shrink-0 flex justify-between items-center">
              <Button
                variant="link"
                type="button"
                size="sm"
                disabled={loadingDeleteResume || isLoading}
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
                disabled={loadingDeleteResume || isLoading}
              >
                {loadingDeleteResume &&
                currentlyDeletingResume === resume.id ? (
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
                        name="resume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base">
                              Update your CV
                            </FormLabel>
                            <FormControl>
                              <ImageUpload
                                disabled={isLoading}
                                onChange={(url) => field.onChange(url)}
                                value={field.value ? field.value : ""}
                                onRemove={() => field.onChange("")}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-normal text-base" />
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
                      My Uploaded CV
                    </h2>
                    {!isEditing && (
                      <div className="ml-4 mt-2 hidden pl-4 lg:ml-8 flex-shrink-0 lg:flex h-5 items-center justify-between">
                        <Button
                          variant="link"
                          type="button"
                          size="sm"
                          disabled={loadingDeleteResume || isLoading}
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
                          disabled={loadingDeleteResume || isLoading}
                        >
                          {loadingDeleteResume ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive-foreground" />
                          ) : (
                            <Trash className="h-4 w-4 text-destructive-foreground" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-white lg:px-2 py-3" >
                    {resume ? (
                      <div className="w-full truncate">
                        <a
                          href={resume.resume as string}
                          target="_blank"
                          className="truncate text-primary hover:underline flex items-center"
                        >
                          <File className="w-4 h-4 mr-1" />
                          Here is the uploaded CV. Click to view.
                        </a>
                      </div>
                    ) : (
                      <>
                        <span className="italic">
                          No details on CV found. Please click{" "}
                          <span className="font-medium">edit</span> to upload
                          your CV.
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

export default ResumeEdit;
