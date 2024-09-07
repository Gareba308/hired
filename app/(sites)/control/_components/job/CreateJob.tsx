"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { useToast } from "@/components/ui/use-toast";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  GripVertical,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/Editor";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  academics,
  job_types,
  counties,
  experiences,
  payments,
  categories,
} from "../data/create-job/CreateJobData";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import {
  Autocomplete,
  Chip,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { useCachedSkills } from "../data/create-job/AllSkills";
import { useBenefits } from "../data/create-job/Benefits";
import {
  Company,
  PickAssessCandidate,
  UnregisteredCompany,
} from "@prisma/client";
import CloudUpload from "@/components/CloudUpload";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;
interface AdminCreateJobProps {
  companies: Company[];
  allOrderedAssessments: PickAssessCandidate[];
  unregisteredCompanies: UnregisteredCompany[];
}

const minSkills = 4;

const nilSkills = 0;

export const reminderFormSchema = z.object({
  job_title: z.string().min(1, { message: "Job title cannot be left blank." }),
  job_description: z.string(),
  responsibilities: z.string(),
  requirement: z.string(),
  personal_skills: z
    .array(z.string())
    .refine(
      (skill) => skill.length >= 4,
      "Kindly select a minimum of 4 skills"
    ),
  platform: z.string(),
  emailPlatform: z.string(),
  linkPlatform: z.string(),
  otherPlatform: z.string(),
  ownPlatformMethod: z
    .string()
    .min(1, { message: "Select a preferred platform" }),
  experienceDesired: z.string(),
  experience: z.string(),
  numberOfPositions: z.string(),
  possible_pay: z.string(),
  job_type: z.string(),
  category: z.string(),
  county: z.string().min(1, { message: "County of location is required" }),
  address: z.string(),
  academic: z.string(),
  benefits: z.array(z.string()),
  instructions: z.string(),
  academicDesired: z.string(),
  deadline: z.coerce.date(),
  companyID: z.string(),
  addAssessment: z.boolean().default(false),
  assessmentOneID: z.string(),
  assessmentTwoID: z.string(),
  jobFormNonRegisteredCompany: z.boolean().default(false),
  adminCreatingCompanyName: z.string(),
  adminCreatingAddLogo: z.string(),

  unregisteredKnown: z.boolean().default(false),
  unregisteredID: z.string(),
});

const CreateJob = ({
  companies,
  unregisteredCompanies,
  allOrderedAssessments,
}: AdminCreateJobProps) => {
  const currentDate = new Date();
  const router = useRouter();
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const allSkills = useCachedSkills();
  const allBenefits = useBenefits();
  const filterOptions = createFilterOptions<string>({
    stringify: (option) => option,
    ignoreCase: true,
    limit: 100,
  });
  const filteredBenefits = createFilterOptions<string>({
    stringify: (option) => option,
    ignoreCase: true,
    limit: 100,
  });

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      job_title: "",
      job_description: "",
      responsibilities: "",
      requirement: "",
      personal_skills: [],
      platform: "",
      emailPlatform: "",
      linkPlatform: "",
      otherPlatform: "",
      ownPlatformMethod: "",
      experienceDesired: "",
      academic: "",
      academicDesired: "",
      experience: "",
      numberOfPositions: "",
      possible_pay: "",
      job_type: "",
      category: "",
      county: "",
      address: "",
      addAssessment: false,
      assessmentOneID: "",
      assessmentTwoID: "",
      benefits: [],
      instructions: "",
      deadline: new Date(currentDate),
      companyID: "",
      jobFormNonRegisteredCompany: false,
      adminCreatingCompanyName: "",
      adminCreatingAddLogo: "",
      unregisteredKnown: false,
      unregisteredID: "",
    },
  });
  const { control } = form;

  const registration =
    useWatch({ control, name: "jobFormNonRegisteredCompany" }) || false;
  const unregistered = registration === true;

  const knownUnregistered =
    useWatch({ control, name: "unregisteredKnown" }) || false;
  const known = knownUnregistered === true;

  const watchedJobTitle = useWatch({ control, name: "job_title" }) || "";

  const skillsHere = useWatch({ control, name: "personal_skills" }) || [];
  const skillsLength = skillsHere.length;
  const remainingSkills = minSkills - skillsLength;
  const platformValue = useWatch({ control, name: "platform" }) || "";
  const isEmailPlatform = platformValue === "email";
  const isLinkPlatform = platformValue === "link";
  const isOtherPlatform = platformValue === "office";

  const whereToGetApplications =
    useWatch({ control, name: "ownPlatformMethod" }) || "";
  const thisPlatform = whereToGetApplications === "here";

  const addAssess = useWatch({ control, name: "addAssessment" });
  const agreeAddAssessment = addAssess === true;

  const firstAssessment = useWatch({ control, name: "assessmentOneID" });

  const companyIDDetail = useWatch({ control, name: "companyID" }) || "";

  const orderedAssessments = allOrderedAssessments.filter(
    (assessment) => assessment.companyID === companyIDDetail
  );

  const [popoverOpen1, setPopoverOpen1] = useState<boolean>(false);
  const [popoverOpen1B, setPopoverOpen1B] = useState<boolean>(false);
  const [popoverOpenA, setPopoverOpenA] = useState<boolean>(false);
  const [popoverOpenB, setPopoverOpenB] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const [popoverOpen3, setPopoverOpen3] = useState<boolean>(false);
  const [popoverOpen4, setPopoverOpen4] = useState<boolean>(false);
  const [popoverOpen5, setPopoverOpen5] = useState<boolean>(false);
  const [popoverOpen6, setPopoverOpen6] = useState<boolean>(false);
  const [popoverOpen7, setPopoverOpen7] = useState<boolean>(false);
  const [popoverOpen8, setPopoverOpen8] = useState<boolean>(false);
  const isEmailValues = useWatch({ control, name: "emailPlatform" }) || "";
  const isLinkValue = useWatch({ control, name: "linkPlatform" }) || "";
  const isOthersValue = useWatch({ control, name: "otherPlatform" }) || "";
  const positionsValue = useWatch({ control, name: "numberOfPositions" }) || "";
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isEmailValue = isValidEmail(isEmailValues);

  const httpsLink = isLinkValue.startsWith("https://");

  const isVacanciesNumber = (str: string): boolean => {
    const numberValue = Number(str);
    return !isNaN(numberValue);
  };
  const isValidNumber = isVacanciesNumber(positionsValue);

  const selectMethod = useWatch({ control, name: "ownPlatformMethod" }) || "";
  const ownMethod = selectMethod === "own";

  const viewInstructions = useWatch({ control, name: "instructions" }) || "";
  const cleanText = viewInstructions.replace(/<[^>]*>/g, "");

  const { isSubmitting } = form.formState;
  const { mutate: adminCreateJob, isLoading } = trpc.adminCreateJob.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "The job has been queued in 'Unpublished' on your dashboard, review and publish it.",
          variant: "default",
          duration: 3000,
        });
        form.reset();
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
              "There was an error while creating your job. Try again later or check if everything is correct.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 70) {
      form.setValue("job_title", inputValue);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const trimmedText = pastedText.slice(0, 70);
    form.setValue("job_title", trimmedText);
    e.preventDefault();
  };

  function onSubmit(data: ReminderFormSchemaType) {
    adminCreateJob({ ...data });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="mb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/control/jobs">All Jobs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create a Job</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <>
            <h3 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
              Create Job Listing
            </h3>
            <p className="text-gray-600 font-normal text-sm">
              <span className="font-bold text-primary">Hired</span> manages all
              stages of job applications. For external applications, you may
              specify your preferred platform.
            </p>
          </>

          <div className="border-t border-gray-200 mt-1">
            <div>
              <dl className="divide-y divide-gray-100">
                <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
                  <dt className="font-medium text-base text-gray-700">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Non-Registered?
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                    <Label className="font-medium text-base text-gray-700">
                      Only for unregistered companies.
                    </Label>
                    <FormField
                      control={form.control}
                      name="jobFormNonRegisteredCompany"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <div className="flex items-start justify-between flex-row w-full gap-x-4">
                            <div>
                              <FormLabel className="text-base font-normal">
                                Is job company unregistered in database?
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>
                {unregistered && (
                  <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
                    <dt className="font-medium text-base text-gray-700">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Unregistered Known?
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                      <Label className="font-medium text-base text-gray-700">
                        For unregistered companies known.
                      </Label>
                      <FormField
                        control={form.control}
                        name="unregisteredKnown"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="flex items-start justify-between flex-row w-full gap-x-4">
                              <div>
                                <FormLabel className="text-base font-normal">
                                  Is the unregistered company known to you?
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}
                {!unregistered && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Company Details
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="companyID"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-normal text-base text-gray-700">
                              Select the company you are posting the job for?
                              <span className="text-xs text-gray-600">
                                (e.g., Talanta Mtaani Company)
                              </span>
                            </FormLabel>
                            <Popover
                              open={popoverOpen1}
                              onOpenChange={setPopoverOpen1}
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
                                      ? companies.find(
                                          (company) =>
                                            company.id === field.value
                                        )?.company_name
                                      : "---Select the company---"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                <Command>
                                  <CommandInput placeholder="Search company..." />
                                  <CommandEmpty>No company found.</CommandEmpty>
                                  <CommandGroup>
                                    {companies
                                      .sort((a, b) =>
                                        a.company_name!.localeCompare(
                                          b.company_name!
                                        )
                                      )
                                      .map((company) => (
                                        <CommandItem
                                          value={company.id}
                                          key={company.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "companyID",
                                              company.id
                                            );
                                            setPopoverOpen1(false);
                                          }}
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              company.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {company.company_name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-sm" />
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {known && unregistered && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Details Unregistered
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="unregisteredID"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-normal text-base text-gray-700">
                              Select the unregistered company you are posting
                              the job for?
                              <span className="text-xs text-gray-600">
                                (e.g., Talanta Company)
                              </span>
                            </FormLabel>
                            <Popover
                              open={popoverOpen1B}
                              onOpenChange={setPopoverOpen1B}
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
                                      ? unregisteredCompanies.find(
                                          (company) =>
                                            company.id === field.value
                                        )?.companyName
                                      : "---Select the unregistered company---"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                <Command>
                                  <CommandInput placeholder="Search unregistered company..." />
                                  <CommandEmpty>No company found.</CommandEmpty>
                                  <CommandGroup>
                                    {unregisteredCompanies
                                      .sort((a, b) =>
                                        a.companyName!.localeCompare(
                                          b.companyName!
                                        )
                                      )
                                      .map((company) => (
                                        <CommandItem
                                          value={company.id}
                                          key={company.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "unregisteredID",
                                              company.id
                                            );
                                            setPopoverOpen1B(false);
                                          }}
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              company.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {company.companyName}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-sm" />
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {unregistered && !known && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Company Name
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        rules={{ required: "Job title cannot be left blank" }}
                        name="adminCreatingCompanyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base text-gray-700">
                              What is the name of the company?
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                placeholder="e.g. Jobs Radar Kenya"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-sm" />
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {unregistered && !known && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Upload Logo
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="adminCreatingAddLogo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base text-gray-700">
                              Upload a company logo for unregistered recruiters.
                            </FormLabel>
                            <FormControl>
                              <CloudUpload
                                disabled={isLoading}
                                onChange={(url) => field.onChange(url)}
                                value={field.value ? field.value : ""}
                                onRemove={() => field.onChange("")}
                                accept="image/*"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Job Title
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      rules={{ required: "Job title cannot be left blank" }}
                      name="job_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base text-gray-700">
                            What is the job title?
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="e.g. Accountant"
                              required
                              {...field}
                              onChange={(e) => {
                                handleInputChange(e);
                              }}
                              onPaste={(e) => {
                                handlePaste(e);
                              }}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm">
                            {watchedJobTitle &&
                              watchedJobTitle.length === 70 && (
                                <>Maximum character limit of 70 reached.</>
                              )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Job Location
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            Where is the job located? In which county?
                          </FormLabel>
                          <Popover
                            open={popoverOpen2}
                            onOpenChange={setPopoverOpen2}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={isLoading}
                                  role="combobox"
                                  className={cn(
                                    "w-full sm:w-[350px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? counties.find(
                                        (county) => county.value === field.value
                                      )?.label
                                    : "---Select location county---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search county..." />
                                <CommandEmpty>No county found.</CommandEmpty>
                                <CommandGroup>
                                  {counties
                                    .sort((a, b) =>
                                      a.label.localeCompare(b.label)
                                    )
                                    .map((county) => (
                                      <CommandItem
                                        value={county.label}
                                        key={county.value}
                                        onSelect={() => {
                                          form.setValue("county", county.value);
                                          setPopoverOpen2(false);
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            county.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {county.label}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base text-gray-700">
                            What is the physical location?
                            <span className="text-xs text-gray-600">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="e.g. Jambo House Waiyaki Way"
                              {...field}
                              className=""
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Job Category
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            What industry or category does this job fall under?
                            <span className="text-xs text-gray-600">
                              (e.g., Real Estate)
                            </span>
                          </FormLabel>
                          <Popover
                            open={popoverOpen3}
                            onOpenChange={setPopoverOpen3}
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
                                    ? categories.find(
                                        (category) =>
                                          category.value === field.value
                                      )?.label
                                    : "---Select the job's category---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  {categories
                                    .sort((a, b) =>
                                      a.label.localeCompare(b.label)
                                    )
                                    .map((category) => (
                                      <CommandItem
                                        value={category.label}
                                        key={category.value}
                                        onSelect={() => {
                                          form.setValue(
                                            "category",
                                            category.value
                                          );
                                          setPopoverOpen3(false);
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            category.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {category.label}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">Employment Type</span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="job_type"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            What job type or employment mode will this job
                            vacancy fall in?
                            <span className="text-xs text-gray-600">
                              (e.g. Full-time etc.)
                            </span>
                          </FormLabel>
                          <Popover
                            open={popoverOpen4}
                            onOpenChange={setPopoverOpen4}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={isLoading}
                                  role="combobox"
                                  className={cn(
                                    "w-full sm:w-[350px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? job_types.find(
                                        (job_type) =>
                                          job_type.value === field.value
                                      )?.label
                                    : "---Select job type---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                              <Command>
                                <CommandGroup>
                                  {job_types
                                    .sort((a, b) =>
                                      a.label.localeCompare(b.label)
                                    )
                                    .map((job_type) => (
                                      <CommandItem
                                        value={job_type.label}
                                        key={job_type.value}
                                        onSelect={() => {
                                          form.setValue(
                                            "job_type",
                                            job_type.value
                                          );
                                          setPopoverOpen4(false);
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            job_type.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {job_type.label}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Job Description
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="job_description"
                      render={({ field }) => (
                        <FormItem className="text-gray-700">
                          <FormLabel className="font-normal text-base text-gray-700">
                            Can you provide a brief description of the job
                            position?
                          </FormLabel>
                          <FormControl className="mb-4">
                            <Editor
                              disabled={isLoading}
                              {...field}
                              ref={(editor) => (editorRef.current = editor)}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Application Deadline
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            When is the deadline for submitting applications?
                          </FormLabel>
                          <Popover
                            open={popoverOpen5}
                            onOpenChange={setPopoverOpen5}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  disabled={isLoading}
                                  className={cn(
                                    "w-full sm:w-[350px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setPopoverOpen5(false);
                                }}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Job Responsibilities
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="responsibilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base text-gray-700">
                            What are the job responsibilities?
                          </FormLabel>
                          <FormControl className="mb-4">
                            <Editor
                              disabled={isLoading}
                              {...field}
                              ref={(editor) => (editorRef.current = editor)}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Years Of Experience
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            How many years of experience in this job category
                            would you like applicants to have?
                          </FormLabel>
                          <Popover
                            open={popoverOpen6}
                            onOpenChange={setPopoverOpen6}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={isLoading}
                                  role="combobox"
                                  className={cn(
                                    "w-full sm:w-[350px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? experiences.find(
                                        (experience) =>
                                          experience.value === field.value
                                      )?.label
                                    : "---Select years of experience---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search job type..." />
                                <CommandEmpty>Option not found.</CommandEmpty>
                                <CommandGroup>
                                  {experiences.map((experience) => (
                                    <CommandItem
                                      value={experience.label}
                                      key={experience.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "experience",
                                          experience.value
                                        );
                                        setPopoverOpen6(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          experience.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {experience.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={isLoading}
                      name="experienceDesired"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              disabled={isLoading}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Preferred" />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  Preferred
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Required" />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  Required
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-red-600 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Academic Qualifications
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="academic"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            What is the minimum academic qualification for this
                            position? Candidates will be asked if they are
                            qualified.
                          </FormLabel>
                          <Popover
                            open={popoverOpen7}
                            onOpenChange={setPopoverOpen7}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={isLoading}
                                  role="combobox"
                                  className={cn(
                                    "w-full sm:w-[350px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? academics.find(
                                        (academic) =>
                                          academic.value === field.value
                                      )?.label
                                    : "---Select academic qualification---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                              <Command>
                                <CommandGroup>
                                  {academics.map((academic) => (
                                    <CommandItem
                                      value={academic.label}
                                      key={academic.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "academic",
                                          academic.value
                                        );
                                        setPopoverOpen7(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          academic.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {academic.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={isLoading}
                      name="academicDesired"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              disabled={isLoading}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Preferred" />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  Preferred
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Required" />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  Required
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Skills And Requirements
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-col">
                      <Label className="text-base font-normal text-gray-700">
                        Start typing select minimum of 4 relevant skills from
                        the list that will help find you the right candidate.
                      </Label>
                      <Label className="mt-1">
                        {remainingSkills < minSkills &&
                          remainingSkills > nilSkills && (
                            <>
                              Add {remainingSkills} more to get to minimum
                              required skills.
                            </>
                          )}
                      </Label>
                    </div>
                    <FormField
                      control={form.control}
                      disabled={isLoading}
                      name="personal_skills"
                      render={({ field: { ref, onChange, ...field } }) => (
                        <Autocomplete
                          multiple
                          limitTags={6}
                          options={allSkills}
                          disabled={isLoading || isSubmitting}
                          fullWidth
                          className="-mt-2 mb-3"
                          filterSelectedOptions
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            );
                          }}
                          renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                key={option}
                                label={option}
                              />
                            ));
                          }}
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <FormItem className="text-gray-700">
                              <FormControl>
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  onChange={onChange}
                                  disabled={isLoading}
                                  margin="normal"
                                  fullWidth
                                  inputRef={ref}
                                  placeholder="Start typing to search a skill"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 font-normal text-sm" />
                            </FormItem>
                          )}
                          onChange={(_, data) => onChange(data)}
                          filterOptions={filterOptions}
                        />
                      )}
                    />
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="requirement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base text-gray-700">
                            Description of qualifications and skills required
                            for this position?
                          </FormLabel>
                          <FormControl>
                            <Editor
                              disabled={isLoading}
                              {...field}
                              ref={(editor) => (editorRef.current = editor)}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Number Of Vacancies
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="numberOfPositions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base text-gray-700">
                            How many job vacancies are there in this job
                            opening?
                            <span className="text-xs text-gray-600">
                              (e.g. 4)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 3" {...field} />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-sm">
                            {!isValidNumber && (
                              <>
                                Kindly ensure you input a valid{" "}
                                <span className="font-bold">number</span>.
                              </>
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">Remuneration</span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="possible_pay"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base text-gray-700">
                            What is the salary range or compensation package for
                            this position?
                          </FormLabel>
                          <Popover
                            open={popoverOpen8}
                            onOpenChange={setPopoverOpen8}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full sm:w-[350px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? payments.find(
                                        (payment) =>
                                          payment.value === field.value
                                      )?.label
                                    : "---Select possible remuneration---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search payment..." />
                                <CommandEmpty>
                                  No payment category found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {payments.map((payment) => (
                                    <CommandItem
                                      value={payment.label}
                                      key={payment.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "possible_pay",
                                          payment.value
                                        );
                                        setPopoverOpen8(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          payment.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {payment.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Additional Benefits
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-col">
                      <Label className="text-base font-normal text-gray-700">
                        What are additional benefits of working for your
                        company? Type to search for options.
                      </Label>
                    </div>
                    <FormField
                      control={form.control}
                      disabled={isLoading}
                      name="benefits"
                      render={({ field: { ref, onChange, ...field } }) => (
                        <Autocomplete
                          multiple
                          limitTags={6}
                          options={allBenefits}
                          disabled={isLoading || isSubmitting}
                          fullWidth
                          className="-mt-2 mb-3"
                          filterSelectedOptions
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            );
                          }}
                          renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                key={option}
                                label={option}
                              />
                            ));
                          }}
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <FormItem className="text-gray-700">
                              <FormControl>
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  onChange={onChange}
                                  disabled={isLoading}
                                  margin="normal"
                                  fullWidth
                                  inputRef={ref}
                                  placeholder="Start typing to search for benefits"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 font-normal text-sm" />
                            </FormItem>
                          )}
                          onChange={(_, data) => onChange(data)}
                          filterOptions={filteredBenefits}
                        />
                      )}
                    />
                  </dd>
                </div>

                <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="text-base font-medium text-gray-600">
                    <div className="flex items-center flex-row">
                      <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                      <span className="flex items-center">
                        Preferred Platform
                        <span className="text-lg font-normal pl-0.5 text-red-600">
                          *
                        </span>
                      </span>
                    </div>
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <FormField
                      control={form.control}
                      name="ownPlatformMethod"
                      disabled={isLoading}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <p className="text-base">
                            <span className="font-medium text-base mr-2">
                              ATTENTION!
                            </span>
                            Select{" "}
                            <span className="font-medium">
                              External platform
                            </span>{" "}
                            option only if you have an external platform on
                            which you would like to receive job applications.
                          </p>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              required
                              disabled={isLoading}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="here" />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  Receive applications here.
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="own" />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  External platform
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                {orderedAssessments.length !== 0 && thisPlatform && (
                  <>
                    <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                      <dt className="text-base font-medium text-gray-600">
                        <div className="flex items-center flex-row">
                          <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                          <span className="flex items-center">
                            Add Assessment?
                          </span>
                        </div>
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <FormField
                          control={form.control}
                          name="addAssessment"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-normal text-base">
                                Would you like to add a compulsory assessment to
                                this job listing?
                              </FormLabel>
                              <div className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <Label className="font-normal">
                                  Yes, add an assessment test.
                                </Label>
                              </div>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-base" />
                            </FormItem>
                          )}
                        />
                      </dd>
                    </div>

                    {agreeAddAssessment && (
                      <>
                        <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                          <dt className="text-base font-medium text-gray-600">
                            <div className="flex items-center flex-row">
                              <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                              <span className="flex items-center">
                                Assessment Name
                                <span className="text-lg font-normal pl-0.5 text-red-600">
                                  *
                                </span>
                              </span>
                            </div>
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <FormField
                              disabled={isLoading}
                              control={form.control}
                              name="assessmentOneID"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="font-normal text-base text-gray-700">
                                    Select the name of the assessment you would
                                    like to be added to this job listing?
                                    <span className="text-xs text-gray-600">
                                      (e.g., Talanta Language Test)
                                    </span>
                                  </FormLabel>
                                  <Popover
                                    open={popoverOpenA}
                                    onOpenChange={setPopoverOpenA}
                                  >
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          disabled={isLoading}
                                          className={cn(
                                            "w-full justify-between",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value
                                            ? orderedAssessments.find(
                                                (test) =>
                                                  test.testID === field.value
                                              )?.testName
                                            : "---Select the test name---"}
                                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                      <Command>
                                        <CommandInput placeholder="Search for assessment..." />
                                        <CommandEmpty>
                                          No assessment found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {orderedAssessments
                                            .sort((a, b) =>
                                              a.testName!.localeCompare(
                                                b.testName!
                                              )
                                            )
                                            .map((test) => (
                                              <CommandItem
                                                value={test.testID}
                                                key={test.id}
                                                onSelect={() => {
                                                  form.setValue(
                                                    "assessmentOneID",
                                                    test.testID
                                                  );
                                                  setPopoverOpenA(false);
                                                }}
                                              >
                                                <CheckIcon
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    test.testID === field.value
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {test.testName}
                                              </CommandItem>
                                            ))}
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <FormDescription></FormDescription>
                                  <FormMessage className="text-red-500 font-normal text-sm" />
                                </FormItem>
                              )}
                            />
                          </dd>
                        </div>

                        {orderedAssessments.length > 1 && firstAssessment && (
                          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                            <dt className="text-base font-medium text-gray-600">
                              <div className="flex items-center flex-row">
                                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                                <span className="flex items-center">
                                  Second Assessment?
                                </span>
                              </div>
                            </dt>
                            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="assessmentTwoID"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="font-normal text-base text-gray-700">
                                      Would you like to add a second assessment
                                      to this job listing? Select from the list
                                      below.
                                      <span className="text-xs text-gray-600">
                                        (e.g., Talanta2 Language Test)
                                      </span>
                                    </FormLabel>
                                    <Popover
                                      open={popoverOpenB}
                                      onOpenChange={setPopoverOpenB}
                                    >
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            disabled={isLoading}
                                            className={cn(
                                              "w-full justify-between",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value
                                              ? orderedAssessments.find(
                                                  (test) =>
                                                    test.testID === field.value
                                                )?.testName
                                              : "---Select the second test name---"}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                        <Command>
                                          <CommandInput placeholder="Search for assessment..." />
                                          <CommandEmpty>
                                            No assessment found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {orderedAssessments
                                              .sort((a, b) =>
                                                a.testName!.localeCompare(
                                                  b.testName!
                                                )
                                              )
                                              .map((test) => (
                                                <CommandItem
                                                  value={test.testID}
                                                  key={test.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      "assessmentTwoID",
                                                      test.testID
                                                    );
                                                    setPopoverOpenB(false);
                                                  }}
                                                >
                                                  <CheckIcon
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      test.testID ===
                                                        field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                  {test.testName}
                                                </CommandItem>
                                              ))}
                                          </CommandGroup>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormDescription></FormDescription>
                                    <FormMessage className="text-red-500 font-normal text-sm" />
                                  </FormItem>
                                )}
                              />
                            </dd>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {ownMethod && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Application Method
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base text-gray-700">
                              What is your own preferred external method to
                              receive job applications?
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                disabled={isLoading}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="email" />
                                  </FormControl>
                                  <FormLabel className="font-normal text-gray-700">
                                    Submit via email address
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="link" />
                                  </FormControl>
                                  <FormLabel className="font-normal text-gray-700">
                                    Through URL link
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="office" />
                                  </FormControl>
                                  <FormLabel className="font-normal text-gray-700">
                                    Physically submit application
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-red-500 font-normal text-sm">
                              {ownMethod && platformValue.length === 0 && (
                                <>Please select a preferred method</>
                              )}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {ownMethod && isEmailPlatform && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Email For Application
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="emailPlatform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base text-gray-700">
                              Provide the preferred email address for receiving
                              job applications.
                            </FormLabel>
                            <FormControl className="mb-4">
                              <Input
                                disabled={isLoading}
                                placeholder="e.g. abc@gmail.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-normal text-sm">
                              {ownMethod &&
                                isEmailPlatform &&
                                !isEmailValue && <>Kindly add a valid email</>}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {ownMethod && isLinkPlatform && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          URL For Application
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="linkPlatform"
                        render={({ field }) => (
                          <FormItem className="text-gray-700">
                            <FormLabel className="font-normal text-base text-gray-700">
                              Provide the preferred valid URL link for receiving
                              job applications
                              <span className="text-xs text-gray-600 ml-1">
                                (DO NOT include{" "}
                                <span className="font-bold text-primary">
                                  https://{" "}
                                </span>
                                )
                              </span>
                              .
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
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="text-red-500 font-normal text-sm">
                              {ownMethod &&
                                isLinkPlatform &&
                                isLinkValue.length === 0 && (
                                  <>Kindly add URL link.</>
                                )}
                              {ownMethod &&
                                isLinkPlatform &&
                                isLinkValue.length !== 0 &&
                                httpsLink && (
                                  <>
                                    Kindly remove{" "}
                                    <span className="font-bold text-gray-700 underline">
                                      https://
                                    </span>{" "}
                                    as we auto-included it already
                                  </>
                                )}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {ownMethod && isOtherPlatform && (
                  <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                    <dt className="text-base font-medium text-gray-600">
                      <div className="flex items-center flex-row">
                        <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                        <span className="flex items-center">
                          Physically Submit & Others
                          <span className="text-lg font-normal pl-0.5 text-red-600">
                            *
                          </span>
                        </span>
                      </div>
                    </dt>
                    <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="otherPlatform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal text-base text-gray-700">
                              Provide the physical address of where to submit or
                              any other preferred method.
                            </FormLabel>
                            <FormControl className="mb-4">
                              <Input
                                placeholder="Submit 4th Floor Jambo Hse Nairobi"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-normal text-sm">
                              {ownMethod &&
                                isOtherPlatform &&
                                isOthersValue.length === 0 && (
                                  <>Kindly input address for submission</>
                                )}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </dd>
                  </div>
                )}

                {ownMethod && (
                  <>
                    {isEmailValue ||
                    isLinkValue.length !== 0 ||
                    isOthersValue.length !== 0 ? (
                      <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                        <dt className="text-base font-medium text-gray-600">
                          <div className="flex items-center flex-row">
                            <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                            <span className="flex items-center">
                              Application Instructions
                              <span className="text-lg font-normal pl-0.5 text-red-600">
                                *
                              </span>
                            </span>
                          </div>
                        </dt>
                        <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="instructions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-normal text-base text-gray-700">
                                  What are the instructions that applicants must
                                  follow when submitting application using this
                                  method?
                                </FormLabel>
                                <FormControl className="mb-4">
                                  <Editor
                                    disabled={isLoading}
                                    {...field}
                                    ref={(editor) =>
                                      (editorRef.current = editor)
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 font-normal text-sm">
                                  {ownMethod && (
                                    <>
                                      {(isEmailValue ||
                                        isLinkValue.length !== 0 ||
                                        isOthersValue.length !== 0) &&
                                        cleanText.length === 0 && (
                                          <>Instructions are required.</>
                                        )}
                                    </>
                                  )}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                        </dd>
                      </div>
                    ) : null}
                  </>
                )}
              </dl>
            </div>
            <div className="border-t border-gray-100">
              <dl>
                <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt />
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-2 lg:gap-4">
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          (ownMethod && platformValue.length === 0) ||
                          (ownMethod && isEmailPlatform && !isEmailValue) ||
                          (ownMethod &&
                            isLinkPlatform &&
                            isLinkValue.length === 0) ||
                          (ownMethod &&
                            isOtherPlatform &&
                            isOthersValue.length === 0) ||
                          (ownMethod &&
                            (isEmailValue ||
                              isLinkValue.length !== 0 ||
                              isOthersValue.length !== 0) &&
                            cleanText.length === 0)
                        }
                        className={cn(
                          "flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center bg-primary px-8 py-3 sm:py-3.5 text-base font-medium text-primary-foreground",
                          isLoading ||
                            (ownMethod && platformValue.length === 0) ||
                            (ownMethod && isEmailPlatform && !isEmailValue) ||
                            (ownMethod &&
                              isLinkPlatform &&
                              isLinkValue.length === 0) ||
                            (ownMethod &&
                              isOtherPlatform &&
                              isOthersValue.length === 0) ||
                            (ownMethod &&
                              (isEmailValue ||
                                isLinkValue.length !== 0 ||
                                isOthersValue.length !== 0) &&
                              cleanText.length === 0)
                            ? "opacity-90"
                            : ""
                        )}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </>
                        ) : (
                          <span className="flex items-center">Submit</span>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => router.push("/control/jobs")}
                        className="flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-gray-300 bg-slate-200 px-8 py-3 sm:py-3.5 text-base font-medium text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateJob;
