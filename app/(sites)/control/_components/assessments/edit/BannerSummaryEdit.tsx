// import { Blogs } from "@prisma/client"

// interface BodyEditProps{
//   blog: Blogs
// }

// const BodyEdit = ({blog}: BodyEditProps) => {
//   return (
//     <div>BodyEdit</div>
//   )
// }

// export default BodyEdit

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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssessmentBanner} from "@prisma/client";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { z } from "zod";

interface BodyEditProps {
  banner: AssessmentBanner;
}

type FormSchemaType = z.infer<typeof formSchema>;
const MAX_BODY_WORDS = 28;
export const formSchema = z.object({
  briefSummary: z.string(),
});

const BannerSummaryEdit = ({ banner }: BodyEditProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const editorRef = useRef<ReactQuill | null>(null);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      briefSummary: banner.briefSummary ? banner.briefSummary : "",
    },
  });

  const { control } = form;
  const watchBody = useWatch({ control, name: "briefSummary" }) || "";

  function countWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  const bodyWords = countWords(watchBody);
  const typedWords = bodyWords - 1;
  const { isSubmitting } = form.formState;
  const { mutate: editBodySummary, isLoading } = trpc.adminEditAssessmentBanner.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully updated the banner's brief summary",
          variant: "default",
          duration: 3000,
        });
        toggleEdit();
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem trying to update the banner's brief summary.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    }
  );

  const onSubmit = (values: FormSchemaType) => {
    editBodySummary({ ...values, bannerID: banner.id });
  };
  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Brief Summary
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
                        name="briefSummary"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-col">
                              <FormLabel className="font-normal text-base text-gray-700">
                                Update banner&apos;s brief summary
                              </FormLabel>
                              <Label>My Words: {typedWords}</Label>
                            </div>
                            <FormControl>
                              <Editor
                                {...field}
                                ref={(editor) => (editorRef.current = editor)}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-normal text-sm">
                              {bodyWords > MAX_BODY_WORDS && (
                                <>Maximum body words is {MAX_BODY_WORDS}.</>
                              )}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-x-8 lg:gap-6 justify-start mt-4">
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
                          The Banner&apos;s Summary
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
                    {banner.briefSummary ? (
                      <div className="font-normal text-gray-800 text-base -mt-0.5 w-full">
                        <Preview value={banner.briefSummary} />
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500">
                        Content is not available
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

export default BannerSummaryEdit;
