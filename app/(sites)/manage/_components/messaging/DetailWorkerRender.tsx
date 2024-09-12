"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmployerContactWorker } from "@prisma/client";
import { format } from "date-fns";
import {
  Archive,
  CheckCheck,
  CornerLeftDown,
  EyeOff,
  Loader2,
  MoreVertical,
  Reply,
  Sparkles,
  Trash,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import SingleReply from "./SingleWorkerReply";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import SingleWorkerReply from "./SingleWorkerReply";
import NoWorkerMessages from "./NoWorkerMessages";
import { DeleteOneWorkerMessageAlertModal } from "../models/workerMessage/DeleteOneWorkerMessage";

type FormSchemaType = z.infer<typeof formSchema>;
export const formSchema = z.object({
  message: z.string(),
});
interface UserItems {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}
interface DetailWorkerRenderProps {
  oneUserMessages: EmployerContactWorker[];
  userExists: UserItems;
  allOneUserMessages: EmployerContactWorker[];
}

const DetailWorkerRender = ({
  oneUserMessages,
  userExists,
  allOneUserMessages,
}: DetailWorkerRenderProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [replyOpen, setReplyOpen] = useState<boolean>(false);
  const [currentlyClickedID, setCurrentlyClickedID] = useState<string | null>(
    null
  );

  const [currentlyHidingID, setCurrentlyHidingID] = useState<string | null>(
    null
  );

  const [deletingID, setDeletingID] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const deleteOnClose = () => setDeleteOpen((current) => !current);
  const [currentlyArchivingID, setCurrentlyArchivingID] = useState<
    string | null
  >(null);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { reset } = form;

  const openMessage = (messageID: string) => {
    setCurrentlyClickedID(messageID);
    setReplyOpen((prev) => !prev);
    reset({ message: "" });
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const { mutate: hideMessage, isLoading } =
    trpc.employerHideWorkerMessage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This messages has been hidden",
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
              "There was a problem while hiding this message. Try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ messageID }) => {
        setCurrentlyHidingID(messageID);
      },
      onSettled: () => {
        setCurrentlyHidingID(null);
      },
    });
  const { mutate: archiveMessage, isLoading: archiveLoading } =
    trpc.employerArchiveWorkerMessage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully archived this message",
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
            description: "There was a problem archiving your message.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ messageID }) => {
        setCurrentlyArchivingID(messageID);
      },
      onSettled: () => {
        setCurrentlyArchivingID(null);
      },
    });

  const { mutate: deleteOneMessage, isLoading: oneDeleteLoading } =
    trpc.employerDeleteWorkerMessage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This messages has been deleted",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        setDeleteOpen(false);
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
          setDeleteOpen(false);
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem while deleting this message. Try again later.",
            variant: "destructive",
            duration: 3000,
          });
          setDeleteOpen(false);
        }
      },
      onMutate: ({ messageID }) => {
        setDeletingID(messageID);
      },
      onSettled: () => {
        setDeletingID(null);
      },
    });

  const submitDeleteOneConfirm = (messageID: string) => {
    deleteOneMessage({ messageID });
  };

  const toggleDelete = (messageID: string) => {
    setDeletingID(messageID);
    setDeleteOpen(true);
  };

  console.log(allOneUserMessages);
  return (
    <section aria-labelledby="products-heading">
      {oneUserMessages.length !== 0 ? (
        <div className="lg:col-span-3 h-full pb-4 lg:mr-1">
          <Card>
            <CardContent>
              <div className="space-y-4 pb-4">
                {oneUserMessages.map((message, index) => {
                  const currentDate = new Date(message.createdAt);
                  const prevMessage = oneUserMessages[index - 1];
                  const prevDate = prevMessage
                    ? new Date(prevMessage.createdAt)
                    : null;
                  const isNewDate =
                    !prevDate ||
                    currentDate.toDateString() !== prevDate.toDateString();

                  let displayDate = format(currentDate, "PPP");

                  if (isNewDate) {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (currentDate.toDateString() === today.toDateString()) {
                      displayDate = "Today";
                    } else if (
                      currentDate.toDateString() === yesterday.toDateString()
                    ) {
                      displayDate = "Yesterday";
                    }
                  }

                  return (
                    <div key={message.id}>
                      {!replyOpen && (
                        <>
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
                              "justify-end": message.role === "employer",
                            })}
                          >
                            <div
                              className={cn(
                                "flex relative h-5 w-5 sm:h-6 sm:w-6 aspect-square items-center justify-center",
                                {
                                  "order-2 bg-cyan-800 rounded-sm":
                                    message.role === "employer",
                                  "order-1 bg-slate-600 rounded-sm":
                                    message.role !== "employer",
                                }
                              )}
                            >
                              {message.role === "employer" ? (
                                <User className="fill-zinc-200 text-zinc-200 sm:h-6 sm:w-6 h-5 w-5" />
                              ) : (
                                <Sparkles className="fill-zinc-200 sm:h-6 sm:w-6 h-5 w-5" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "flex flex-col space-y-2 text-base max-w-md md:max-w-lg mx-2",
                                {
                                  "order-1 items-end": message.role === "employer",
                                  "order-1 items-start":
                                    message.role !== "employer",
                                }
                              )}
                            >
                              <div
                                className={cn(
                                  "px-3 py-2 rounded-lg text-sm inline-block",
                                  {
                                    "bg-cyan-800 text-white/90":
                                      message.role === "employer",
                                    "bg-slate-200 text-gray-800":
                                      message.role !== "employer",
                                    "rounded-br-none": message.role ==="employer",
                                    "rounded-bl-none": message.role !== "employer",
                                  }
                                )}
                              >
                                <div className="flex items-center justify-between gap-x-2">
                                  {deletingID === message.id && (
                                    <DeleteOneWorkerMessageAlertModal
                                      isOpen={deleteOpen}
                                      onClose={deleteOnClose}
                                      onConfirm={() =>
                                        submitDeleteOneConfirm(message.id)
                                      }
                                      loading={oneDeleteLoading}
                                    />
                                  )}
                                  <p
                                    className={cn(
                                      "select-none flex items-end shrink-0 line-clamp-1",
                                      {
                                        "text-zinc-500":
                                          message.role !== "employer",
                                        "text-white/90":
                                          message.role === "employer",
                                      }
                                    )}
                                  >
                                    <CornerLeftDown className="h-4 w-4 mr-1.5 shrink-0" />{" "}
                                  </p>
                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                  >
                                    <div>
                                      <Menu.Button
                                        disabled={
                                          isLoading ||
                                          currentlyHidingID === message.id ||
                                          archiveLoading ||
                                          currentlyArchivingID === message.id ||
                                          oneDeleteLoading ||
                                          deletingID === message.id
                                        }
                                        className={cn(
                                          "w-7 h-7  hover:opacity-90 inline-flex justify-center gap-x-1.5 text-sm items-center rounded-sm",
                                          {
                                            "hover:bg-white/20 text-white/80 ":
                                              message.role === "employer",
                                            "hover:bg-slate-300 hover:text-primary":
                                              message.role !== "employer",
                                          }
                                        )}
                                      >
                                        {currentlyHidingID === message.id &&
                                        isLoading ? (
                                          <>
                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                          </>
                                        ) : currentlyArchivingID ===
                                            message.id && archiveLoading ? (
                                          <>
                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                          </>
                                        ) : oneDeleteLoading &&
                                          deletingID === message.id ? (
                                          <>
                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                          </>
                                        ) : (
                                          <MoreVertical className="h-4 w-4" />
                                        )}
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
                                      <Menu.Items className="absolute right-0 z-10 mt-0.5 py-2 w-44 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "text-gray-600",
                                                  "flex items-center font-medium hover:bg-secondary cursor-pointer px-4 py-1.5 text-sm"
                                                )}
                                                onClick={() =>
                                                  archiveMessage({
                                                    messageID: message.id,
                                                  })
                                                }
                                              >
                                                <Archive className="h-4 w-4 mr-2" />{" "}
                                                Archive Message
                                              </span>
                                            )}
                                          </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "text-gray-600",
                                                  "flex items-center font-medium hover:bg-secondary cursor-pointer px-4 py-1.5 text-sm"
                                                )}
                                                onClick={() =>
                                                  hideMessage({
                                                    messageID: message.id,
                                                  })
                                                }
                                              >
                                                <EyeOff className="h-4 w-4 mr-2" />{" "}
                                                Hide Message
                                              </span>
                                            )}
                                          </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "text-destructive-foreground",
                                                  "flex items-center font-medium hover:bg-destructive hover:text-destructive-foreground cursor-pointer px-4 py-1.5 text-sm"
                                                )}
                                                onClick={() =>
                                                  toggleDelete(message.id)
                                                }
                                              >
                                                <Trash className="h-4 w-4 mr-2" />{" "}
                                                Delete Message
                                              </span>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </div>

                                {message.replyingToID && (
                                  <>
                                    {allOneUserMessages.flatMap(
                                      (userMessage) => (
                                        <div
                                          className="mb-2"
                                          key={userMessage.id}
                                        >
                                          {userMessage.id ===
                                            message.replyingToID && (
                                            <div
                                              className={cn(
                                                "px-2 py-1 rounded-sm",
                                                {
                                                  " bg-slate-300 border-l-2 border-slate-500":
                                                    message.role !== "employer",
                                                  "bg-cyan-900 border-l-2":
                                                    message.role === "employer",
                                                }
                                              )}
                                            >
                                              <div>
                                                {userMessage.subject && (
                                                  <p
                                                    className={cn(
                                                      "select-none",
                                                      {
                                                        "text-gray-600":
                                                          message.role !==
                                                          "employer",
                                                        "text-white/90 opacity-75":
                                                          message.role ===
                                                          "employer",
                                                      }
                                                    )}
                                                  >
                                                    Subject:{" "}
                                                    {userMessage.subject}
                                                  </p>
                                                )}
                                                {typeof userMessage.message ? (
                                                  <div
                                                    className={cn(
                                                      "prose leading-tight line-clamp-3 whitespace-pre-wrap",
                                                      {
                                                        "text-zinc-50 opacity-75":
                                                          message.role ===
                                                          "employer",
                                                        "text-gray-600":
                                                          message.role !==
                                                          "employer",
                                                      }
                                                    )}
                                                  >
                                                    {userMessage.message}
                                                  </div>
                                                ) : (
                                                  userMessage.message
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </>
                                )}

                                <p
                                  className={cn("select-none font-medium", {
                                    "text-zinc-500": message.role !== "employer",
                                    "text-white/90": message.role === "employer",
                                  })}
                                >
                                  Subject: {message.subject}
                                </p>
                                {typeof message.message ? (
                                  <div
                                    className={cn(
                                      "prose leading-tight whitespace-pre-wrap",
                                      {
                                        "text-zinc-50":
                                          message.role === "employer",
                                      }
                                    )}
                                  >
                                    {message.message}
                                  </div>
                                ) : (
                                  message.message
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-x-1.5">
                                    <div
                                     suppressHydrationWarning
                                      className={cn(
                                        "text-xs select-none mt-2",
                                        {
                                          "text-zinc-500":
                                            message.role !== "employer",
                                          "text-white/90":
                                            message.role === "employer",
                                        }
                                      )}
                                    >
                                      {format(currentDate, "HH:mm")}
                                    </div>
                                    {message.role === "employer" && (
                                      <div
                                        className={cn(
                                          "text-xs select-none mt-2",
                                          {
                                            "text-zinc-500":
                                              message.role !== "employer",
                                            "text-white/50":
                                              message.role === "employer",
                                          }
                                        )}
                                      >
                                        <CheckCheck className="h-4 w-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    className={cn("text-xs select-none mt-2", {
                                      "text-zinc-500": message.role !== "employer",
                                      "text-white/90": message.role === "employer",
                                    })}
                                  >
                                    <Button
                                      variant="ghost"
                                      onClick={() => openMessage(message.id)}
                                      size="sm"
                                      type="button"
                                      className={cn("h-7 text-xs", {
                                        "hover:bg-white/20 hover:text-white/80":
                                          message.role === "employer",
                                        "hover:bg-slate-300 hover:text-primary":
                                          message.role !== "employer",
                                      })}
                                    >
                                      <Reply className="h-4 w-4 mr-1" /> Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {currentlyClickedID === message.id && replyOpen && (
                        <SingleWorkerReply
                          message={message}
                          openMessage={openMessage}
                          currentDate={currentDate}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="lg:col-span-3 h-full pb-4 lg:mr-1">
          <NoWorkerMessages userExists={userExists} />
        </div>
      )}
    </section>
  );
};

export default DetailWorkerRender;
