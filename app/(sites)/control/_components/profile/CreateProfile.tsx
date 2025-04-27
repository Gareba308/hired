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

import { CheckIcon, ChevronDown, GripVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import CloudUpload from "@/components/CloudUpload";
import { counties } from "../data/create-job/CreateJobData";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill-new";
import { Editor } from "@/components/Editor";
import { useRef, useState } from "react";

type ReminderFormSchemaType = z.infer<typeof reminderFormSchema>;

export const reminderFormSchema = z.object({
  phoneNumber: z.string(),
  workEmail: z.string(),
  briefSummary: z.string(),
  role: z.string(),
  photo: z.string(),
  postal: z.string(),
  zip: z.string(),
  town: z.string(),
  county: z.string(),
});

const CreateProfile = () => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const searchParams = useSearchParams();

  const origin = searchParams?.get("origin");
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ReminderFormSchemaType>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      phoneNumber: "",
      workEmail: "",
      briefSummary: "",
      role: "",
      photo: "",
      postal: "",
      zip: "",
      town: "",
      county: "",
    },
  });

  const { mutate: adminCreateProfile, isLoading } =
    trpc.adminCreateProfile.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully created profile",
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
            description: "There was an error while creating your profile",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  function onSubmit(data: ReminderFormSchemaType) {
    adminCreateProfile({ ...data });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <dl className="divide-y divide-gray-200">
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
              <FormField
                control={form.control}
                name="phoneNumber"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-base text-gray-700">
                      <span className="text-red-500 mr-0.5">*</span>Admin&apos;s
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
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Work Email
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
                name="workEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is your work email address?
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
                <span className="flex items-center">
                  Role
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is your main role in the organization?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Founder"
                        disabled={isLoading}
                        {...field}
                        required
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
                  Brief Summary
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
                name="briefSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Give a brief summary about yourself
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
                <span className="flex items-center">Profile Picture</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Upload a profile picture
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

export default CreateProfile;
