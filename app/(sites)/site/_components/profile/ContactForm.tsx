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

import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WorkerContact } from "@prisma/client";
import ContactFormProfile from "./created/ContactFormProfile";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { counties } from "../data/create-job/CreateJobData";
import { useState } from "react";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;
const MAX_CREDIT_CHARACTERS = 20;
export const reminderFormSchema = z.object({
  phone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  secondaryEmail: z.string().optional(),
  postal: z.string().optional(),
  zip: z.string().optional(),
  town: z.string().optional(),
  county: z.string().optional(),
});

interface ContactProps {
  profileContact: WorkerContact[];
}
const ContactForm = ({ profileContact }: ContactProps) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const origin = searchParams?.get("origin");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      phone: "",
      secondaryEmail: "",
      secondaryPhone: "",
      postal: "",
      zip: "",
      town: "",
    },
  });
  const { control } = form;
  const watchTown= useWatch({control, name: "town"}) || ""
  const townLength= watchTown.length
  const { mutate: createProfile, isLoading } =
    trpc.workerCreateContact.useMutation({
      onSuccess: () => {
        toast({
          title: "Successfully created profile contact",
          description:
            "Your profile contact section has been created successfully. You can now view or update",
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
              "There was an error while creating your profile contact section. Try again later or talk to our team",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  function onSubmit(data: ReminderFormSchemaType) {
    createProfile({ ...data });
  }

  if (profileContact.length !== 0) {
    return (
      <>
        <ContactFormProfile profiles={profileContact} />
      </>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="font-normal">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="font-bold text-gray-600 text-2xl">Create Contact</h2>
            <p className="text-gray-600 text-base">
              Fill in required contact details. Contact details help ease your
              communication with recruiters. These information will mostly
              remain private unless required by recruiters.
            </p>
          </div>

          <dl className="divide-y divide-gray-100 ">
            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium text-lg leading-6 text-gray-700">
                Phone Number
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <Label className="font-normal text-base text-gray-700">
                  What is your phone number?
                </Label>
                <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-normal text-base">
                          Primary Phone?
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 0712345678"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage className="font-normal text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryPhone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-normal text-base">
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
              <dt className="font-medium text-lg leading-6 text-gray-700">
                Alternative Email
              </dt>
              <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <FormField
                  control={form.control}
                  name="secondaryEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-base">
                        What is your alternative email address?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. example@example.com"
                          disabled={isLoading}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="font-normal text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </dd>
            </div>

            <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
              <dt className="font-medium text-lg leading-6 text-gray-700">
                Postal Address
              </dt>
              <dd className="mt-1 leading-6 w-full text-gray-700 lg:col-span-2 lg:mt-0 text-base">
                <Label className="font-normal text-base text-gray-700">
                  What is your postal address?
                </Label>
                <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="postal"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-normal text-base text-gray-700">
                          Box
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 76"
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
                  <FormField
                    control={form.control}
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
                    name="town"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-normal text-base text-gray-700">
                          Town
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Bura"
                            disabled={isLoading}
                            type="text"
                            className="w-full"
                            maxLength={MAX_CREDIT_CHARACTERS}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage className="text-red-500 font-normal text-sm">
                          {watchTown &&
                            townLength === MAX_CREDIT_CHARACTERS && (
                              <>
                                Maximum character limit of{" "}
                                {MAX_CREDIT_CHARACTERS} reached.
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
                          County
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
                                  ? counties.find(
                                      (county) => county.value === field.value
                                    )?.label
                                  : "County"}
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
                        <FormMessage className="text-red-500 font-normal text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
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

export default ContactForm;
