"use client"

import React, { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import "@/lib/suppressHydration"
import { Button } from "@/components/ui/button";
import {
  Assessment,
  AssessmentBanner,
  EmployerRequestAssessment,
} from "@prisma/client";
import { ArrowRight, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuillPreview from "@/components/QuillPreview";
import { useRouter } from "next/navigation";

type FormSchemaType = z.infer<typeof formSchema>;
export const formSchema = z.object({
  myAnswer: z.string(),
});
interface InitiatedAssessmentProps {
  firstTest: Assessment[];
  initiated: EmployerRequestAssessment;
  banner: AssessmentBanner;
  submitted: number
}

const InitiatedAssessment = ({
  firstTest,
  initiated,
  banner,
  submitted,
}: InitiatedAssessmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions] = useState(() => [...firstTest]);
  const [timeLeft, setTimeLeft] = useState("");
  const maxQuestions = banner.numberQuestions;
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const reportClose = () => {
    setReportOpen((prev) => !prev);
  };

  const reportConfirm = () => {
    setReportOpen((prev) => !prev);
  };

  const toggleOpen = () => {
    setReportOpen(true);
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      myAnswer: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const { mutate: submitAnswer, isLoading } =
    trpc.employerSubmitAssessmentAnswer.useMutation({
      onSuccess: () => {
        if (currentQuestionIndex < maxQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          form.reset();
        }
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description: err.message || "An error occurred",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  const onSubmit = (data: FormSchemaType) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    submitAnswer({
      ...data,
      questionId: currentQuestion.id,
    });
  };

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const completeTime = initiated.completeTime as Date;
    if (isNaN(completeTime.getTime())) {
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const secondsLeft = differenceInSeconds(completeTime, now);
      if (secondsLeft > 0) {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        clearInterval(intervalId);
        setTimeLeft("Time's up");
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentQuestionIndex, questions, initiated.completeTime]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const storedTimeLeft = localStorage.getItem("assessmentTimeLeft");
    if (storedTimeLeft) {
      setTimeLeft(storedTimeLeft);
    }
  }, []);

  useEffect(() => {
    if (
      currentQuestionIndex >= maxQuestions ||
      !currentQuestion ||
      timeLeft === "Time's up"
    ) {
      localStorage.removeItem("assessmentTimeLeft");
    } else {
      localStorage.setItem("assessmentTimeLeft", timeLeft);
    }
  }, [currentQuestionIndex, maxQuestions, currentQuestion, timeLeft]);

  const { mutate: verdictGenerate, isLoading: verdictLoading } =
    trpc.employerGetVerdict.useMutation({
      onSuccess: () => {
        router.push(`/manage/assessments/results/${initiated.id}`)
        router.refresh()
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message || "There was a problem generating the final results",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  const { mutate: reportIssue, isLoading: loadReport } =
    trpc.workInitiateReportAssessmentProblem.useMutation({
      onSuccess: () => {
        toggleOpen();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message ||
            "There was a problem getting you to report a problem",
          variant: "destructive",
          duration: 3000,
        });
      },
    });
  return (
    <>
      <section className="overflow-hidden pb-2">
        <div className="w-full mx-auto">
          <div className="flex items-center flex-row mt-1 sm:mt-0 mb-2 lg:w-8/12 justify-between">
            <div>
              <h3 className="font-bold capitalize line-clamp-1 text-gray-600 tracking-tight text-xl sm:text-2xl">
                {currentQuestionIndex >= maxQuestions ||
                !currentQuestion ||
                timeLeft === "Time's up" ? (
                  <span className="hidden">The Assessment</span>
                ) : (
                  <span>The Assessment</span>
                )}
              </h3>
            </div>
            {currentQuestion && (
              <div className="flex items-center gap-x-1">
                <span className="inline-flex items-center rounded-sm bg-slate-200 h-7 px-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                  Time Left:
                </span>
                <span className="inline-flex items-center rounded-sm bg-slate-200 h-7 w-14 justify-center text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                  {timeLeft ? (
                    timeLeft === "Time's up" ? (
                      <>00:00</>
                    ) : (
                      <>{timeLeft}</>
                    )
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap">
            <div className="w-full lg:pr-4 lg:border lg:border-gray-200 lg:px-3 lg:pt-3 lg:pb-4 rounded-md lg:w-8/12">
              {currentQuestionIndex >= maxQuestions ||
              !currentQuestion ||
              timeLeft === "Time's up" ? (
                <div className="flex items-center justify-center">
                  <div className="flex flex-col max-w-lg items-center px-4 py-8 space-y-3 shadow-md rounded-none border border-gray-100">
                    <h2 className="text-[17px] font-semibold text-gray-600">
                      The Assessment End.
                    </h2>
                    <p className="text-base text-gray-700">
                      This is the end of this demo. If your time has elapsed
                      before you finished, please check to confirm if you have
                      an available attempt left.
                    </p>
                    <Button
                      size="lg"
                      variant="default"
                      onClick={() =>
                        verdictGenerate({
                          bannerID: initiated.demoID as string,
                          requestID: initiated.id as string,
                        })
                      }
                      type="button"
                      className="hover:bg-primary hover:opacity-95"
                    >
                      Check Final Verdict{" "}
                      {verdictLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-1.5 shrink-0" />
                      ) : (
                        <ArrowRight className="h-4 w-4 ml-1.5 shrink-0" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-[16.6px] sm:text-[16.8px] font-medium text-gray-700">
                    {`Question ${submitted + 1}/${maxQuestions}`}
                  </h2>
                  <h2 className="text-base font-medium text-gray-600">
                    {currentQuestion.scenarioExplanation}
                  </h2>
                  <div className="text-base font-normal italic text-gray-700">
                    <QuillPreview htmlContent={currentQuestion?.scenario as string} />
                  </div>

                  <div className="mt-4">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                          control={form.control}
                          disabled={isLoading}
                          name="myAnswer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-base text-gray-600">
                                {currentQuestion.question}
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  disabled={isLoading}
                                  required
                                  defaultValue={field.value}
                                  className="flex flex-col text-gray-700 space-y-0.5 md:space-y-1 text-sm md:text-base"
                                >
                                  <FormItem className="flex items-start space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem
                                        className="flex-shrink-0"
                                        value={currentQuestion.choice1}
                                      />
                                    </FormControl>
                                    <FormLabel
                                      className="font-normal"
                                      style={{
                                        fontSize: "15px !important",
                                      }}
                                    >
                                      {currentQuestion.choice1}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-start space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem
                                        className="flex-shrink-0"
                                        value={currentQuestion.choice2}
                                      />
                                    </FormControl>
                                    <FormLabel
                                      className="font-normal"
                                      style={{
                                        fontSize: "15px !important",
                                      }}
                                    >
                                      {currentQuestion.choice2}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-start space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem
                                        className="flex-shrink-0"
                                        value={currentQuestion.choice3}
                                      />
                                    </FormControl>
                                    <FormLabel
                                      className="font-normal"
                                      style={{
                                        fontSize: "15px !important",
                                      }}
                                    >
                                      {currentQuestion.choice3}
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-sm" />
                            </FormItem>
                          )}
                        />
                        <div className="mt-4 flex flex-col gap-y-5 sm:items-center sm:flex-row sm:justify-between sm:gap-x-3 sm:mt-6 mb-4 lg:mb-0">
                          <Button
                            type="submit"
                            variant="default"
                            size="lg"
                            className="hover:bg-primary w-full sm:w-[250px] hover:opacity-95"
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                            ) : (
                              <>Submit</>
                            )}
                          </Button>
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              disabled={loadReport}
                              onClick={() =>
                                reportIssue({
                                  questionID: currentQuestion.id,
                                })
                              }
                              className="text-base text-[#005580] font-medium hover:underline-offset-2 hover:text-[#005580]"
                            >
                              {loadReport ? (
                                <span className="flex items-center">
                                  <Loader2 className="h-4 w-4 mr-1.5 shrink-0 animate-spin" />
                                  Make Suggestion?
                                </span>
                              ) : (
                                <>Make Suggestion?</>
                              )}
                            </button>
                            <p className="text-sm">
                              <span className="font-semibold">Won&apos;t</span>{" "}
                              interrupt the demo.
                            </p>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:pl-4 mt-3 lg:mt-0 lg:w-4/12">
              <div className="shadow-sm border bg-slate-200 border-gray-200 mb-10 rounded-sm">
                <h3 className="px-4 pt-4 text-[16.6px] sm:text-[16.8px] font-semibold text-gray-600">
                  Overall Test Instructions
                </h3>
                <div className="px-4 pb-6">
                  <div
                    className="text-base font-normal text-gray-700"
                    style={{ color: "#334155 !important" }}
                  >
                    <QuillPreview
                      htmlContent={banner?.instructions as string}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InitiatedAssessment;