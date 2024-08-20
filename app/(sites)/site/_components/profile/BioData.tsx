"use client";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import CloudUpload from "@/components/CloudUpload";
import {
  academics,
  counties,
  job_types,
} from "../data/create-job/CreateJobData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WorkerBio } from "@prisma/client";
import BioDataProfile from "./created/BioDataProfile";
import { useState } from "react";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  employmentType: z.string().optional(),
  currentJobTitle: z.string().optional(),
  identityNumber: z.string().optional(),
  county: z.string().optional(),
  highestEducation: z.string().optional(),
  gender: z.string().optional(),
  yearOfBirth: z.string().optional(),
  citizen: z.string().optional(),
  profilePic: z.string().optional(),
});

interface BioProps {
  profileBio: WorkerBio[];
}
const BioData = ({ profileBio }: BioProps) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const [popoverOpen3, setPopoverOpen3] = useState<boolean>(false);
  const [popoverOpen4, setPopoverOpen4] = useState<boolean>(false);
  const origin = searchParams?.get("origin");

  const router = useRouter();

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      gender: "",
      county: "",
      citizen: "",
      identityNumber: "",
      yearOfBirth: "",
      currentJobTitle: "",
      employmentType: "",
      highestEducation: "",
      profilePic: "",
    },
  });

  const { mutate: createProfile, isLoading } = trpc.workerCreateBio.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Successfully created profile bio",
          description:
            "Your profile bio data has been created successfully. You can now view or update",
          variant: "default",
          duration: 3000,
        });
        if (origin) {
          router.push(`/${origin}`);
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
              "There was an error while creating your profile bio data. Try again later or talk to our team",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    }
  );

  function onSubmit(data: ReminderFormSchemaType) {
    createProfile({ ...data });
  }

  if (profileBio.length !== 0) {
    return (
      <>
        <BioDataProfile profiles={profileBio} />
      </>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="font-normal">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-bold text-2xl text-gray-600">Create Bio</h2>
            <p className="text-gray-600 text-base">
              Complete the required fields to create your bio section. All
              sensitive information will be kept private. Your bio helps
              employers understand who you are.
            </p>
          </div>

          <dl className="divide-y divide-gray-100">
            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Current job title(optional)
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="currentJobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-base">
                        In your occupation, what&apos;s your current job title?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Data analyst"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">Gender</dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What is your gender?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Female" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Others" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Others
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Year of birth
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="yearOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-base">
                        What is your year of birth?
                      </FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl className="w-full xl:w-[400px]">
                          <SelectTrigger>
                            <SelectValue placeholder="Select year of birth" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-[200px] overflow-y-scroll">
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={`${new Date().getFullYear() - i}`}
                            >
                              {new Date().getFullYear() - i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                County of location
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        Choose county of your residence.
                      </FormLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isLoading}
                              role="combobox"
                              className={cn(
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? counties.find(
                                    (county) => county.value === field.value
                                  )?.label
                                : "Select a county"}
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
                                      setPopoverOpen(false);
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            {/* Change to country */}
            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Citizenship
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="citizen"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        You hold citizenship of which country?
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
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? counties.find(
                                    (county) => county.value === field.value
                                  )?.label
                                : "Select a country"}
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                ID/Passport number(optional)
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="identityNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-base">
                        What is your Identification/passport number?(This will
                        be kept confidential)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 12345678"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Current employment type
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        In what job categories/industry does your company
                        operate?
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
                              className={cn(
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? job_types.find(
                                    (job_type) => job_type.value === field.value
                                  )?.label
                                : "Select job type"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search job type..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {job_types
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((job_type) => (
                                  <CommandItem
                                    value={job_type.label}
                                    key={job_type.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "employmentType",
                                        job_type.value
                                      );
                                      setPopoverOpen3(false);
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Highest education level
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="highestEducation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What is your highest education level?
                      </FormLabel>
                      <Popover
                        open={popoverOpen4}
                        onOpenChange={setPopoverOpen4}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? academics.find(
                                    (academic) => academic.value === field.value
                                  )?.label
                                : "Select academic qualification"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search job type..." />
                            <CommandEmpty>Option not found.</CommandEmpty>
                            <CommandGroup>
                              {academics.map((academic) => (
                                <CommandItem
                                  value={academic.label}
                                  key={academic.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "highestEducation",
                                      academic.value
                                    );
                                    setPopoverOpen4(false);
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Profile picture
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="profilePic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-base">
                        Upload your profile picture
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4 sm:flex-row mt-6 justify-start items-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "rounded-sm w-full text-base sm:w-[250px] bg-primary text-primary-foreground py-4 flex items-center justify-center",
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
        </div>
      </form>
    </Form>
  );
};

export default BioData;
