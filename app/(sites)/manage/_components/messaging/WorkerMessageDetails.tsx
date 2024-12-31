"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import {EmployerContactWorker } from "@prisma/client";
import {
  ArchiveRestore,
  ChevronDown,
  CornerUpLeft,
  EyeOff,
  LayoutList,
  Loader2,
  Trash,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import DetailWorkerRender from "./DetailWorkerRender";
import DetailWorkerCard from "./DetailWorkerCard";
import { HideWorkerMessagesAlertModal } from "../models/workerMessage/HideWorkerMessages";
import { DeleteAllWorkerMessagesAlertModal } from "../models/workerMessage/DeleteWorkerMessages";
interface UserItems {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}
interface WorkerMessagesProps {
  workerMessages: EmployerContactWorker[];
  workersWithMessages: UserItems[];
  oneUserMessages: EmployerContactWorker[];
  userExists: UserItems;
  users: UserItems[];
  allOneUserMessages: EmployerContactWorker[];
}

const WorkerMessageDetails = ({
  workerMessages,
  workersWithMessages,
  oneUserMessages,
  userExists,
  users,
  allOneUserMessages,
}: WorkerMessagesProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [hideOpen, setHideOpen] = useState<boolean>(false);
  const hideOnClose = () => setHideOpen((current) => !current);

  const [deleteAllOpen, setDeleteAllOpen] = useState<boolean>(false);
  const deleteAllOnClose = () => setDeleteAllOpen((current) => !current);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [oneUserMessages]);

  const { mutate: unarchiveMessages, isLoading: unarchiveLoading } =
    trpc.employerUnarchiveWorkersMessages.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "You have successfully restored all your archived messages",
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
            title: "something went wrong",
            description: "There was a problem trying to restore your messages",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const { mutate: confirmHideAllMessages, isLoading: hideAllLoading } =
    trpc.employerHideAllWorkersMessages.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "You have successfully hidden all messages from this candidate",
          variant: "default",
          duration: 3000,
        });
        setHideOpen(false);
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
          setHideOpen(false);
        } else {
          toast({
            title: "something went wrong",
            description:
              "There was a problem trying to hide all these messages",
            variant: "destructive",
            duration: 3000,
          });
          setHideOpen(false);
        }
      },
    });

  const submitHideAll = () => {
    confirmHideAllMessages({ workerUserId: userExists?.id as string });
  };

  const { mutate: confirmDeleteAll, isLoading: deleteAllLoading } =
    trpc.employerDeleteAllWorkerMessages.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "You have successfully deleted all messages from this candidate",
          variant: "default",
          duration: 3000,
        });
        setDeleteAllOpen(false);
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
          setDeleteAllOpen(false);
        } else {
          toast({
            title: "something went wrong",
            description:
              "There was a problem trying to delete all messages from this candidate",
            variant: "destructive",
            duration: 3000,
          });
          setDeleteAllOpen(false);
        }
      },
    });

  const onConfirmAllDelete = () => {
    confirmDeleteAll({ workerUserId: userExists?.id as string });
  };

  return (
    <div className="sm:max-h-[calc(100vh-100px)] min-h-[calc(100vh-95px)] sm:rounded-md bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto overflow-hidden">
      <main className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between pb-1 pt-2 border-b border-gray-200">
          <div className="flex items-center justify-between gap-x-2 w-full">
            <div className="flex items-center gap-x-1.5 sm:gap-x-2">
              <Link
                href={"/manage/messaging"}
                className="hover:text-[#005580] text-gray-700"
              >
                <CornerUpLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-1.5 sm:mr-2.5 shrink-0" />
              </Link>
              <div className="flex items-center flex-row gap-x-2">
                <div className="w-10 h-10 border relative border-gray-100 shrink-0 rounded-full  flex justify-center">
                  <Image
                    src={
                      "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                    }
                    alt="Logo"
                    width={40}
                    height={40}
                    quality={100}
                    priority={true}
                    className="rounded-full shrink-0"
                  />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <h3 className="font-bold text-gray-600 line-clamp-1 tracking-tighter text-lg sm:text-xl lg:text-2xl">
                    {userExists?.name as string}
                  </h3>
                  <h3 className="text-sm text-gray-500 line-clamp-1 -mt-1.5">
                    {userExists.email}
                  </h3>
                </div>
              </div>
            </div>
            <div>
              <HideWorkerMessagesAlertModal
                isOpen={hideOpen}
                onClose={hideOnClose}
                onConfirm={submitHideAll}
                loading={hideAllLoading}
              />
              <DeleteAllWorkerMessagesAlertModal
                isOpen={deleteAllOpen}
                onClose={deleteAllOnClose}
                onConfirm={onConfirmAllDelete}
                loading={deleteAllLoading}
              />
              <Menu as="div" className="relative sm:hidden text-left">
                <div>
                  <Menu.Button
                    disabled={unarchiveLoading || hideAllLoading}
                    className="inline-flex font-medium w-full justify-center items-center gap-x-1.5 rounded-sm bg-secondary px-3 h-9 text-sm hover:opacity-90"
                  >
                    {unarchiveLoading ? (
                      <Loader2 className="h-4 w-4 ml-0.5 shrink-0 animate-spin" />
                    ) : hideAllLoading ? (
                      <Loader2 className="h-4 w-4 ml-0.5 shrink-0 animate-spin" />
                    ) : deleteAllLoading ? (
                      <Loader2 className="h-4 w-4 ml-0.5 shrink-0 animate-spin" />
                    ) : (
                      <LayoutList className="text-gray-600 shrink-0" />
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
                  <Menu.Items className="absolute w-52 mx-auto right-0 z-10 mt-1  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => unarchiveMessages()}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-700"
                                : "text-gray-600",
                              "flex items-center hover:bg-secondary font-medium cursor-pointer px-4 py-2 text-sm"
                            )}
                          >
                            <ArchiveRestore className="h-4 w-4 shrink-0 mr-1.5" />
                            Restore Achieved
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => setHideOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-700"
                                : "text-gray-600",
                              "flex items-center hover:bg-secondary font-medium cursor-pointer px-4 py-2 text-sm"
                            )}
                          >
                            <EyeOff className="h-4 w-4 shrink-0 mr-1.5" /> Hide
                            All Messages
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => setDeleteAllOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-700"
                                : "text-destructive-foreground",
                              "flex items-center font-medium cursor-pointer hover:text-destructive-foreground hover:bg-destructive px-4 py-2 text-sm"
                            )}
                          >
                            <Trash className="h-4 w-4 shrink-0 mr-1.5" /> Delete
                            All Messages
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <Menu
                as="div"
                className="relative hidden sm:inline-block text-left"
              >
                <div>
                  <Menu.Button
                    disabled={unarchiveLoading || hideAllLoading}
                    className="inline-flex font-medium w-full justify-center items-center gap-x-1.5 rounded-sm bg-primary px-3 h-9 text-sm text-primary-foreground hover:opacity-90"
                  >
                    More Actions{" "}
                    {unarchiveLoading ? (
                      <Loader2 className="h-4 w-4 ml-0.5 shrink-0 animate-spin" />
                    ) : hideAllLoading ? (
                      <Loader2 className="h-4 w-4 ml-0.5 shrink-0 animate-spin" />
                    ) : deleteAllLoading ? (
                      <Loader2 className="h-4 w-4 ml-0.5 shrink-0 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-0.5 shrink-0" />
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
                  <Menu.Items className="absolute w-52 mx-auto right-0 z-10 mt-1  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => unarchiveMessages()}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-700"
                                : "text-gray-600",
                              "flex items-center hover:bg-secondary font-medium cursor-pointer px-4 py-2 text-sm"
                            )}
                          >
                            <ArchiveRestore className="h-4 w-4 shrink-0 mr-1.5" />
                            Restore Achieved
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => setHideOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-700"
                                : "text-gray-600",
                              "flex items-center hover:bg-secondary font-medium cursor-pointer px-4 py-2 text-sm"
                            )}
                          >
                            <EyeOff className="h-4 w-4 shrink-0 mr-1.5" /> Hide
                            All Messages
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            onClick={() => setDeleteAllOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-700"
                                : "text-destructive-foreground",
                              "flex items-center font-medium cursor-pointer hover:text-destructive-foreground hover:bg-destructive px-4 py-2 text-sm"
                            )}
                          >
                            <Trash className="h-4 w-4 shrink-0 mr-1.5" /> Delete
                            All Messages
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        <section aria-labelledby="products-heading" className="">
          <div className="grid grid-cols-1 pb-4 gap-y-4 sm:grid-cols-4">
            <div
              className="sm:col-span-3 sm:max-h-[calc(100vh-155px)] sm:min-h-[calc(100vh-155px)] sm:overflow-y-scroll sm:mr-24 scrollable-container"
              ref={containerRef}
            >
              <div className="mr-1 pt-1 lg:mr-1.5">
                <DetailWorkerRender
                  oneUserMessages={oneUserMessages}
                  userExists={userExists}
                  allOneUserMessages={allOneUserMessages}
                />
              </div>
            </div>
            <div className="sm:max-h-[calc(100vh-155px)] hidden sm:block sm:min-h-[calc(100vh-155px)] sm:overflow-y-scroll sm:-ml-24 bg-white flex-col gap-y-6">
              <div className="h-full flex-col ml-1 lg:ml-1.5 lg:mr-1.5  mr-1">
                <DetailWorkerCard
                  workerMessages={workerMessages}
                  workersWithMessages={workersWithMessages}
                  userExists={userExists}
                  users={users}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WorkerMessageDetails;