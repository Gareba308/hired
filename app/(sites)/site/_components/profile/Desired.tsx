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
import {
  availabilities,
  categories,
  experiences,
  job_types,
  payments,
  remunerations,
} from "../data/create-job/CreateJobData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WorkerDesires } from "@prisma/client";
import DesiredProfile from "./created/DesiredProfile";
import { useState } from "react";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  category: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  availability: z.string().optional(),
  willingToRelocateWithin: z.string().optional(),
  currentRemuneration: z.string().optional(),
  currentRemunerationTerms: z.string().optional(),
  desiredRemuneration: z.string().optional(),
  desiredRemunerationTerms: z.string().optional(),
  desiredEmploymentType: z.string().optional(),
});

interface DesiresProps {
  profileDesire: WorkerDesires[];
}
const Desired = ({ profileDesire }: DesiresProps) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const origin = searchParams?.get("origin");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const [popoverOpen3, setPopoverOpen3] = useState<boolean>(false);
  const [popoverOpen4, setPopoverOpen4] = useState<boolean>(false);
  const [popoverOpen5, setPopoverOpen5] = useState<boolean>(false);
  const [popoverOpen6, setPopoverOpen6] = useState<boolean>(false);
  const [popoverOpen7, setPopoverOpen7] = useState<boolean>(false);
  const [popoverOpen8, setPopoverOpen8] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      category: "",
      yearsOfExperience: "",
      availability: "",
      willingToRelocateWithin: "",
      currentRemuneration: "",
      currentRemunerationTerms: "",
      desiredRemuneration: "",
      desiredRemunerationTerms: "",

      desiredEmploymentType: "",
    },
  });

  const { mutate: createProfile, isLoading } =
    trpc.workerCreateDesires.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your desirable section has successfully been captured",
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
              "There was an error while creating the desirable section of your profile. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  function onSubmit(data: ReminderFormSchemaType) {
    createProfile({ ...data });
  }

  if (profileDesire.length !== 0) {
    return (
      <>
        <DesiredProfile profiles={profileDesire} />
      </>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="font-normal">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="font-bold text-2xl text-gray-600">
              Create Desirable
            </h2>
            <p className="text-gray-600 text-base">
              Fill in required details to create your desirable section. These
              information will help us push your profile to recruiters with
              recruitment needs matching your job desires.
            </p>
          </div>

          <dl className="divide-y divide-gray-200">
            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Desired job category
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        Choose one job category from which you would like to get
                        a job
                      </FormLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isLoading}
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? categories.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : "Select a category"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search a category..." />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((category) => (
                                  <CommandItem
                                    value={category.label}
                                    key={category.value}
                                    disabled={isLoading}
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Years of experience
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        How many years of experience do you have in your current
                        area of work?
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
                                ? experiences.find(
                                    (experience) =>
                                      experience.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[300px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search years..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {experiences.map((experience) => (
                                <CommandItem
                                  value={experience.label}
                                  key={experience.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "yearsOfExperience",
                                      experience.value
                                    );
                                    setPopoverOpen2(false);
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
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            {/* Change to country */}
            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Availability
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        When could you be available to start work?
                      </FormLabel>
                      <Popover
                        open={popoverOpen3}
                        onOpenChange={setPopoverOpen3}
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
                                ? availabilities.find(
                                    (availability) =>
                                      availability.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search option..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {availabilities.map((availability) => (
                                <CommandItem
                                  value={availability.label}
                                  key={availability.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "availability",
                                      availability.value
                                    );
                                    setPopoverOpen3(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      availability.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {availability.label}
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
                Current remuneration
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="currentRemuneration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What&apos;s your current remuneration range?
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
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? payments.find(
                                    (payment) => payment.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search option..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {payments.map((payment) => (
                                <CommandItem
                                  value={payment.label}
                                  key={payment.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "currentRemuneration",
                                      payment.value
                                    );
                                    setPopoverOpen4(false);
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
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Desired remuneration
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="desiredRemuneration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What&apos;s your desired remuneration range?
                      </FormLabel>
                      <Popover
                        open={popoverOpen5}
                        onOpenChange={setPopoverOpen5}
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
                                ? payments.find(
                                    (payment) => payment.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search option..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {payments.map((payment) => (
                                <CommandItem
                                  value={payment.label}
                                  key={payment.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "desiredRemuneration",
                                      payment.value
                                    );
                                    setPopoverOpen5(false);
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
                      <FormDescription></FormDescription>
                      <FormMessage className="text-red-500 text-sm font-normal" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium leading-6 text-gray-700">
                Willing to relocate
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="willingToRelocateWithin"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-normal text-base">
                        Would you be willing to relocate within the country for
                        job purposes?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes, willing to relocate" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Yes, I am willing to relocate
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No, not willing to relocate" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No, I am not willing to relocate
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
                Current remuneration terms
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="currentRemunerationTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What&apos;s your current remuneration terms?
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
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? remunerations.find(
                                    (remuneration) =>
                                      remuneration.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search option..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {remunerations.map((remuneration) => (
                                <CommandItem
                                  value={remuneration.label}
                                  key={remuneration.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "currentRemunerationTerms",
                                      remuneration.value
                                    );
                                    setPopoverOpen6(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      remuneration.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {remuneration.label}
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
                Desired remuneration terms
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="desiredRemunerationTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What&apos;s your desired remuneration terms?
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
                                "w-full xl:w-[400px] justify-between font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? remunerations.find(
                                    (remuneration) =>
                                      remuneration.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search option..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {remunerations.map((remuneration) => (
                                <CommandItem
                                  value={remuneration.label}
                                  key={remuneration.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "desiredRemunerationTerms",
                                      remuneration.value
                                    );
                                    setPopoverOpen7(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      remuneration.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {remuneration.label}
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
                Desired job type
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="desiredEmploymentType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal text-base">
                        What&apos;s your desired employment type?
                      </FormLabel>
                      <Popover open={popoverOpen8} onOpenChange={setPopoverOpen8}>
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
                                ? job_types.find(
                                    (job_type) => job_type.value === field.value
                                  )?.label
                                : "Select an option"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                          <Command>
                            <CommandInput placeholder="Search option..." />
                            <CommandEmpty>No record found.</CommandEmpty>
                            <CommandGroup>
                              {job_types.map((job_type) => (
                                <CommandItem
                                  value={job_type.label}
                                  key={job_type.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue(
                                      "desiredEmploymentType",
                                      job_type.value
                                    );
                                    setPopoverOpen8(false);
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

export default Desired;
