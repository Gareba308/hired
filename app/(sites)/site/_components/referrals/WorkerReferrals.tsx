"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  ArrowRight,
  Copy,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RelatedPost from "./RelatedBlogs";
import { Blogs } from "@prisma/client";
import { format } from "date-fns";

type WorkerReferralsTypes = z.infer<typeof formSchema>;

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
    desc: "Invite job seekers to join this platform using your referral link or via email invitation.",
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
    desc: "For each successful referral, you will earn 10 credits once they sign up and verify their email address.",
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
    desc: "Once your referred candidate completes the above steps and you accumulate a minimum of 200 credit points, you can request redemption. Each point is equivalent to Ksh.1.",
  },
];
interface UserItems {
  id: string;
  email: string;
  referralCode: string | null;
}

interface WorkerReferralsProps {
  user: UserItems;
  blog: Blogs | null;
}
const WorkerReferrals = ({ user, blog }: WorkerReferralsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  const form = useForm<WorkerReferralsTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteeEmail: "",
    },
  });

  const { control } = form;
  const { isSubmitting } = form.formState;

  const { mutate: inviteWorker, isLoading } =
    trpc.workerReferWorkers.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Your email to invite a job seeker has successfully been sent.`,
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

  const onSubmit = (value: WorkerReferralsTypes) => {
    inviteWorker({ ...value });
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
            "You have copied your referral link. Share with other job seekers",
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
              Refer a Job Seeker & get credit
            </h2>
            <p className="text-sm leading-normal tracking-normal text-gray-600 font-normal">
              Earn <span className="font-semibold">10</span> credits for each
              referred friend who signs up and verifies their email. Accumulate
              a minimum of <span className="font-semibold">200 points</span> to
              redeem, where <span className="font-semibold">1 point</span> ={" "}
              <span className="font-semibold">Ksh.1</span>. Each last Thursday
              of the month, the top 3 referrers will receive{" "}
              <span className="font-semibold">Ksh.500</span> bonus.
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
                            By entering a job seeker&apos;s email and clicking{" "}
                            <b>Send Invite</b>, they will receive an autogenerated
                            invitation email from our platform.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="default"
                      type="submit"
                      size="default"
                      className="hover:bg-primary h-10 w-full sm:w-[120px] font-normal hover:opacity-90"
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
                    By entering a job seeker&apos;s email and clicking Invite,
                    they will receive an autogenerated invitation email from our
                    platform.
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
                    className="bg-slate-200 h-10 text-[13px] sm:text-sm text-primary"
                  />
                  <Button
                    type="button"
                    size="default"
                    onClick={handleCopy}
                    variant="default"
                    className="hover:bg-primary h-10 w-full sm:w-[120px] hover:opacity-90 font-normal"
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
              <h3 className="border-b border-body-color border-opacity-10 bg-gray-200 px-5 py-3 text-lg font-semibold text-primary">
                Are you looking for a job?
              </h3>
              <div className="px-5 py-6 leading-relaxed">
                <p className="text-base font-normal">
                  Explore our job listings to find opportunities that match your
                  qualifications and experience. Submit your application today.
                </p>
                <div className="mt-4">
                  <Button
                    size="lg"
                    type="button"
                    onClick={() => router.push("/site/jobs")}
                    className="w-full sm:w-max lg:w-full hover:bg-primary hover:opacity-90"
                  >
                    Explore Jobs
                    <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="shadow-sm border border-gray-300 rounded-md bg-white">
              <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 bg-gray-200 text-lg font-semibold text-primary">
                Read our latest blog article
              </h3>
              {blog ? (
                <ul className="p-5">
                  <li className="pb-4">
                    <RelatedPost
                      title={blog.heading}
                      blogId={blog.id}
                      image={blog.image}
                      slug={`/site/blogs/${blog.id}`}
                      date={`${format(blog.createdAt, "PPP")}, ${format(
                        blog.createdAt,
                        "HH:mm"
                      )}`}
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

export default WorkerReferrals;
