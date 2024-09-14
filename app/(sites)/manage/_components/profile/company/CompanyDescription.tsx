"use client";

import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
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
import { Company } from "@prisma/client";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { z } from "zod";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  company_description: z.string(),
});
interface CompanyDescriptionProps {
  profile: Company;
}
const CompanyDescription = ({ profile }: CompanyDescriptionProps) => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_description: profile.company_description
        ? profile.company_description
        : "",
    },
  });

  const { mutate: update, isLoading } = trpc.updateEmployerProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated company's description",
        variant: "default",
        duration: 3000,
      });
      toggleEdit();
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was a problem updating company's description",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    update({ ...values, profileId: profile.id });
  };

  return (
    <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
      <dt className="font-medium leading-6 text-gray-700">
        <div className="flex flex-1 justify-between">
          <div className="text-base flex items-center">
            <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
            Description
          </div>
          {!isEditing && (
            <div className="ml-4 pl-4 lg:hidden lg:ml-8 flex-shrink-0">
              <Button
                variant="secondary"
                type="button"
                size="sm"
                className="font-normal flex items-center text-primary"
                onClick={toggleEdit}
              >
                <PenLine className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>
      </dt>
      <dd className=" text-gray-600 lg:col-span-2">
        <ul role="list" className="">
          <li className="justify-between flex flex-1 ">
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="company_description"
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className="font-normal text-gray-700">
                                Update company&apos;s description?
                              </FormLabel>
                              <FormControl>
                                <Editor
                                  disabled={isLoading}
                                  {...field}
                                  ref={(editor) => (editorRef.current = editor)}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-base" />
                            </FormItem>
                          )}
                        />
                      </div>
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
                <>
                  <div className="hidden lg:flex justify-between items-center">
                    <h2 className="font-medium text-gray-700 text-base">
                      The company&apos;s description
                    </h2>
                    <Button
                      variant="secondary"
                      type="button"
                      size="sm"
                      className="font-normal flex items-center text-primary"
                      onClick={toggleEdit}
                    >
                      <PenLine className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                  {profile.company_description ? (
                    <>
                      {profile.company_description && (
                        <div className="font-normal text-base w-full text-gray-600">
                          <Preview
                            value={profile.company_description}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="italic text-sm text-gray-500">
                      No record found
                    </span>
                  )}
                </>
              )}
            </div>
          </li>
        </ul>
      </dd>
    </div>
  );
};

export default CompanyDescription;
