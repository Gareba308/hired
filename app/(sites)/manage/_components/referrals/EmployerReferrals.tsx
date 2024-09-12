"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { ArrowRight, Copy, Loader2, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { format } from "date-fns";
import "@/lib/suppressHydration"
import RelatedPost from "./RelatedBlogs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Blogs, User } from "@prisma/client";

type EmployerReferralsTypes = z.infer<typeof formSchema>;

export const formSchema = z.object({
  inviteeEmail: z.string(),
});

const features = [
  {
    icon: (
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
        className="h-6 w-6"
      >
        <path d="M2 21a8 8 0 0 1 13.292-6" />
        <circle cx="10" cy="8" r="5" />
        <path d="M19 16v6" />
        <path d="M22 19h-6" />
      </svg>
    ),
    title: "Refer a friend",
    desc: "Invite friends and potential employers to join the platform using your referral link or by sending an email invitation.",
  },
  {
    icon: (
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
        className="h-6 w-6"
      >
        <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
        <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
        <path d="m2 16 6 6" />
        <circle cx="16" cy="9" r="2.9" />
        <circle cx="6" cy="5" r="3" />
      </svg>
    ),
    title: "Earn your reward",
    desc: "Both you and your referred friend will each earn Ksh.500 in credit once they sign up and verify their email. You can apply your credit towards posting a job.",
  },
  {
    icon: (
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
        className="h-6 w-6"
      >
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
      </svg>
    ),
    title: "Claim your reward",
    desc: "Once your invited employer completes the required steps, your credit will automatically be added to your account balance and can be used to post a job.",
  },
];

interface EmployerReferralsProps {
  user: User;
  blog: Blogs | null;
}
const EmployerReferrals = ({ user, blog }: EmployerReferralsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  const form = useForm<EmployerReferralsTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteeEmail: "",
    },
  });

  const { control } = form;
  const { isSubmitting } = form.formState;

  const { mutate: inviteEmployer, isLoading } =
    trpc.employerReferEmployers.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Your email to invite an employer has successfully been sent.`,
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
            description: "There was a problem sending this invite email.",
            variant: "destructive",
            duration: 3000,
          });
        }
        form.reset();
      },
    });

  const onSubmit = (value: EmployerReferralsTypes) => {
    inviteEmployer({ ...value });
  };

  const { mutate: generateReferralLink, isLoading: generateLoading } =
    trpc.userSelfGenerateReferralLink.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Your have successfully generate a referral link`,
          variant: "default",
          duration: 3000,
        });
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
            description:
              "There was a problem generating for you a referral link",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const uniqueCode = user.referralCode as string;

  const trialLink = `https://www.hired.co.ke/referrals/invite/${uniqueCode}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(trialLink)
      .then(() => {
        toast({
          title: "Success",
          description:
            "You have copied your referral link. Share with other employers",
          variant: "default",
          duration: 3000,
        });
      })
      .catch((error) => {
        toast({
          title: "Something went wrong",
          description: "There was a problem copying your referral link.",
          variant: "destructive",
          duration: 3000,
        });
        console.error("Failed to copy link: ", error);
      });
  };
  return (
    <section className="overflow-hidden pb-5">
      <div className="w-full mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full lg:pr-4 lg:w-8/12">
            <h2 className="text-xl sm:text-2xl mt-3 font-bold text-gray-600">
              Refer an employer & get credit
            </h2>
            <p className="text-sm leading-normal tracking-normal text-gray-600 font-normal">
              Refer a potential employer, and you&apos;ll both receive{" "}
              <span className="font-semibold">Ksh.500</span> in credit when they
              sign up and verify their email. Our referral system is
              straightforward and easy to use.
            </p>

            <h3 className="text-lg font-medium text-gray-700 mt-2">
              How does it works?
            </h3>
            <div className="mb-4">
              <ul className="grid gap-y-4">
                {features.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center gap-x-4"
                  >
                    <div className="flex-none w-12 h-12 bg-slate-200 text-slate-600 rounded-md flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="-space-y-1">
                      <h4 className="text-lg text-gray-600 font-medium">
                        {item.title}
                      </h4>
                      <p className="text-base font-normal tracking-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {user.referralCode ? (
              <div>
                <Form {...form}>
                  <Label className="text-lg font-medium">
                    Send invitation email
                  </Label>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-4"
                  >
                    <FormField
                      control={form.control}
                      name="inviteeEmail"
                      render={({ field }) => (
                        <FormItem className="text-gray-700 w-full text-base space-y-0">
                          <FormControl>
                            <Input
                              disabled={isLoading || isSubmitting}
                              required
                              {...field}
                              placeholder="Enter email address"
                              type="email"
                              className="w-full h-10"
                            />
                          </FormControl>
                          <FormDescription className="sm:hidden text-xs mt-0.5">
                            By entering an employer&apos;s email and clicking
                            invite, they will receive autogenerated invitation
                            email from us.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="default"
                      type="submit"
                      size="default"
                      className="hover:bg-primary w-full sm:w-[120px] h-10 font-normal hover:opacity-90"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                      ) : (
                        <>
                          <span className="hidden sm:flex">Invite</span>
                          <span className="sm:hidden">Send Invite</span>
                          <Send className="h-4 w-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </form>
                  <FormDescription className="hidden sm:flex text-xs mt-0.5">
                    By entering an employer&apos;s email and clicking invite,
                    they will receive autogenerated invitation email from us.
                  </FormDescription>
                </Form>
                <div className="mt-5 sm:mt-4 mb-5 sm:mb-2 italic text-base">
                  <h2>Alternatively use referral link?</h2>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Use your referral link
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-4">
                  <Input
                    value={trialLink}
                    readOnly
                    className="bg-slate-200 text-[13px] h-10 sm:text-sm text-primary"
                  />
                  <Button
                    type="button"
                    size="default"
                    onClick={handleCopy}
                    variant="default"
                    className="hover:bg-primary w-full sm:w-[120px] h-10 hover:opacity-90 font-normal"
                  >
                    <Copy className="h-4 w-4 shrink-0 mr-1.5" />
                    <span className="hidden sm:flex">Copy</span>
                    <span className="sm:hidden">Copy Link</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="-space-y-1 mb-4">
                  <h3 className="text-lg text-gray-700 font-medium">
                    You have no referral code
                  </h3>
                  <p className="text-base text-gray-600">
                    Would you like to generate your referral code? It is simple,
                    just takes a few seconds.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => generateReferralLink()}
                  size="lg"
                  className="hover:bg-primary w-full sm:w-max hover:opacity-90 font-normal"
                >
                  {generateLoading ? (
                    <RefreshCw className="h-4 w-4 mr-1.5 shrink-0 animate-spin" />
                  ) : (
                    <RefreshCw className="h-w w-4 mr-1.5 shrink-0" />
                  )}{" "}
                  Generate Link
                </Button>
              </div>
            )}
          </div>
          <div className="w-full mt-6 lg:mt-0 lg:pl-4 lg:w-4/12">
            <div className="shadow-sm border lg:mt-2 border-gray-300 mb-6 lg:mb-12 rounded-md bg-white">
              <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg font-semibold text-primary bg-gray-200">
                Make a Job Listing?
              </h3>
              <div className="px-5 py-6 leading-relaxed">
                <p className="text-base font-normal">
                  Post a job on our platform to connect with a wide pool of
                  talented candidates. Our listing process is both affordable
                  and user-friendly.
                </p>
                <div className="mt-4">
                  <Button
                    size="lg"
                    type="button"
                    onClick={() => router.push("/manage/create-job")}
                    className="w-full sm:w-max lg:w-full hover:bg-primary hover:opacity-90"
                  >
                    Post a Jobs
                    <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="shadow-sm border border-gray-300 rounded-md bg-white">
              <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg bg-gray-200 font-semibold text-primary">
                Read our latest blog article
              </h3>
              {blog ? (
                <ul className="p-5">
                  <li className="pb-4">
                    <RelatedPost
                      title={blog.heading}
                      blogId={blog.id}
                      image={blog.image}
                      slug={`/manage/blogs/${blog.id}`}
                      date={`${format(blog.createdAt, "PPP")}, ${format(
                        blog.createdAt,
                        "HH:mm"
                      )}h`}
                    />
                  </li>
                </ul>
              ) : (
                <div className="text-sm px-5 py-8 font-normal text-gray-500">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1.5">
                    No latest blog posts
                  </h2>
                  <p className="text-base">
                    Our latest blog publication will appear here.
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

export default EmployerReferrals;
