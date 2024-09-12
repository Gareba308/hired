"use client";
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
import {
  ArrowRight,
  BarChart4,
  CheckIcon,
  ChevronDown,
  LayoutPanelLeft,
  Loader2,
  Mails,
  MoveRight,
  Send,
  Undo,
} from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@/components/Editor";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import ReactQuill from "react-quill";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { reasonsForEmailToWorkerGeneral } from "../data/create-job/BlogData";
import { Menu, Transition } from "@headlessui/react";
import { formatDistanceToNowStrict } from "date-fns";

type EmailFormTypes = z.infer<typeof formSchema>;

export const formSchema = z.object({
  reason: z.string(),
  subject: z.string(),
  message: z.string(),
});
interface UserIncompleteProfileItems {
  id: string;
  email: string;
}
interface AllWorkersForGeneralEmailsItems {
  id: string;
  email: string;
}
interface UserIncompletePortfolioItems {
  id: string;
  email: string;
}
interface FinalDataCountsItems {
  id: string;
  reason: string;
  emailedUserIdsCount: number;
  createdAt: Date;
}
interface EmailSectionProps {
  allWorkersForGeneralEmails: AllWorkersForGeneralEmailsItems[];
  userIncompleteProfile: UserIncompleteProfileItems[];
  userIncompletePortfolio: UserIncompletePortfolioItems[];
  finalDataCounts: FinalDataCountsItems[];
}
const GeneralEmail = ({
  allWorkersForGeneralEmails,
  userIncompleteProfile,
  userIncompletePortfolio,
  finalDataCounts,
}: EmailSectionProps) => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const handleSelectCompany = (reason: string) => {
    form.setValue("reason", reason);
    setPopoverOpen(false);
  };
  const form = useForm<EmailFormTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      subject: "",
      message: "",
    },
  });

  const { control } = form;
  const reasonWatch = useWatch({ control, name: "reason" }) || "";

  const profileReasonForEmail = reasonWatch === "Incomplete profile";
  const profileUserIds = userIncompleteProfile.flatMap((item) => item.id);
  const profileUserEmails = userIncompleteProfile.flatMap((item) => item.email);

  const portfolioReasonForEmail = reasonWatch === "Incomplete portfolio";
  const portfolioUserIds = userIncompletePortfolio.flatMap((item) => item.id);
  const portfolioUserEmails = userIncompletePortfolio.flatMap(
    (item) => item.email
  );

  const generalUserIds = allWorkersForGeneralEmails.flatMap((item) => item.id);
  const generalUserEmails = allWorkersForGeneralEmails.flatMap(
    (item) => item.email
  );

  const recipientUserIds = profileReasonForEmail
    ? profileUserIds
    : portfolioReasonForEmail
    ? portfolioUserIds
    : generalUserIds;

  const recipientUserEmails = profileReasonForEmail
    ? profileUserEmails
    : portfolioReasonForEmail
    ? portfolioUserEmails
    : generalUserEmails;

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (reasonWatch.length === 0) {
      form.setValue("subject", "");
    }
  }, [reasonWatch.length, form]);

  const { mutate: sendEmail, isLoading } =
    trpc.adminEmailWorkerOnGeneral.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Email has successfully been delivered.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
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
            description: "There was a problem sending this email",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = (values: EmailFormTypes) => {
    sendEmail({
      ...values,
      emailedUserIds: recipientUserIds,
      recipientsEmail: recipientUserEmails,
    });
  };
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const cancelSubmit = () => {
    form.reset();
    router.push("/control/email");
  };
  return (
    <section className="overflow-hidden pb-5">
      <div className="w-full mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full lg:pr-4 lg:w-8/12">
            <div className="flex items-center w-full justify-between gap-x-4">
              <div className=" flex items-center flex-row">
                <Link
                  href={origin ? `/${origin}` : "/control/email"}
                  className="hover:text-[#005580]"
                >
                  <Undo className="h-6 w-6 mr-2.5 shrink-0" />
                </Link>
                <h1 className="mb-2 text-3xl font-bold leading-tight text-gray-700 sm:text-3xl tracking-tight">
                  General Emails
                </h1>
              </div>
              <div>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex font-normal w-full justify-center items-center gap-x-1.5 rounded-sm bg-primary px-3 h-[38px] text-sm text-primary-foreground hover:opacity-90">
                      <span className="hidden sm:flex">More Options</span>
                      <span className="sm:hidden">Options</span>
                      <ChevronDown className="h-4 w-4 ml-0.5 shrink-0" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute w-52 mx-auto right-0 z-10 mt-1  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/control/email/skills"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-700"
                                  : "text-gray-600",
                                "flex items-center hover:bg-secondary font-normal cursor-pointer px-4 py-2 text-sm"
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 shrink-0 mr-2"
                              >
                                <path d="M12 12h.01" />
                                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                                <rect
                                  width="20"
                                  height="14"
                                  x="2"
                                  y="6"
                                  rx="2"
                                />
                              </svg>
                              Email Skills
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/control/email"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-700"
                                  : "text-gray-600",
                                "flex items-center hover:bg-secondary font-normal cursor-pointer px-4 py-2 text-sm"
                              )}
                            >
                              <LayoutPanelLeft className="h-5 w-5 shrink-0 mr-2" />
                              Email Categories
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/control/email/analytics/general?origin=control/email/general"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-700"
                                  : "text-gray-600",
                                "flex items-center hover:bg-secondary font-normal cursor-pointer px-4 py-2 text-sm"
                              )}
                            >
                              <BarChart4 className="h-5 w-5 shrink-0 mr-2" />{" "}
                              General Analytics
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
            <div>
              <fieldset className="grid rounded-lg border border-slate-300 px-4 pt-0 pb-4">
                <legend className="-ml-1 px-1 text-lg text-gray-700 font-medium">
                  Compose New Email
                </legend>
                <div>
                  <span className="inline-flex items-center rounded-sm bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Recipients:{" "}
                    {reasonWatch.length !== 0 ? recipientUserEmails.length : 0}
                  </span>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-0 mt-2">
                          <FormLabel className="font-medium text-sm text-gray-700">
                            Reason for email
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
                                    ? reasonsForEmailToWorkerGeneral.find(
                                        (reason) => reason.value === field.value
                                      )?.label
                                    : "---Select a reason---"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search company..." />
                                <CommandEmpty>No company found.</CommandEmpty>
                                <CommandGroup>
                                  {reasonsForEmailToWorkerGeneral
                                    .sort((a, b) =>
                                      a.label.localeCompare(b.label)
                                    )
                                    .map((reason, index) => (
                                      <CommandItem
                                        value={reason.value}
                                        key={index}
                                        onSelect={() =>
                                          handleSelectCompany(reason.value)
                                        }
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            reason.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {reason.label}
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
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="text-gray-700 text-sm mt-4 flex flex-col space-y-0">
                          <FormLabel className="text-gray-600 text-sm mb-0.5">
                            Subject
                          </FormLabel>
                          <Select required onValueChange={field.onChange}>
                            <FormControl className="w-full">
                              <SelectTrigger
                                disabled={
                                  isLoading ||
                                  isSubmitting ||
                                  (portfolioReasonForEmail &&
                                    recipientUserEmails.length === 0) ||
                                  (profileReasonForEmail &&
                                    recipientUserEmails.length === 0)
                                }
                              >
                                <SelectValue
                                  className="text-gray-400"
                                  placeholder={
                                    (portfolioReasonForEmail &&
                                      recipientUserEmails.length === 0) ||
                                    (profileReasonForEmail &&
                                      recipientUserEmails.length === 0)
                                      ? "You have no recipients yet"
                                      : "---Select subject---"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full max-h-[300px] overflow-y-auto text-gray-700">
                              {!profileReasonForEmail &&
                                !portfolioReasonForEmail && (
                                  <SelectItem value="New job available">
                                    New job available
                                  </SelectItem>
                                )}
                              {!profileReasonForEmail &&
                                !portfolioReasonForEmail && (
                                  <SelectItem value="Check out these new jobs">
                                    Check out these new jobs
                                  </SelectItem>
                                )}
                              {profileReasonForEmail && (
                                <SelectItem value="Incomplete profile">
                                  Incomplete profile
                                </SelectItem>
                              )}
                              {profileReasonForEmail && (
                                <SelectItem value="Complete Your Profile">
                                  Complete Your Profile
                                </SelectItem>
                              )}
                              {portfolioReasonForEmail && (
                                <SelectItem value="Incomplete portfolio">
                                  Incomplete portfolio
                                </SelectItem>
                              )}
                              {portfolioReasonForEmail && (
                                <SelectItem value="Complete Your Portfolio">
                                  Complete Your Portfolio
                                </SelectItem>
                              )}
                              {!profileReasonForEmail &&
                                !portfolioReasonForEmail && (
                                  <SelectItem value="New article published">
                                    New article published
                                  </SelectItem>
                                )}
                              {!profileReasonForEmail &&
                                !portfolioReasonForEmail && (
                                  <SelectItem value="Announcing new changes">
                                    Announcing new changes
                                  </SelectItem>
                                )}
                              {!profileReasonForEmail &&
                                !portfolioReasonForEmail && (
                                  <SelectItem value="General Feedback">
                                    General Feedback
                                  </SelectItem>
                                )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 font-normal text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="text-gray-700 text-base mt-4 space-y-0">
                          <FormLabel className="text-gray-600">
                            Email Body
                          </FormLabel>
                          <FormControl>
                            <Editor
                              disabled={
                                isLoading ||
                                isLoading ||
                                isSubmitting ||
                                (portfolioReasonForEmail &&
                                  recipientUserEmails.length === 0) ||
                                (profileReasonForEmail &&
                                  recipientUserEmails.length === 0)
                              }
                              {...field}
                              ref={(editor) => (editorRef.current = editor)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col w-full sm:w-max sm:flex-row gap-y-5 sm:gap-x-4 sm:items-center">
                      <Button
                        variant="default"
                        type="submit"
                        size="lg"
                        disabled={
                          isLoading ||
                          isLoading ||
                          isSubmitting ||
                          (portfolioReasonForEmail &&
                            recipientUserEmails.length === 0) ||
                          (profileReasonForEmail &&
                            recipientUserEmails.length === 0)
                        }
                        className="hover:bg-primary sm:w-[160px] hover:opacity-90 border"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                        ) : (
                          <>
                            Send Email <Send className="h-4 w-4 ml-1.5" />
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => cancelSubmit()}
                        size="lg"
                        className="bg-slate-200 border sm:w-[160px] border-gray-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </fieldset>
            </div>
          </div>
          <div className="w-full lg:pl-4 lg:w-4/12">
            <div className="shadow-sm border border-gray-200 mb-5 rounded-sm bg-white">
              <h3 className="border-b border-body-color border-opacity-10 px-5 py-4 text-lg font-semibold text-black">
                What is on your mind?
              </h3>
              <div className="px-5 py-6 leading-relaxed">
              <p className="text-base font-normal">
                  For data on potential categories to email candidates on and
                  those recently emailed.
                </p>
                <div className="mt-4">
                  <Button
                    size="lg"
                    type="button"
                    onClick={() => router.push("/control/email/analytics?origin=control/email/general")}
                    className="w-full sm:w-max lg:w-full hover:bg-primary hover:opacity-90"
                  >
                    Emailing Analytics
                    <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="shadow-sm border border-gray-200 mb-10 rounded-sm bg-white">
              <h3 className="border-b border-body-color border-opacity-10 px-5 py-4 text-lg font-semibold text-primary">
                Latest General Skills
              </h3>
              {finalDataCounts.length !== 0 ? (
                <ul className="px-5 pt-5">
                  {finalDataCounts.flatMap((post, index, array) => (
                    <li
                      key={post.id}
                      className={`mb-6 ${
                        index === array.length - 1
                          ? ""
                          : "border-b border-body-color pb-4 border-opacity-10"
                      }`}
                    >
                      <div className="flex items-center lg:flex xl:flex">
                        <div className="w-full">
                          <div>
                            <span className="mb-[3px] block text-base font-medium leading-snug text-primary">
                              {post.reason}
                            </span>
                          </div>
                          <div className="flex items-center gap-x-4 text-muted-foreground flex-wrap">
                            <p suppressHydrationWarning className="text-xs font-medium text-body-color">
                              &bull;{" "}
                              {formatDistanceToNowStrict(post.createdAt, {
                                addSuffix: true,
                              })}
                            </p>
                            <p className="text-xs font-medium text-body-color">
                              &bull; Emailed: {post.emailedUserIdsCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm px-5 py-8 font-normal text-gray-500">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1.5">
                    No general emails
                  </h2>
                  <p className="text-sm">
                    Details on latest general emails will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralEmail;
