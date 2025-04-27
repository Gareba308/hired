"use client";

import QuillPreview from "@/components/QuillPreview";
import { Button } from "@/components/ui/button";
import { AssessmentBanner } from "@prisma/client";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRight,
  Award,
  Edit,
  Loader2,
  MoreVertical,
  Trash,
} from "lucide-react";
import React, { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { DeleteBannerAlertModal } from "../models/assessments/DeleteBanner";
import NoAssessmentSecond from "./NoAssessmentSecond";

interface AllAssessmentsProps {
  banners: AssessmentBanner[];
}
const AllAssessments = ({ banners }: AllAssessmentsProps) => {
  const router = useRouter();
  const { toast } = useToast();

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [currentlyDeletingID, setCurrentlyDeletingID] = useState<null | string>(
    null
  );

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const deleteClose = () => {
    setDeleteOpen((prev) => !prev);
    setCurrentlyDeletingID(null);
  };

  const toggleDelete = (bannerID: string) => {
    setDeleteOpen(true);
    setCurrentlyDeletingID(bannerID);
  };

  const { mutate: deleteContent, isLoading: deleteLoading } =
    trpc.adminDeleteAssessmentBanner.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully deleted this assessment banner",
          variant: "default",
          duration: 3000,
        });
        deleteClose();
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message || "There was a problem deleting this banner",
          variant: "destructive",
          duration: 3000,
        });
        deleteClose();
      },

      onMutate: ({ bannerID }) => {
        setCurrentlyDeletingID(bannerID);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    });

  const deleteConfirm = (bannerID: string) => {
    setCurrentlyDeletingID(bannerID);
    deleteContent({ bannerID });
  };
  return (
    <div>
      {banners.length !== 0 ? (
        <div className="mx-auto max-w-7xl relative">
          <div className="mx-auto grid grid-cols-1 gap-x-3 lg:gap-x-4 gap-y-4 pt-1 lg:mx-0 lg:max-w-none sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {banners.flatMap((banner) => (
              <div
                key={banner.id}
                className="flex flex-col border border-gray-200 text-gray-700 rounded-sm w-full items-start"
              >
                <div className="flex items-center justify-between gap-x-4 px-2 py-2 rounded-t-sm bg-primary w-full text-primary-foreground text-lg">
                  <div className="text-lg line-clamp-1 capitalize font-bold">
                    {banner.category}
                  </div>
                  <div>
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between h-full">
                  <div>
                    <div className="px-2 mt-2">
                      <h2 className="flex-wrap text-lg font-medium">
                        {banner.name}
                      </h2>
                    </div>

                    <div className="px-2 w-full">
                      <div className="text-base font-normal w-full">
                        <QuillPreview htmlContent={banner.briefSummary} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="px-2 mt-2 flex items-center justify-between w-full gap-x-3">
                      <Button
                        variant="default"
                        size="default"
                        onClick={() =>
                          router.push(
                            `/control/assessments/${banner.id}?origin=control/assessments`
                          )
                        }
                        type="button"
                        className="bg-primary text-normal text-primary-foreground hover:bg-primary hover:opacity-95"
                      >
                        Check Details <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Button>
                      <span className="text-base font-medium">
                        {banner.numberQuestions} Quiz
                      </span>
                    </div>

                    <div className="px-2 mt-2 mb-1 w-full items-center text-base font-medium flex flex-row justify-between gap-x-3">
                      <h3>Available Attempts: {banner.attemptNumbers}</h3>
                      <div>
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          {currentlyDeletingID === banner.id && (
                            <DeleteBannerAlertModal
                              isOpen={deleteOpen}
                              onClose={deleteClose}
                              onConfirm={() => deleteConfirm(banner.id)}
                              loading={deleteLoading}
                            />
                          )}
                          <div>
                            <Menu.Button
                              disabled={
                                currentlyDeletingID === banner.id &&
                                deleteLoading
                              }
                              className="inline-flex justify-center items-center gap-x-1.5 rounded-md px-1.5 py-2 text-sm font-semibold text-gray-900 hover:bg-secondary"
                            >
                              {currentlyDeletingID === banner.id &&
                              deleteLoading ? (
                                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                              ) : (
                                <MoreVertical className="h-5 w-5" />
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
                            <Menu.Items className="absolute divide-y divide-gray-200 bottom-full z-10 mb-1 w-48 origin-bottom-left rounded-sm bg-white shadow-top-md border border-gray-300 focus:outline-none right-0">
                              <div className="bg-slate-200 rounded-tl-sm rounded-tr-sm">
                                <h2 className="px-4 font-medium text-base text-gray-600 py-2">
                                  Banner Options
                                </h2>
                              </div>
                              <div>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href={`/control/assessments/create-assessment/banner/${banner.id}?origin=control/assessments`}
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "px-4 py-2.5 flex items-center cursor-pointer text-sm"
                                      )}
                                    >
                                      <Edit className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                                      Edit Banner
                                    </Link>
                                  )}
                                </Menu.Item>
                              </div>
                              <div>
                                <Menu.Item>
                                  {({ active }) => (
                                    <span
                                      onClick={() => toggleDelete(banner.id)}
                                      className={classNames(
                                        active
                                          ? "text-secondary-foreground bg-secondary"
                                          : "text-destructive-foreground",
                                        "flex items-center cursor-pointer font-medium hover:text-destructive-foreground hover:bg-destructive px-4 py-2.5 text-sm"
                                      )}
                                    >
                                      <Trash className="h-4 w-4 mr-1.5 shrink-0" />
                                      Delete Banner
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoAssessmentSecond />
      )}
    </div>
  );
};

export default AllAssessments;
