"use client";

import { trpc } from "@/app/_trpc/client";
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronDown, GripVertical, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/Editor";
import ReactQuill from "react-quill";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { assessmentCategories } from "../data/create-job/Assessment";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  name: z.string(),
  category: z.string(),
  attemptNumbers: z.string(),
  briefSummary: z.string(),
  numberQuestions: z.string(),
  completeTime: z.string(),
  instructions: z.string(),
  forDemo: z.boolean().default(false),
});
const MAX_SUMMARY_WORDS = 28;

const MIN_CHARACTERS = 10;
const MAX_CHARACTERS = 40;
const CreateBanner = () => {
  const router = useRouter();
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      briefSummary: "",
      attemptNumbers: "",
      instructions: "",
      numberQuestions: "",
      completeTime: "",
      forDemo: false
    },
  });

  const { control } = form;
  const watchBody = useWatch({ control, name: "briefSummary" }) || "";

  function countWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  const bodyWords = countWords(watchBody);
  const typedWords = bodyWords - 1;

  const watchedHeading = useWatch({ control, name: "name" }) || "";
  const watchedHeadingLength = watchedHeading.length;
  const { mutate: createAssessment, isLoading } =
    trpc.adminCreateAssessmentBanner.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully created an assessment banner",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        form.reset();
      },
      onError: (err) => {
        if (err) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem creating this assessment banner",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = (values: FormSchemaType) => {
    createAssessment({ ...values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <dl className="divide-y divide-gray-100">
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Demo Assessment?
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <Label className="font-medium text-base text-gray-700">
                Category of assessment banner
              </Label>
              <FormField
                control={form.control}
                name="forDemo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex items-start justify-between flex-row w-full gap-x-4">
                    <div>
                      <FormLabel className="text-base font-normal">
                        The banner is for a demo type of assessment?
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

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Banner Test Name
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <Label className="font-normal text-base text-gray-700">
                What is the name for the banner assessment test?
              </Label>
              <FormField
                control={form.control}
                name="name"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-base text-gray-700">
                      <span className="text-red-500 mr-0.5">*</span>Test&apos;s
                      Name?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="The unique name of the assessment"
                        disabled={isLoading}
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm">
                      {watchedHeading &&
                        watchedHeading.length === MAX_CHARACTERS && (
                          <>
                            Maximum character limit of {MAX_CHARACTERS} reached.
                          </>
                        )}
                      {watchedHeading &&
                        watchedHeadingLength < MIN_CHARACTERS && (
                          <>
                            You haven&apos;t reached minimum characters of{" "}
                            {MIN_CHARACTERS}
                          </>
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
                  Test Completion Time
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                name="completeTime"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the recommended time period that the entire test
                      will take?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        disabled={isLoading}
                        defaultValue={field.value}
                        className="flex flex-row gap-x-12"
                      >
                        <div className=" space-y-2">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="12" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              12 Minutes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="15" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              15 Minutes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="20" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              20 Minutes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="25" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              25 Minutes
                            </FormLabel>
                          </FormItem>
                        </div>
                        <div className=" space-y-2">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="30" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              30 Minutes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="35" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              35 Minutes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="40" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              40 Minutes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="45" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              45 Minutes
                            </FormLabel>
                          </FormItem>
                        </div>
                      </RadioGroup>
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
                  Assessment Category
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
                      What is the category of this assessment question?
                    </FormLabel>
                    <Popover open={popoverOpen2} onOpenChange={setPopoverOpen2}>
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
                              ? assessmentCategories.find(
                                  (category) => category.value === field.value
                                )?.label
                              : "Select the assessment category"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                        <Command>
                          <CommandInput placeholder="Search for a category..." />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {assessmentCategories
                              .sort((a, b) => a.label.localeCompare(b.label))
                              .map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue("category", category.value);
                                    setPopoverOpen2(false);
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
                <span className="flex items-center">Banner Summary</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="briefSummary"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col">
                      <FormLabel className="font-normal text-base text-gray-700">
                        Write a brief banner summary to display on banner
                      </FormLabel>
                      <Label>My Words: {typedWords}</Label>
                    </div>
                    <FormControl>
                      <Editor
                        disabled={isLoading}
                        {...field}
                        ref={(editor) => (editorRef.current = editor)}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm">
                      {bodyWords > MAX_SUMMARY_WORDS && (
                        <>Maximum body words is {MAX_SUMMARY_WORDS}.</>
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
                <span className="flex items-center">Test Instructions</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write instructions on how the test will be performed
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
                  Number of Questions
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                name="numberQuestions"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      How many questions will the whole assessment have per each
                      attempt?
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
                            <RadioGroupItem value="10" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            10 Questions
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="12" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            12 Questions
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="15" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            15 Questions
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="20" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            20 Questions
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="25" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            25 Questions
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                  Assessment Attempts
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
                name="attemptNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the total desired number of attempts?
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
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            1 Attempt
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            2 Attempts
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="3" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            3 Attempts
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                    <span>Submit</span>
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

export default CreateBanner;
