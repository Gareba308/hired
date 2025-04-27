"use client";

import React, { Fragment, useState } from "react";
import { EmployerPlans } from "@prisma/client";
import NoPlan from "./NoPlan";
import { Menu, Transition } from "@headlessui/react";
import { Edit, Loader2, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { DeletePlanAlertModal } from "../models/plans/DeletePlan";

interface AllPlansProps {
  plans: EmployerPlans[];
}

const AllPlans = ({ plans }: AllPlansProps) => {
  const { toast } = useToast();
  const router = useRouter();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [currentlyDeletingPlanID, setCurrentlyDeletingPlanID] = useState<
    string | null
  >(null);

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const deleteClose = () => {
    setDeleteOpen((prev) => !prev);
    setCurrentlyDeletingPlanID(null);
  };

  const toggleDelete = (planID: string) => {
    setDeleteOpen(true);
    setCurrentlyDeletingPlanID(planID);
  };

  const { mutate: deletePlan, isLoading } =
    trpc.adminDeleteEmployerPlan.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully deleted this pricing plan",
          variant: "default",
          duration: 3000,
        });
        deleteClose();
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description: err.message
            ? err.message
            : "There was a problem deleting this plan",
          variant: "destructive",
          duration: 3000,
        });
      },
      onMutate: ({ planID }) => {
        setCurrentlyDeletingPlanID(planID);
      },
      onSettled: () => {
        setCurrentlyDeletingPlanID(null);
      },
    });

  const deleteConfirm = (planID: string) => {
    setCurrentlyDeletingPlanID(planID);
    deletePlan({ planID: planID });
  };
  return (
    <section className="pb-4">
      {plans.length > 0 ? (
        <div className="mx-auto text-gray-600">
          <div className="mt-4 sm:mt-2 space-y-6 justify-center gap-6 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
            {plans.map((item) => (
              <div
                key={item.id}
                className="relative flex-1 flex items-stretch flex-col p-8 rounded-xl border-2 border-gray-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-x-2">
                    <span className="text-gray-700 font-medium">
                      {item.name}
                    </span>
                    <div>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        {currentlyDeletingPlanID === item.id && (
                          <DeletePlanAlertModal
                            isOpen={deleteOpen}
                            onClose={deleteClose}
                            onConfirm={() => deleteConfirm(item.id)}
                            loading={isLoading}
                          />
                        )}
                        <div>
                          <Menu.Button
                            disabled={
                              currentlyDeletingPlanID === item.id && isLoading
                            }
                            className="inline-flex justify-center items-center gap-x-1.5 rounded-md px-1.5 py-2 text-sm font-semibold text-gray-900 hover:bg-secondary"
                          >
                            {currentlyDeletingPlanID === item.id &&
                            isLoading ? (
                              <Loader2 className="h-4  w-4 shrink-0 animate-spin" />
                            ) : (
                              <MoreVertical className="h-5 w-5 shrink-0" />
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
                          <Menu.Items className="absolute divide-y divide-gray-200 top-full z-10 mt-1 w-48 origin-top-right rounded-sm bg-white shadow-bottom-md border border-gray-300 focus:outline-none right-0">
                            <div className="bg-slate-200 rounded-tl-sm rounded-tr-sm">
                              <h2 className="px-4 font-medium text-base text-gray-600 py-2">
                                Plan Options
                              </h2>
                            </div>
                            <div>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/control/plans/${item.id}`}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "px-4 py-2.5 flex items-center cursor-pointer text-sm"
                                    )}
                                  >
                                    <Edit className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                                    Edit Plan
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                            <div>
                              <Menu.Item>
                                {({ active }) => (
                                  <span
                                    onClick={() => toggleDelete(item.id)}
                                    className={classNames(
                                      active
                                        ? "text-secondary-foreground bg-secondary"
                                        : "text-destructive-foreground",
                                      "flex items-center cursor-pointer font-medium hover:text-destructive-foreground hover:bg-destructive px-4 py-2.5 text-sm"
                                    )}
                                  >
                                    <Trash className="h-4 w-4 mr-1.5 shrink-0" />
                                    Delete Plan
                                  </span>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-800 text-2xl font-semibold">
                    Ksh.{item.price}{" "}
                    <span className="text-lg text-gray-600 font-normal">
                      /{item.unit} unit
                    </span>
                  </div>
                </div>
                <ul className="py-8 space-y-3">
                  <li className="flex text-base shrink-0 items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {item.feature1}
                  </li>
                  <li className="flex text-base shrink-0 items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {item.feature2}
                  </li>
                  <li className="flex text-base shrink-0 items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {item.feature3}
                  </li>
                  <li className="flex text-base shrink-0 items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {item.feature4}
                  </li>
                  <li className="flex text-base shrink-0 items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {item.feature5}
                  </li>
                  <li className="flex text-base shrink-0 items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {item.feature6}
                  </li>
                </ul>
                <div className="flex-1 flex items-end">
                  <button
                    onClick={() => router.push(`/control/plans/${item.id}`)}
                    className="px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-white bg-slate-800 hover:opacity-90 active:bg-primary"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoPlan />
      )}
    </section>
  );
};

export default AllPlans;
