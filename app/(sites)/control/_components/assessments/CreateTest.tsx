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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/Editor";
import ReactQuill from "react-quill-new";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AssessmentBanner } from "@prisma/client";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  bannerID: z.string(),
  question: z.string(),
  choice1: z.string(),
  choice2: z.string(),
  choice3: z.string(),
  attemptType: z.string(),
  answer: z.string(),
  scenarioExplanation: z.string(),
  scenario: z.string(),
});

interface CreateTestProps {
  banners: AssessmentBanner[];
}

const CreateTest = ({ banners }: CreateTestProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const [popoverOpen1, setPopoverOpen1] = useState<boolean>(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerID: "",
      question: "",
      choice1: "",
      choice2: "",
      choice3: "",
      attemptType: "",
      answer: "",
      scenario: "",
      scenarioExplanation: "",
    },
  });

  const { isSubmitting } = form.formState;

  const { mutate: createAssessment, isLoading } =
    trpc.adminCreateAssessment.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully created an assessment question",
          variant: "default",
          duration: 3000,
        });
        form.reset({
          bannerID: "",
          question: "",
          choice1: "",
          choice2: "",
          choice3: "",
          attemptType: "",
          answer: "",
          scenario: "",
          scenarioExplanation: "",
        });
        window.location.reload();
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
            description:
              "There was a problem creating this assessment question",
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
                  Test Name
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <Label className="font-normal text-base text-gray-700">
                What is the name for the test?
              </Label>
              <FormField
                control={form.control}
                name="bannerID"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal text-base text-gray-700">
                      <span className="text-red-500 mr-0.5">*</span>Test&apos;s
                      Name?
                    </FormLabel>
                    <Popover open={popoverOpen1} onOpenChange={setPopoverOpen1}>
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
                              ? banners.find(
                                  (banner) => banner.id === field.value
                                )?.name
                              : "Select the assessment banner name"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                        <Command>
                          <CommandInput placeholder="Search for a banner name..." />
                          <CommandEmpty>No banner name found.</CommandEmpty>
                          <CommandGroup>
                            {banners
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((banner) => (
                                <CommandItem
                                  value={banner.id}
                                  key={banner.id}
                                  disabled={isLoading}
                                  onSelect={() => {
                                    form.setValue("bannerID", banner.id);
                                    setPopoverOpen1(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      banner.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {banner.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                  Assessment Attempt
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
                name="attemptType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the assessment attempt type of this question?
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
                            <RadioGroupItem value="firstAttempt" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            First Attempt
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="secondAttempt" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            Second Attempt
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="thirdAttempt" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            Third Attempt
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
                <span className="flex items-center">Scenario Explanation</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="scenarioExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write Scenario explanation about the scenario you are
                      giving?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief explanation about the scenario"
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
                <span className="flex items-center">Assessment Scenario</span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="scenario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write the entire scenario from where the final question
                      will base on
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
                  Answerable Question
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
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write the question which the user has to read and answer?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="The answerable question"
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
                  Potential Answer 1
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
                name="choice1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write the first potential answer to the question?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choice number 1"
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
                  Potential Answer 2
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
                name="choice2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write the second potential answer to the question?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choice number 2"
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
                  Potential Answer 3
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
                name="choice3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Write the third potential answer to the question?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choice number 3"
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
                  Final Expected Answer
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
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the official accurate answer?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write the official answer"
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

export default CreateTest;
