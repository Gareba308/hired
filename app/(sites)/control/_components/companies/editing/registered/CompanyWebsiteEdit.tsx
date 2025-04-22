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
import { Company } from "@prisma/client";
import { GripVertical, Loader2, PenLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  companyWebsite: z.string().optional(),
});

interface CompanyWebsiteEditProps {
  company: Company ;
}
const CompanyWebsiteEdit = ({ company }: CompanyWebsiteEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      companyWebsite: company.website ? company.website : "",
    },
  });

  const { mutate: updateJob, isLoading } = trpc.adminUpdateRegisteredCompany.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The company website has successfully been updated",
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
          description: "There was a problem updating the company website",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const onSubmit = (values: ReminderFormSchemaType) => {
    updateJob({ ...values, companyID: company.id });
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-700">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Company website
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
      <dd className="text-gray-700 sm:col-span-2">
        <ul role="list">
          <li>
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="companyWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base">
                              Update the company website
                            </FormLabel>
                            <div className="flex items-center text-gray-700 rounded-sm">
                              <div className="flex px-1.5 border rounded-l-sm border-gray-200 items-center justify-center h-10 bg-gray-200">
                                https://
                              </div>
                              <FormControl className="">
                                <Input
                                  disabled={isLoading}
                                  placeholder="www.example.com/job"
                                  className="rounded-l-none"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const cleanedValue = value.replace(
                                      /^https?:\/\//,
                                      ""
                                    );
                                    field.onChange(cleanedValue);
                                  }}
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="text-red-500 font-normal text-sm" />
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
                            className="rounded-sm font-medium w-full lg:w-[120px] bg-gray-200 border border-gray-300 text-secondary-foreground py-3 flex items-center justify-center"
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
                        <h2 className="text-base font-medium text-gray-700">
                          The Company&apos;s Website
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
                    {company.website ? (
                      <div className="font-medium text-blue-700 break-words text-base -mt-0.5 w-full">
                        {company.website}
                      </div>
                    ) : (
                      <span className="italic text-sm text-gray-500">
                        No company website details
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

export default CompanyWebsiteEdit;
