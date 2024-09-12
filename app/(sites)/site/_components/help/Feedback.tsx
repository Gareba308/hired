import { HelpWorker } from "@prisma/client";
import {
  Computer,
  CornerUpLeft,
  Loader2,
  ShieldQuestion,
  Sparkles,
  Trash,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NoHelpMessage from "./NoHelpMessage";
interface FeedbackProps {
  myHelpMessages: HelpWorker[];
  name: string;
  toggleView: () => void;
  profilePic: string;
}

const Feedback = ({ myHelpMessages, name, toggleView }: FeedbackProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [currentlyHiding, setCurrentlyHiding] = useState<string | null>(null);

  function getInitialsLastName(fullName: string): string {
    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];
    const firstInitial = firstName.charAt(0).toUpperCase();
    const result = `${firstInitial}.${lastName}`;
    return result;
  }

  const lastName = getInitialsLastName(name);

  const { mutate: removeHelp, isLoading } = trpc.workerUpdateHelp.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The help message has been deleted",
        variant: "default",
        duration: 3000,
      });
      router.refresh();
      setCurrentlyHiding(null);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem deleting this help message. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentlyHiding(null);
    },
    onMutate: ({ helpID }) => {
      setCurrentlyHiding(helpID);
    },
  });

  return (
    <>
      <div>
        <main className="mx-auto -mt-2 max-w-7xl">
          <section
            aria-labelledby="products-heading"
            className="mb-2.5 mt-2 lg:mt-0"
          >
            <div className="flex flex-wrap">
              <div className="w-full min-h-[calc(100vh-100px)] lg:mt-2 px-4 pt-2 pb-4 mx-auto bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
                <div className="flex flex-row items-center border-b border-gray-200 pb-1">
                  <a
                    className="hover:text-[#005580] cursor-pointer"
                    onClick={toggleView}
                  >
                    <CornerUpLeft className="h-6 w-6 mr-2 shrink-0" />
                  </a>
                  <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
                    Help Feedback
                  </h2>
                </div>
                <div className="lg:col-span-3 lg:mt-3 lg:pb-2">
                  <p className="text-xs text-gray-600 lg:hidden mt-1 lg:mt-0">
                    <span className="font-medium">Note:</span> To reply to a
                    help message, please return to{" "}
                    <a
                      className="text-blue-700 cursor-pointer"
                      onClick={toggleView}
                    >
                      Help Desk.
                    </a>
                  </p>
                  {myHelpMessages.length !== 0 ? (
                    <div className="lg:col-span-3 h-full pb-4 lg:mr-1">
                      <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                          <div className="flex items-center space-x-1">
                            <Avatar className="inline-flex w-10 h-10 shrink-0 relative justify-center rounded-full border border-gray-200 bg-transparent ring-1 ring-inset ring-gray-200 hover:bg-gray-50">
                              <AvatarImage src="/avatars/01.png" alt="Image" />
                              <AvatarFallback className="w-full h-full rounded-full">
                                <Sparkles className="text-sky-700 w-7 h-7" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-700 leading-none">
                                Help Team
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="justify-end">
                              <p className="text-sm font-medium text-gray-700 leading-none">
                                {lastName}
                              </p>
                            </div>
                            <div className="inline-flex w-10 h-10 shrink-0 relative justify-center rounded-full bg-transparent shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50">
                              <img
                                src={
                                  "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                                }
                                className="w-full h-full shrink-0 border-none rounded-full"
                                alt={name}
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4 mt-4 pb-4">
                            {myHelpMessages.map((message, index) => {
                              const currentDate = new Date(message.createdAt);
                              const prevMessage = myHelpMessages[index - 1];
                              const prevDate = prevMessage
                                ? new Date(prevMessage.createdAt)
                                : null;
                              const isNewDate =
                                !prevDate ||
                                currentDate.toDateString() !==
                                  prevDate.toDateString();

                              let displayDate = format(currentDate, "PPP");

                              if (isNewDate) {
                                const today = new Date();
                                const yesterday = new Date(today);
                                yesterday.setDate(yesterday.getDate() - 1);

                                if (
                                  currentDate.toDateString() ===
                                  today.toDateString()
                                ) {
                                  displayDate = "Today";
                                } else if (
                                  currentDate.toDateString() ===
                                  yesterday.toDateString()
                                ) {
                                  displayDate = "Yesterday";
                                }
                              }

                              return (
                                <div key={message.id}>
                                  {isNewDate && (
                                    <div className="flex justify-center mb-1">
                                      <div suppressHydrationWarning className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-700/10">
                                        {displayDate}
                                        {displayDate === "Today" ||
                                        displayDate === "Yesterday"
                                          ? `(${format(currentDate, "eee")})`
                                          : null}
                                      </div>
                                    </div>
                                  )}
                                  <div
                                    className={cn("flex items-end", {
                                      "justify-end": message.role === "worker",
                                    })}
                                  >
                                    <div
                                      className={cn(
                                        "flex relative h-5 w-5 sm:h-6 sm:w-6 aspect-square items-center justify-center",
                                        {
                                          "order-2 bg-cyan-800 rounded-sm":
                                            message.role === "worker",
                                          "order-1 bg-slate-600 rounded-sm":
                                            message.role !== "worker",
                                        }
                                      )}
                                    >
                                      {message.role === "worker" ? (
                                        <User className="fill-zinc-200 text-zinc-200 sm:h-6 sm:w-6 h-5 w-5" />
                                      ) : (
                                        <Sparkles className="fill-zinc-200 sm:h-6 sm:w-6 h-5 w-5" />
                                      )}
                                    </div>
                                    <div
                                      className={cn(
                                        "flex flex-col space-y-2 text-base max-w-md mx-2",
                                        {
                                          "order-1 items-end":
                                            message.role === "worker",
                                          "order-1 items-start":
                                            message.role !== "worker",
                                        }
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "px-4 py-2 rounded-lg text-sm inline-block",
                                          {
                                            "bg-cyan-800 text-white":
                                              message.role === "worker",
                                            "bg-slate-200 text-gray-900":
                                              message.role !== "worker",
                                            "rounded-br-none":
                                              message.role === "worker",
                                            "rounded-bl-none":
                                              message.role !== "worker",
                                          }
                                        )}
                                      >
                                        {typeof message.message ? (
                                          <div
                                            className={cn(
                                              "prose whitespace-pre-wrap",
                                              {
                                                "text-zinc-50":
                                                  message.role === "worker",
                                              }
                                            )}
                                          >
                                            {message.message}
                                          </div>
                                        ) : (
                                          message.message
                                        )}
                                        <div className="flex items-center justify-between">
                                          <div
                                           suppressHydrationWarning
                                            className={cn(
                                              "text-xs select-none mt-2",
                                              {
                                                "text-zinc-500":
                                                  message.role !== "worker",
                                                "text-white/90":
                                                  message.role === "worker",
                                              }
                                            )}
                                          >
                                            {format(currentDate, "HH:mm")}
                                          </div>
                                          <div
                                            className={cn(
                                              "text-xs select-none mt-2",
                                              {
                                                "text-zinc-500":
                                                  message.role !== "worker",
                                                "text-white/90":
                                                  message.role === "worker",
                                              }
                                            )}
                                          >
                                            <Button
                                              onClick={() =>
                                                removeHelp({
                                                  helpID: message.id,
                                                })
                                              }
                                              disabled={
                                                isLoading ||
                                                currentlyHiding === message.id
                                              }
                                              variant="ghost"
                                              size="sm"
                                              type="button"
                                              className="h-7 w-7 p-1 rounded-full hover:text-destructive-foreground hover:bg-slate-200"
                                            >
                                              {currentlyHiding === message.id &&
                                              isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                              ) : (
                                                <Trash className="h-4 w-4" />
                                              )}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="lg:col-span-3 h-full pb-4 lg:mr-1">
                      <NoHelpMessage toggleView={toggleView} />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
                <div className="flex flex-col w-full h-full">
                  <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                    <div className="flex justify-between gap-y-6 flex-col">
                      <div className="hidden rounded-sm lg:block lg:pb-4 border border-slate-200 lg:space-y-2 lg:bg-slate-200 px-4 lg:shadow-sm lg:pt-2.5">
                        <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                          <ShieldQuestion className="h-10 w-10" />
                        </h2>

                        <p className="flex items-start gap-2 text-gray-600">
                          <span className="text-base">
                            A job will only be visible here as long as it
                            hasn&apos;t reached the application deadline.
                          </span>
                        </p>

                        <p className="flex items-start mt-3 gap-2 text-gray-600">
                          <span className="text-base">
                            Submitting application or manually undoing the save
                            will remove this job from this section.
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col h-full justify-center">
                        <div className="hidden lg:block rounded-sm border border-slate-200 lg:pb-4 lg:space-y-2 lg:bg-slate-200 px-4 lg:shadow-sm lg:pt-2.5">
                          <h2 className="text-xl text-gray-600 font-semibold flex justify-center">
                            <Computer className="h-10 w-10" />
                          </h2>

                          <p className="flex items-start gap-2 text-gray-600">
                            <span className="text-base">
                              A job will only be visible here as long as it
                              hasn&apos;t reached the application deadline.
                            </span>
                          </p>

                          <p className="flex items-start mt-3 gap-2 text-gray-600">
                            <span className="text-base">
                              Submitting application or manually undoing the
                              save will remove this job from this section.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Feedback;
