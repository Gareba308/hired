"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import {
  CheckIcon,
  ChevronDown,
  GripVertical,
  Loader2,
  PenLine,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { allSubcategories } from "../data/create-job/CreateJobData";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  subCategory: z.string().optional(),
});

interface SubCategoryEditProps {
  job: Job | null;
  jobId: string;
}

const getCustomCategory = (category: any) => {
    switch (category) {
      case "Information Technology (IT) and Software Development":
        return "ITSubcategory";
      case "Healthcare and Medical":
        return "HealthcareSubcategory";
      case "Finance, Accounting and Insurance":
        return "FinanceSubcategory";
      case "Sales and Marketing":
        return "SalesSubcategory";
      case "Security and law enforcement":
        return "SecuritySubcategory";
      case "Education and Teaching":
        return "EducationSubcategory";
      case "Customer Service and Support":
        return "CustomerSubcategory";
      case "Engineering, repair and maintenance":
        return "EngineeringSubcategory";
      case "Agriculture and farming":
        return "AgricultureSubcategory";
      case "Fishing and blue economy":
        return "FishingSubcategory";
      case "Administrative and Office Support":
        return "AdministrativeSubcategory";
      case "Manufacturing and Production":
        return "ManufacturingSubcategory";
      case "Human Resources":
        return "HRSubcategory";
      case "Sports and Entertainment":
        return "SportsSubcategory";
      case "Building, Construction, electric and maintenance":
        return "BuildingSubcategory";
      case "Retail and Sales":
        return "RetailSubcategory";
      case "Hospitality travel and tourism":
        return "HospitalitySubcategory";
      case "Legal and Compliance":
        return "LegalSubcategory";
      case "Science, Research, Monitoring and Evaluation":
        return "ResearchSubcategory";
      case "Media, Communications, films and art":
        return "MediaSubcategory";
      case "Transportation and Logistics":
        return "TransportationSubcategory";
      case "Real Estate":
        return "RealEstateSubcategory";
      case "Social Services and Non-Profit":
        return "SocialSubcategory";
      case "Consulting":
        return "ConsultingSubcategory";
      default:
        return null;
    }
  };
const SubCategoryEdit = ({ job, jobId }: SubCategoryEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();
  const customCategory = getCustomCategory(job?.category);
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      subCategory: job?.subCategory ? job.subCategory : "",
    },
  });

  const { mutate: updateJob, isLoading } = trpc.adminUpdateJob.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The job's subcategory has successfully been updated",
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
          description: "There was a problem updating the job's subcategory'",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const onSubmit = (values: ReminderFormSchemaType) => {
    updateJob({ ...values, jobID: jobId });
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
      <dt className="font-medium pb-2">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium lg:font-semibold text-gray-800">
            <div className="text-base flex items-center">
              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
              Job Subcategory
            </div>
          </div>
          {!isEditing && (
            <div className="ml-4 lg:hidden flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="text-primary hover:text-primary rounded-md"
                onClick={toggleEdit}
              >
                <PenLine className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>
      </dt>
      <dd className=" text-gray-800 sm:col-span-2">
        <ul role="list">
          <li>
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-normal">
                              Update the job&apos;s subcategory
                            </FormLabel>
                            <Popover
                              open={popoverOpen}
                              onOpenChange={setPopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={isLoading}
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? customCategory &&
                                      allSubcategories[customCategory]?.find(
                                          (subCat) =>
                                            subCat.value === field.value
                                        )?.label
                                      : "Select the job's subcategory"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                <Command>
                                  <CommandInput placeholder="Search subcategory..." />
                                  <CommandEmpty>
                                    No subcategory found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {customCategory &&
                                      allSubcategories[customCategory]?.sort((a, b) =>
                                        a.label.localeCompare(b.label)
                                      )
                                      .map((subCat) => (
                                        <CommandItem
                                          value={subCat.label}
                                          key={subCat.value}
                                          onSelect={() => {
                                            form.setValue(
                                              "subCategory",
                                              subCat.value
                                            );
                                            setPopoverOpen(false);
                                          }}
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              subCat.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {subCat.label}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-start mt-4">
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
                          The Job&apos;s Subcategory
                        </h2>
                      </div>
                      <div>
                        {!isEditing && (
                          <div className="ml-2 flex-shrink-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              type="button"
                              className="text-primary hover:text-primary rounded-md"
                              onClick={toggleEdit}
                            >
                              <PenLine className="h-4 w-4 mr-1" /> Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {job?.subCategory ? (
                      <div className="font-normal text-base text-gray-800 -mt-0.5 w-full">
                        {job?.subCategory}
                      </div>
                    ) : (
                      <span className="italic text-sm  text-gray-500">
                        No job subcategory in the record. You may add by first ensuring main category is accurate.
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

export default SubCategoryEdit;
