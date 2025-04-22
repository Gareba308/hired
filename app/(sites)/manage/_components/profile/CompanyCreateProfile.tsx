"use client";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

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

import { CheckIcon, ChevronDown, GripVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import CloudUpload from "@/components/CloudUpload";
import { counties } from "../data/create-job/CreateJobData";
import { categories } from "../data/create-job/CreateJobData";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import { Editor } from "@/components/Editor";
import { useRef, useState } from "react";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  company_name: z.string(),
  company_description: z.string(),
  employerPhone: z.string(),
  county: z.string(),
  category: z.string().min(1, "The category section cannot be left black"),
  secondaryEmail: z.string(),
  secondaryPhone: z.string(),
  town: z.string(),
  established: z.string(),
  zip: z.string(),
  postal: z.string(),
  website: z.string(),
  logo: z.string(),
});

const CompanyCreateProfile = () => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const searchParams = useSearchParams();

  const origin = searchParams?.get("origin");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      employerPhone: "",
      company_name: "",
      county: "",
      category: "",
      secondaryEmail: "",
      secondaryPhone: "",
      company_description: "",
      town: "",
      zip: "",
      postal: "",
      website: "",
      logo: "",
      established: "",
    },
  });

  const { control } = form;

  const watchedCompanyName = useWatch({ control, name: "company_name" }) || "";
  const watchTown = useWatch({ control, name: "town" }) || "";
  const townLength = watchTown.length;
  const { mutate: employerCreateProfile, isLoading } =
    trpc.employerCreateProfile.useMutation({
      onSuccess: () => {
        toast({
          title: "Successful created profile",
          description:
            "You can now view or even edit your profile in the Profile section of your dashboard.",
          variant: "default",
          duration: 3000,
        });

        if (origin) {
          router.push(`/${origin}`);
          router.refresh();
        } else {
          router.refresh();
        }
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
              "There was an error while creating your profile. Try again later or talk to our team",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      form.setValue("company_name", inputValue);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const trimmedText = pastedText.slice(0, 50);
    form.setValue("company_name", trimmedText);
    e.preventDefault();
  };

  function onSubmit(data: ReminderFormSchemaType) {
    employerCreateProfile({ ...data });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b border-gray-200 pb-2">
          <h2 className="font-bold text-2xl text-gray-600">Create Profile</h2>
          <p className="text-gray-600">
            Ensure you provide comprehensive details about your company. This
            information helps potential candidates gain a better understanding
            of your organization.
          </p>
        </div>

        <dl className="divide-y divide-gray-100">
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
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
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the name of your company/organization?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Jobs Radar Kenya"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                        onPaste={(e) => {
                          handlePaste(e);
                        }}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm">
                      {watchedCompanyName &&
                        watchedCompanyName.length === 50 && (
                          <>Maximum character limit of 50 reached.</>
                        )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Year Established
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="established"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Select onValueChange={field.onChange}>
                      <FormControl className="w-[110px] lg:w-[185px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full max-h-[400px] overflow-y-scroll">
                        {Array.from({ length: 150 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={`${new Date().getFullYear() - i}`}
                          >
                            {new Date().getFullYear() - i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Industry/Category
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      In what job categories/industry does your company operate?
                    </FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category) => category.value === field.value
                                )?.label
                              : "Select the job's category"}
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
                              .sort((a, b) => a.label.localeCompare(b.label))
                              .map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue("category", category.value);
                                    setPopoverOpen(false);
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

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Company&apos;s Description
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="company_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Give a brief description of the company
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

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Phone Number
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <Label className="font-normal text-base text-gray-700">
                What is your phone number?
              </Label>
              <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                <FormField
                  control={form.control}
                  name="employerPhone"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-normal text-base text-gray-700">
                        <span className="text-red-500 mr-0.5">*</span>Primary
                        Phone?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 0712345678"
                          disabled={isLoading}
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="font-normal text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="secondaryPhone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-normal text-base text-gray-700">
                        Alternative Phone?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 0723456789"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="font-normal text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">Alternative Email</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="secondaryEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Alternative email address of the company
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. example@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">Company Website</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      The company&apos;s/organization&apos;s website.
                    </FormLabel>
                    <div className="flex items-center text-gray-700 rounded-sm">
                      <div className="flex px-1.5 border rounded-l-sm border-gray-200 items-center justify-center h-10 bg-slate-200">
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
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Company&apos;s Address
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <Label className="font-normal text-base text-gray-700">
                What is the company&apos;s postal address?
              </Label>
              <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="postal"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-normal text-base text-gray-700">
                        <span className="text-red-500 mr-0.5">*</span>Box
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 76"
                          disabled={isLoading}
                          type="text"
                          className="w-full"
                          maxLength={10}
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="font-normal text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-normal text-base  text-gray-700">
                        ZIP Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 00100"
                          disabled={isLoading}
                          type="text"
                          className="w-full"
                          maxLength={10}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="font-normal text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                <FormField
                  control={form.control}
                  disabled={isLoading}
                  name="town"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-normal text-base text-gray-700">
                        <span className="text-red-500 mr-0.5">*</span>Town
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Bura"
                          disabled={isLoading}
                          type="text"
                          className="w-full"
                          maxLength={MAX_CREDIT_CHARACTERS}
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 font-normal text-sm">
                        {watchTown && townLength === MAX_CREDIT_CHARACTERS && (
                          <>
                            Maximum character limit of {MAX_CREDIT_CHARACTERS}{" "}
                            reached.
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="font-normal text-base  text-gray-700">
                        <span className="text-red-500 mr-0.5">*</span>County
                      </FormLabel>
                      <Popover
                        open={popoverOpen2}
                        onOpenChange={setPopoverOpen2}
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
                                ? counties.find(
                                    (county) => county.value === field.value
                                  )?.label
                                : "Select"}
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
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((county) => (
                                  <CommandItem
                                    value={county.label}
                                    key={county.value}
                                    disabled={isLoading}
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
              </div>
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">Logo Upload</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Upload the logo of your company
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
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 sm:flex-row mt-6 justify-start items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "rounded-sm w-full text-base sm:w-[250px] hover:opacity-90 bg-primary text-primary-foreground py-4 flex items-center justify-center",
                    isLoading
                      ? "rounded-sm w-full sm:w-[250px] bg-primary opacity-50 text-primary-foreground py-4 flex items-center justify-center"
                      : ""
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </span>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </dd>
          </div>
        </dl>
      </form>
    </Form>
  );
};

export default CompanyCreateProfile;
