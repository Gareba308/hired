"use client";

import { Button } from "@/components/ui/button";
import {
  CornerUpLeft,
  Loader2,
  Mail,
  MoveRight,
  Printer,
  SquareSlash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CoverLetter from "./CoverLetter";
import { Application } from "@prisma/client";
import MessageWorkerModal from "./MessageWorkerModal";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface ApplicationsRenderProps {
  application: Application;
}

const ApplicationsRender = ({ application }: ApplicationsRenderProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [rating, setRating] = useState<number>(application.ratingLetter || 0);
  const [messageOpen, setMessageOpen] = React.useState<boolean>(false);
  const messageOnClose = () => setMessageOpen((current) => !current);
  const messageOnConfirm = () => setMessageOpen((current) => !current);

  const { mutate: rateCoverLetter, isLoading } =
    trpc.employerRateCoverLetter.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const handleRatingClick = (value: number) => {
    let newRating: number;
    if (value === rating) {
      newRating = rating - 1;
    } else {
      newRating = rating < value ? value : value - 1;
    }
    setRating(newRating);
    rateCoverLetter({ applicationID: application.id, ratingLetter: newRating });
  };
  return (
    <>
      <main className="mx-auto lg:-mt-2 max-w-7xl">
        <section>
          <div className="flex flex-wrap">
            <div className="w-full lg:mt-2 pt-2 pb-4 mx-auto lg:w-2/3">
              <h2 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
                The Cover Letter
              </h2>
              <div className="lg:col-span-3 mt-2 pb-2">
                <CoverLetter application={application} />
              </div>
            </div>

            <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
              <div className="flex flex-col w-full h-full">
                <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                  <div className="flex justify-between gap-y-6 flex-col">
                    <div className="lg:block py-4 rounded-none px-2.5 lg:pb-3 lg:space-y-4 shadow-sm bg-slate-200 border border-slate-200 lg:pt-2.5">
                      <h2 className="text-[19px] flex items-center text-start text-gray-700 font-semibold">
                        {isLoading && (
                          <Loader2 className="h-5 w-5 mr-1 shrink-0 animate-spin" />
                        )}
                        Rate Cover Letter
                      </h2>
                      <div>
                        <div className="flex items-center gap-x-1 flex-row">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <svg
                              key={value}
                              viewBox="0 0 1920 1920"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 cursor-pointer"
                              stroke="#005580"
                              onClick={() => handleRatingClick(value)}
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {value <= rating ? (
                                  <path
                                    d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                                    fill="#005580"
                                    fillRule="evenodd"
                                  />
                                ) : (
                                  <path
                                    d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                                    fill="#005580"
                                    fillRule="evenodd"
                                  />
                                )}
                              </g>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-base flex items-center text-gray-600">
                          <span className="mr-1">Rating:</span>
                          {application.ratingLetter}/5
                          <MoveRight className="h-4 w-4 text-gray-600 ml-2 shrink-0" />
                          <span className="ml-1">
                            ({(application.ratingLetter! / 5) * 20}%)
                          </span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-medium mr-1">Note:</span>Cover
                          letter rating represents 20% of the total score a
                          candidate can obtain.
                        </p>
                      </div>
                    </div>

                    <div className=" flex  mt-6 lg:mt-0 flex-col h-full justify-center">
                      <div className="lg:block py-4 rounded-none px-2.5 lg:pb-3 lg:space-y-4 shadow-sm bg-slate-200 border border-slate-200 lg:pt-2.5">
                        <h2 className="text-[19px] text-start text-gray-700 font-semibold">
                          Further Actions
                        </h2>
                        <div className="flex w-full mb-2 justify-between flex-col gap-y-5">
                          <MessageWorkerModal
                            isOpen={messageOpen}
                            onClose={messageOnClose}
                            onConfirm={messageOnConfirm}
                            applicationID={application.id}
                          />
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setMessageOpen(true)}
                            className="rounded-sm  hover:bg-primary hover:opacity-90 font-normal"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-sm bg-slate-800 hover:bg-slate-800 hover:opacity-90 font-normal"
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 w-full">
                          <span className="font-semibold">Optional:</span> Send
                          this candidate a message concerning their cover
                          letter.
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
    </>
  );
};

export default ApplicationsRender;
