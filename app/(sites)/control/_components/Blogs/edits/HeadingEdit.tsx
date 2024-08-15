"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Blogs } from "@prisma/client";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

interface HeadingEditProps {
  blog: Blogs;
}

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  heading: z.string().optional(),
});
const MIN_CHARACTERS = 40;
const MAX_CHARACTERS = 75;

const HeadingEdit = ({ blog }: HeadingEditProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: blog.heading ? blog.heading : "",
    },
  });

  const { control } = form;
  const { isSubmitting } = form.formState;
  const watchedHeading = useWatch({ control, name: "heading" }) || "";
  const watchedHeadingLength = watchedHeading.length;
  const { mutate: editHeading, isLoading } = trpc.adminEditBlogPost.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully updated the heading",
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
              "There was a problem trying to update the blog's heading.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    }
  );

  const onSubmit = (values: FormSchemaType) => {
    editHeading({ ...values, blogId: blog.id });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARACTERS) {
      form.setValue("heading", inputValue);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const trimmedText = pastedText.slice(0, MAX_CHARACTERS);
    form.setValue("heading", trimmedText);
    e.preventDefault();
  };
  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Blog Heading
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
                        name="heading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base">
                              Update the blog&apos;s heading
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="Accountant"
                                className="w-full"
                                {...field}
                                onChange={(e) => {
                                  handleInputChange(e);
                                }}
                                onPaste={(e) => {
                                  handlePaste(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-normal text-sm">
                              {watchedHeading &&
                                watchedHeading.length === MAX_CHARACTERS && (
                                  <>
                                    Maximum character limit of {MAX_CHARACTERS}{" "}
                                    reached.
                                  </>
                                )}
                              {watchedHeading &&
                                watchedHeadingLength < MIN_CHARACTERS && (
                                  <>
                                    You haven&apos;t reached minimum characters
                                    of {MIN_CHARACTERS}
                                  </>
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
                          The Blog&apos;s Heading
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
                    {blog.heading ? (
                      <div className="font-normal text-gray-800 text-base -mt-0.5 w-full">
                        {blog.heading}
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500">
                        Heading is not available
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

export default HeadingEdit;
