"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckIcon,
  CornerUpLeft,
  Loader2,
  Search,
  SendHorizonal,
  X,
} from "lucide-react";
import Link from "next/link";
import RelatedPost from "./RelatedBlogs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CareerWizard, Job, User } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
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
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface CareerPointDetailsProps {
  myScore: number;
  careerDetails: CareerWizard | null;
  user: User;
  jobs: Job[];
  sameCategoryJobs: Job[];
}

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  jobId: z.string(),
  useGeneratedResume: z.boolean().default(true),
});
const CareerPointDetails = ({
  myScore,
  careerDetails,
  user,
  jobs,
  sameCategoryJobs,
}: CareerPointDetailsProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [popoverOpen1, setPopoverOpen1] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobId: "",
      useGeneratedResume: true,
    },
  });
  const { isSubmitting } = form.formState;

  const { mutate: careerCheck, isLoading: careerCheckLoading } =
    trpc.workerCheckCareer.useMutation({
      onSuccess: () => {
        toast({
          title: "Your search received",
          description:
            "Your career match results has been compiled successfully. All the best in your job search.",
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
            description:
              "The wizard experienced a problem computing your job match details, try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        form.reset();
      },
    });

  const { mutate: careerCheckDelete, isLoading: careerCheckDeleteLoading } =
    trpc.workerDeleteCareerResults.useMutation({
      onSuccess: () => {
        toast({
          title: "The career score results closed",
          description: "You career match results has been closed and deleted",
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
              "The wizard experienced a problem closing your career match result page",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const checkSubmit = (value: FormSchemaType) => {
    careerCheck({ ...value });
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  return (
    <>
      <section className="overflow-hidden pb-2">
        <div className="w-full mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full lg:pr-3 lg:w-2/3">
              <div>
                <div className="flex items-center gap-x-2 sm:gap-x-2.5">
                  <Link
                    href={origin ? `/${origin}` : `/site/jobs`}
                    className="hover:text-[#005580] text-gray-700"
                  >
                    <CornerUpLeft className="h-6 w-6 shrink-0" />
                  </Link>
                  <div className="flex flex-col">
                    <h3 className="font-bold capitalize line-clamp-1 text-gray-600 tracking-tight text-xl sm:text-2xl lg:text-3xl">
                      Career Wizard
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col h-full items-center justify-between gap-y-5">
                  <div>
                    <fieldset className="grid rounded-lg border border-gray-200 px-4 pb-6 pt-0">
                      <legend className="-ml-1 px-1 text-lg text-gray-600 font-semibold">
                        Check how you match a job in seconds
                      </legend>
                      <div>
                        <h2 className="text-lg sm:text-[17.5px] mt-2 font-semibold lg:font-bold text-gray-600">
                          Discover Jobs & Assess Your Qualifications
                        </h2>
                        <p className="text-sm leading-normal tracking-normal text-gray-600 font-normal">
                          Choose a job that aligns with your interests, and our
                          career wizard will review your qualifications,
                          experience, skills, and portfolio to provide a
                          detailed match score.
                        </p>
                      </div>
                      <div>
                        <Form {...form}>
                          <div className="flex flex-col justify-center">
                            <div className="flex font-normal justify-between items-center space-x-2 mb-8">
                              <FormField
                                control={form.control}
                                name="useGeneratedResume"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between w-full gap-x-4">
                                    <div>
                                      <FormLabel className="text-base">
                                        Use generated resume to check my score
                                        instead of uploaded?
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormLabel className="text-[19px] sm:text-xl font-semibold text-gray-600 mb-2 text-center">
                              Search for a job to check your match
                            </FormLabel>
                            <form
                              onSubmit={form.handleSubmit(checkSubmit)}
                              className="flex flex-col w-full sm:flex-row items-center gap-y-3 sm:gap-x-4"
                            >
                              <FormField
                                disabled={careerCheckLoading || isSubmitting}
                                control={form.control}
                                name="jobId"
                                render={({ field }) => (
                                  <FormItem className="text-gray-700 w-full text-base space-y-0">
                                    <Popover
                                      open={popoverOpen1}
                                      onOpenChange={setPopoverOpen1}
                                    >
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            disabled={
                                              careerCheckLoading || isSubmitting
                                            }
                                            className={cn(
                                              "w-full h-10 justify-between font-normal text-gray-700",
                                              !field.value && "text-gray-500"
                                            )}
                                          >
                                            {field.value
                                              ? jobs.find(
                                                  (job) =>
                                                    job.id === field.value
                                                )?.job_title
                                              : "Confidently calculate your job match..."}
                                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                        <Command>
                                          <CommandInput placeholder="Search for a job by job title" />
                                          <CommandEmpty>
                                            No job available.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {jobs
                                              .sort((a, b) =>
                                                a.job_title!.localeCompare(
                                                  b.job_title!
                                                )
                                              )
                                              .map((job) => (
                                                <CommandItem
                                                  value={job.id}
                                                  key={job.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      "jobId",
                                                      job.id
                                                    );
                                                    setPopoverOpen1(false);
                                                  }}
                                                >
                                                  <CheckIcon
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      job.id === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                  {capitalizeFirstLetter(
                                                    job.job_title!
                                                  )}
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
                              <Button
                                type="submit"
                                disabled={
                                  careerCheckLoading || careerCheckDeleteLoading
                                }
                                variant="default"
                                size="default"
                                className="hover:bg-primary w-full h-10 sm:w-[120px] font-normal hover:opacity-95"
                              >
                                Check
                                {careerCheckLoading ? (
                                  <Loader2 className="h-4 w-4 shrink-0 ml-2 animate-spin" />
                                ) : (
                                  <SendHorizonal className="h-4 w-4 ml-2 shrink-0" />
                                )}
                              </Button>
                            </form>
                          </div>
                        </Form>
                      </div>

                      {careerCheckLoading ? (
                        <div className="justify-center font-normal text-base gap-y-3 mt-10 mb-4 flex flex-col items-center">
                          <Loader2 className="h-7 w-7 font-normal shrink-0 animate-spin" />
                          Compiling results
                        </div>
                      ) : (
                        <div className="mt-10">
                          {careerDetails ? (
                            <>
                              <div className="flex items-center justify-between w-full gap-x-3 sm:gap-x-4">
                                <h2 className="text-[19px] sm:text-xl font-semibold text-gray-600 mb-2 text-center">
                                  My Job Match Results
                                </h2>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  disabled={careerCheckDeleteLoading}
                                  onClick={() =>
                                    careerCheckDelete({
                                      careerID: careerDetails.id,
                                    })
                                  }
                                  className="h-7 border flex items-center font-normal hover:bg-destructive hover:text-destructive-foreground border-gray-200 hover:border hover:border-red-100"
                                  size="default"
                                >
                                  {careerCheckDeleteLoading ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4 mr-1" />
                                  )}
                                  Close
                                </Button>
                              </div>
                              <Separator className="mb-2" />
                              <div className="grid gap-2 sm:gap-3">
                                <div className="font-semibold">
                                  Search Details
                                </div>
                                <ul className="grid gap-2 sm:gap-3 text-base">
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground sm:hidden">
                                      Date:
                                    </span>
                                    <span className="text-muted-foreground hidden sm:flex">
                                      Search Date:
                                    </span>
                                    <span suppressHydrationWarning>
                                      {format(careerDetails.createdAt, "PPP")}
                                    </span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground sm:hidden">
                                      Title:
                                    </span>
                                    <span className="text-muted-foreground hidden sm:flex">
                                      The Job Title:
                                    </span>
                                    <span>{careerDetails.jobName}</span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground sm:hidden">
                                      Category:
                                    </span>
                                    <span className="text-muted-foreground hidden sm:flex">
                                      Job Category:
                                    </span>
                                    <span>{careerDetails.jobCategory}</span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground sm:hidden">
                                      Vacancies:
                                    </span>
                                    <span className="text-muted-foreground hidden sm:flex">
                                      Job Vacancies:
                                    </span>
                                    <span>{careerDetails.vacancies}</span>
                                  </li>
                                </ul>
                                <Separator className="my-2" />
                                <ul className="grid gap-2 sm:gap-3 text-base">
                                  <li className="flex items-center font-semibold justify-between">
                                    <span className="text-muted-foreground sm:hidden">
                                      Score:
                                    </span>
                                    <span className="text-muted-foreground hidden sm:flex">
                                      Match Score:
                                    </span>
                                    <span>{Math.round(myScore)}%</span>
                                  </li>
                                </ul>
                              </div>
                            </>
                          ) : (
                            <div className="mb-4 lg:mb-8">
                              <p className="text-center text-lg text-muted-foreground">
                                No match results yet
                              </p>
                              <p className="text-center text-sm text-muted-foreground">
                                The match search takes only seconds. Try
                                it today.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </fieldset>
                  </div>

                  <div>
                    <div className="relative z-10 overflow-hidden rounded-md bg-[#005580] bg-opacity-10 p-2 sm:p-6 md:p-8 lg:p-9">
                      <p className="sm:text-center text-sm sm:text-base font-medium italic text-body-color">
                        Disclaimer! The score obtained in this section is simply
                        a calculation based on your experience, skills and other
                        qualifications. The final match results might not be
                        100% accurate.
                      </p>
                      <span className="absolute left-0 top-0 z-[-1]">
                        <svg
                          width="132"
                          height="109"
                          viewBox="0 0 132 109"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.5"
                            d="M33.0354 90.11C19.9851 102.723 -3.75916 101.834 -14 99.8125V-15H132C131.456 -12.4396 127.759 -2.95278 117.318 14.5117C104.268 36.3422 78.7114 31.8952 63.2141 41.1934C47.7169 50.4916 49.3482 74.3435 33.0354 90.11Z"
                            fill="url(#paint0_linear_111:606)"
                          />
                          <path
                            opacity="0.5"
                            d="M33.3654 85.0768C24.1476 98.7862 1.19876 106.079 -9.12343 108.011L-38.876 22.9988L100.816 -25.8905C100.959 -23.8126 99.8798 -15.5499 94.4164 0.87754C87.5871 21.4119 61.9822 26.677 49.5641 38.7512C37.146 50.8253 44.8877 67.9401 33.3654 85.0768Z"
                            fill="url(#paint1_linear_111:606)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_111:606"
                              x1="94.7523"
                              y1="82.0246"
                              x2="8.40951"
                              y2="52.0609"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" stopOpacity="0.06" />
                              <stop
                                offset="1"
                                stopColor="white"
                                stopOpacity="0"
                              />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_111:606"
                              x1="90.3206"
                              y1="58.4236"
                              x2="1.16149"
                              y2="50.8365"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" stopOpacity="0.06" />
                              <stop
                                offset="1"
                                stopColor="white"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="absolute bottom-0 right-0 z-[-1]">
                        <svg
                          width="53"
                          height="30"
                          viewBox="0 0 53 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            opacity="0.8"
                            cx="37.5"
                            cy="37.5"
                            r="37.5"
                            fill="#1e293b"
                          />
                          <mask
                            id="mask0_111:596"
                            style={{ maskType: "alpha" }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="75"
                            height="75"
                          >
                            <circle
                              opacity="0.8"
                              cx="37.5"
                              cy="37.5"
                              r="37.5"
                              fill="#1e293b"
                            />
                          </mask>
                          <g mask="url(#mask0_111:596)">
                            <circle
                              opacity="0.8"
                              cx="37.5"
                              cy="37.5"
                              r="37.5"
                              fill="url(#paint0_radial_111:596)"
                            />
                            <g opacity="0.8" filter="url(#filter0_f_111:596)">
                              <circle
                                cx="40.8089"
                                cy="19.853"
                                r="15.4412"
                                fill="white"
                              />
                            </g>
                          </g>
                          <defs>
                            <filter
                              id="filter0_f_111:596"
                              x="4.36768"
                              y="-16.5881"
                              width="72.8823"
                              height="72.8823"
                              filterUnits="userSpaceOnUse"
                              colorInterpolationFilters="sRGB"
                            >
                              <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                              />
                              <feGaussianBlur
                                stdDeviation="10.5"
                                result="effect1_foregroundBlur_111:596"
                              />
                            </filter>
                            <radialGradient
                              id="paint0_radial_111:596"
                              cx="0"
                              cy="0"
                              r="1"
                              gradientUnits="userSpaceOnUse"
                              gradientTransform="translate(37.5 37.5) rotate(90) scale(40.2574)"
                            >
                              <stop stopOpacity="0.47" />
                              <stop offset="1" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:pl-3 lg:w-1/3">
              <div className="shadow-sm border border-gray-300 mt-6 lg:mt-12 mb-10 rounded-sm bg-white">
                <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg bg-gray-200 font-semibold text-primary">
                  Value Of Job Matching?
                </h3>
                <div className="px-5 py-6 leading-relaxed">
                  <p className="text-sm sm:text-base font-normal">
                    Calculating job match ensures alignment with skills,
                    experience, and career goals, thereby enhancing your job
                    satisfaction, productivity, and long-term success.
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
              <div className="shadow-sm border border-gray-300 mb-1 rounded-sm bg-white">
                <h3 className="border-b border-body-color bg-gray-200 border-opacity-10 px-5 py-3 text-lg font-semibold text-primary">
                  Latest Job Posts
                </h3>
                {jobs.length !== 0 ? (
                  <ul className="p-5">
                    {careerDetails ? (
                      <>
                        {jobs.slice(0, 3).flatMap((job, index) => (
                          <li
                            key={job.id}
                            className={`mb-4 ${
                              index !== jobs.slice(0, 3).length - 1
                                ? "border-b border-body-color pb-4 border-opacity-10"
                                : ""
                            }`}
                          >
                            <RelatedPost
                              title={job.job_title}
                              company={job.company_name}
                              image={job.companyLogo as string}
                              slug={`/site/jobs/${job.id}`}
                              date={`${format(job.createdAt, "PPP")}`}
                            />
                          </li>
                        ))}
                      </>
                    ) : (
                      <>
                        {jobs.slice(0, 1).flatMap((job, index) => (
                          <li
                            key={job.id}
                            className={`mb-6 ${
                              index !== jobs.slice(0, 1).length - 1
                                ? "border-b border-body-color pb-4 border-opacity-10"
                                : ""
                            }`}
                          >
                            <RelatedPost
                              title={job.job_title}
                              company={job.company_name}
                              image={job.companyLogo as string}
                              slug={`/site/jobs/${job.id}`}
                              date={`${format(job.createdAt, "PPP")}`}
                            />
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                ) : (
                  <div className="text-sm px-5 py-8 font-normal text-gray-500">
                    <h2 className="text-lg font-semibold text-gray-600 mb-1.5">
                      No latest job posts
                    </h2>
                    <p className="text-base">
                      Other latest job posts will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerPointDetails;
