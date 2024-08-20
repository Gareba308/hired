"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckIcon,
  ChevronDown,
  GripVertical,
  Loader2,
  CornerUpLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { categories } from "../data/create-job/BlogData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Editor } from "@/components/Editor";
import ReactQuill from "react-quill";
import { Textarea } from "@/components/ui/textarea";
import CloudUpload from "@/components/CloudUpload";

type CreateBlogFormSchema = z.infer<typeof formSchema>;
const MIN_CHARACTERS = 40;
const MAX_CHARACTERS = 75;

const MIN_BODY_WORDS = 400;

const MAX_CREDIT_CHARACTERS = 30;
export const formSchema = z.object({
  heading: z.string(),
  category: z.string(),
  body: z.string(),
  image: z.string(),
  target: z.string(),
  credit: z.string(),
  keywords: z.string(),
});
const CreateBlog = () => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const router = useRouter();
  const [popoverOpen3, setPopoverOpen3] = useState<boolean>(false);
  const form = useForm<CreateBlogFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "",
      category: "",
      body: "",
      image: "",
      target: "",
      credit: "",
      keywords: "",
    },
  });

  const { isSubmitting } = form.formState;
  const { control } = form;

  const watchedHeading = useWatch({ control, name: "heading" }) || "";
  const watchedHeadingLength = watchedHeading.length;

  const watchBody = useWatch({ control, name: "body" }) || "";

  function countWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  const bodyWords = countWords(watchBody);
  const typedWords = bodyWords - 1;

  const watchCredit = useWatch({ control, name: "credit" }) || "";
  const creditLength = watchCredit.length;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARACTERS) {
      form.setValue("heading", inputValue);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const trimmedText = pastedText.slice(0, MAX_CHARACTERS);
    form.setValue("heading", trimmedText);
    e.preventDefault();
  };
  const { mutate: createBlog, isLoading } =
    trpc.adminCreateBlogPost.useMutation({
      onSuccess: (blog) => {
        const blogId = blog.id;
        toast({
          title: "Success",
          description: "Marketing blog has successfully been created.",
          variant: "default",
          duration: 3000,
        });
        router.push(`/control/blogs/posts/${blogId}`);
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
            description: "There was a problem creating a blog post",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = (values: CreateBlogFormSchema) => {
    createBlog({ ...values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b border-gray-200 pb-1">
          <div className="flex items-center gap-x-1.5 sm:gap-x-2">
            <Link
              href={"/control/jobs"}
              className="hover:text-[#005580] text-gray-700"
            >
              <CornerUpLeft className="h-6 w-6 shrink-0" />
            </Link>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-600 tracking-tight text-2xl lg:text-3xl">
                Create Blog Post
              </h3>
            </div>
          </div>
          <p className="text-gray-600 font-normal text-sm sm:text-base leading-tight">
            As an <span className="font-bold">ADMIN</span>, you are creating
            blog post and articles only related to jobs and relevant to both
            employers and candidates.
          </p>
        </div>
        <dl>
          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 border-b border-gray-100 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Blog Heading
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
                rules={{ required: "Heading cannot be left blank" }}
                name="heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the heading of the blog?
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g.  Why your tech employees are looking for work"
                        required
                        className="placeholder:text-gray-500 placeholder:text-sm"
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

          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid border-b border-gray-100 lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Blog Category
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
                      What category does this blog fall under?
                      <span className="text-xs text-gray-600">
                        (e.g., Real Estate)
                      </span>
                    </FormLabel>
                    <Popover open={popoverOpen3} onOpenChange={setPopoverOpen3}>
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
                                  (category) => category.value === field.value
                                )?.label
                              : "---Select the blog category---"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-h-[350px] overflow-y-scroll">
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

          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 border-b border-gray-100 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Target Group
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
                rules={{ required: "Blog target group cannot be left blank" }}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the heading of the blog?
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
                            <RadioGroupItem value="Worker" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            Workers
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Employer" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            Employers
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="All" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-700">
                            Everyone
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-600 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid border-b border-gray-100 lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Actual Blog
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
                rules={{ required: "Blog body cannot be left blank" }}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col">
                      <FormLabel className="font-normal text-base text-gray-700">
                        Write a clean and professional blog.
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
                      {bodyWords > 1 && bodyWords < MIN_BODY_WORDS && (
                        <>Minimum body words is {MIN_BODY_WORDS}.</>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 border-b border-gray-100 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Blog Keywords
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
                rules={{ required: "Keywords cannot be left blank" }}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What are the maximum 10 keywords you would like the blog
                      to have, separated by commas.
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write maximum of 10 keywords"
                        maxRows={6}
                        minRows={6}
                        rows={6}
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

          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 border-b border-gray-100 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Display Image
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
                rules={{ required: "Blog image cannot be left blank" }}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Upload a display image.
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

          <div className="pt-2 pb-4 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 border-b border-gray-100 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="text-base font-medium text-gray-600">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Image Credit
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
                rules={{ required: "Credit cannot be left blank" }}
                name="credit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Whom do you give credit for this image?
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g.  Image by Unsplash"
                        required
                        className="placeholder:text-gray-500 placeholder:text-sm"
                        {...field}
                        maxLength={MAX_CREDIT_CHARACTERS}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm">
                      {watchCredit &&
                        creditLength === MAX_CREDIT_CHARACTERS && (
                          <>
                            Maximum character limit of {MAX_CREDIT_CHARACTERS}{" "}
                            reached.
                          </>
                        )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div>
            <dl>
              <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-2 lg:grid lg:grid-cols-3 lg:px-0 text-gray-700">
                <dt />
                <dd className="leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-y-4 sm:gap-x-4 lg:gap-x-4">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        bodyWords < MIN_BODY_WORDS ||
                        watchedHeadingLength < MIN_CHARACTERS
                      }
                      className={cn(
                        "flex mt-4 w-full sm:w-[200px] rounded-sm hover:opacity-90 items-center justify-center bg-primary px-8 py-3 sm:py-3.5 text-base font-medium text-primary-foreground",
                        isLoading ||
                          isSubmitting ||
                          bodyWords < MIN_BODY_WORDS ||
                          watchedHeadingLength < MIN_CHARACTERS
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
                      onClick={() => router.push("/control/blogs/posts")}
                      className="flex mt-4 w-full sm:w-[200px] rounded-sm hover:opacity-90 items-center justify-center border border-gray-300 bg-slate-200 px-8 py-3 sm:py-3.5 text-base font-medium text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </dl>
      </form>
    </Form>
  );
};

export default CreateBlog;
