import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactWorker } from "@prisma/client";
import { format } from "date-fns";
import {
  Archive,
  CornerLeftDown,
  EyeOff,
  Loader2,
  MoreVertical,
  Send,
  Sparkles,
  Trash,
  Undo2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { DeleteOneWorkerMessageAlertModal } from "../models/workerMessage/DeleteOneWorkerMessage";
type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  message: z.string(),
});

const maxCharacters = 500;

interface SingleReplyProps {
  message: ContactWorker;
  openMessage: (messageId: string) => void;
  currentDate: Date;
}

const SingleWorkerReply = ({
  message,
  openMessage,
  currentDate,
}: SingleReplyProps) => {
  const { toast } = useToast();
  const router = useRouter();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { control } = form;
  const text = useWatch({ control, name: "message" }) || "";
  const [currentlyHidingID, setCurrentlyHidingID] = useState<string | null>(
    null
  );

  const [deletingID, setDeletingID] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const deleteOnClose = () => setDeleteOpen((current) => !current);
  const [currentlyArchivingID, setCurrentlyArchivingID] = useState<
    string | null
  >(null);
  const remainingCharacters = maxCharacters - text.length;

  const { isSubmitting } = form.formState;

  const { mutate: replyMessage, isLoading } =
    trpc.replyWorkerMessage.useMutation({
      onSuccess: (message) => {
        toast({
          title: "Success",
          description: "Your reply message has been delivered.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        openMessage(message.id);
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
              "There was a problem sending your reply. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const handleSubmit =
    (messageID: string) => async (values: FormSchemaType) => {
      replyMessage({ message: values.message, messageID });
    };

  const { mutate: hideMessage, isLoading: isLoadingHide } =
    trpc.adminHideWorkerMessage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This messages has been hidden",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        openMessage(message.id);
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
    trpc.adminArchiveWorkerMessage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully archived this message",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        openMessage(message.id);
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
    trpc.adminDeleteWorkerMessage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This messages has been deleted",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        setDeleteOpen(false);
        openMessage(message.id);
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

  return (
    <div
      className={cn("flex mt-0 items-end", {
        "justify-end": message.role === "admin",
      })}
    >
      <div
        className={cn(
          "flex relative h-5 w-5 sm:h-6 sm:w-6 aspect-square items-center justify-center",
          {
            "order-2 bg-cyan-800 rounded-sm": message.role === "admin",
            "order-1 bg-slate-600 rounded-sm": message.role !== "admin",
          }
        )}
      >
        {message.role === "admin" ? (
          <User className="fill-zinc-200 text-zinc-200 sm:h-6 sm:w-6 h-5 w-5" />
        ) : (
          <Sparkles className="fill-zinc-200 sm:h-6 sm:w-6 h-5 w-5" />
        )}
      </div>
      <div
        className={cn(
          "flex flex-col space-y-2 text-base max-w-md md:max-w-lg mx-2",
          {
            "order-1 items-end": message.role === "admin",
            "order-1 items-start": message.role !== "admin",
          }
        )}
      >
        <div
          className={cn("px-3 py-2 rounded-lg text-sm inline-block", {
            "bg-cyan-800 text-white/90": message.role === "admin",
            "bg-slate-200 text-gray-900": message.role !== "admin",
            "rounded-br-none": message.role === "admin",
            "rounded-bl-none": message.role !== "admin",
          })}
        >
          <div className="">
            <div className="flex items-center justify-between gap-x-2">
              {deletingID === message.id && (
                <DeleteOneWorkerMessageAlertModal
                  isOpen={deleteOpen}
                  onClose={deleteOnClose}
                  onConfirm={() => submitDeleteOneConfirm(message.id)}
                  loading={oneDeleteLoading}
                />
              )}
              <p
                className={cn(
                  "select-none flex shrink-0 items-end line-clamp-1",
                  {
                    "text-zinc-500": message.role !== "admin",
                    "text-white/90": message.role === "admin",
                  }
                )}
              >
                <CornerLeftDown className="h-4 w-4 mr-1.5 shrink-0" /> Replying
                To:
              </p>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    disabled={
                      isLoadingHide ||
                      currentlyHidingID === message.id ||
                      archiveLoading ||
                      currentlyArchivingID === message.id ||
                      oneDeleteLoading ||
                      deletingID === message.id
                    }
                    className="w-7 h-7 hover:bg-white/20 hover:opacity-90 inline-flex justify-center gap-x-1.5 text-sm items-center rounded-sm"
                  >
                    {currentlyHidingID === message.id && isLoadingHide ? (
                      <>
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      </>
                    ) : currentlyArchivingID === message.id &&
                      archiveLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      </>
                    ) : oneDeleteLoading && deletingID === message.id ? (
                      <>
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      </>
                    ) : (
                      <MoreVertical className="text-white/80 h-4 w-4" />
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
                            <Archive className="h-4 w-4 mr-2" /> Archive Message
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
                            <EyeOff className="h-4 w-4 mr-2" /> Hide Message
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
                            onClick={() => toggleDelete(message.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete Message
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="border-l-2 px-2 py-1 rounded-sm bg-cyan-900">
              <div className="mb-1">
                <p
                  className={cn("select-none font-medium line-clamp-1", {
                    "text-zinc-500 opacity-75": message.role !== "admin",
                    "text-white/90 opacity-75": message.role === "admin",
                  })}
                >
                  Name: {message.workerUserName}
                </p>
              </div>
              <div>
                {message.subject && <p
                  className={cn("select-none", {
                    "text-zinc-500 opacity-75": message.role !== "admin",
                    "text-white/90 opacity-75": message.role === "admin",
                  })}
                >
                  Subject: {message.subject}
                </p>}
                {typeof message.message ? (
                  <div
                    className={cn("prose leading-tight line-clamp-3 whitespace-pre-wrap", {
                      "text-zinc-50 opacity-75": message.role === "admin",
                    })}
                  >
                    {message.message}
                  </div>
                ) : (
                  message.message
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div
              className={cn("text-xs select-none mt-2", {
                "text-zinc-500": message.role !== "admin",
                "text-white/90": message.role === "admin",
              })}
            >
              {format(currentDate, "HH:mm")}
            </div>
            <div
              className={cn("text-xs select-none mt-2", {
                "text-zinc-500": message.role !== "admin",
                "text-white/90": message.role === "admin",
              })}
            >
              <Button
                variant="ghost"
                onClick={() => openMessage(message.id)}
                size="sm"
                type="button"
                className="h-7 bg-white/20 hover:bg-white/20 text-xs hover:opacity-95 hover:text-white/90"
              >
                <Undo2 className="h-4 w-4 mr-1.5" /> Close
              </Button>
            </div>
          </div>
          <div className="flex flex-row gap-3 mt-2 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex h-full flex-1 items-stretch md:flex-col">
              <div className="relative flex flex-col w-full flex-grow">
                <div className="relative">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit(message.id))}
                    >
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Reply here..."
                                maxRows={1}
                                autoFocus
                                {...field}
                                className="resize-none pr-14 text-sm bg-white/20 border-white/20 focus:border-none placeholder:text-white/80 py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                                rows={1}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="absolute bg-cyan-900 hover:bg-cyan-900 hover:opacity-95 bottom-0.5 right-[8px]"
                        aria-label="send message"
                      >
                        {isLoading || isSubmitting ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white/90" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleWorkerReply;