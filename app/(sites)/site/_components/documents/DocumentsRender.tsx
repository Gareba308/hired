"use client";

import { Button } from "@/components/ui/button";
import { CornerUpLeft, ExternalLink, Printer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  About,
  Award,
  CertificationLicense,
  Experience,
  Language,
  Resume,
  SecondaryEducation,
  Skills,
  TertiaryEducation,
  User,
  WorkerBio,
  WorkerContact,
} from "@prisma/client";
import Link from "next/link";
import DocumentDetails from "./DocumentDetails";
import { useToast } from "@/components/ui/use-toast";

interface DocumentsRenderItems {
  dbUser: User;
  about: About | null;
  experiences: Experience[];
  secondary: SecondaryEducation | null;
  tertiary: TertiaryEducation[];
  bio: WorkerBio | null;
  certification: CertificationLicense[];
  awards: Award[];
  languages: Language[];
  contact: WorkerContact | null;
  resume: Resume | null;
  skills: Skills | null;
}

interface DocumentsRenderProps {
  document: DocumentsRenderItems;
}

const DocumentsRender = ({ document: application }: DocumentsRenderProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");

  const functionOpenResume = (resumeURL: string) => {
    if (resumeURL) {
      window.open(resumeURL, "_blank");
    } else {
      toast({
        title: "No resume available",
        description:
          "Sorry, you have not uploaded a resume. Upload to be able to open in this section",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const printDivCandidate = () => {
    const printableArea = document.getElementById("divToPrint");
    if (printableArea) {
      window.print();
    } else {
      toast({
        title: "Something went wrong",
        description: "Could not find the element to print.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <div>
        <main className="mx-auto lg:-mt-2 max-w-7xl">
          <section>
            <div className="flex flex-wrap">
              <div className="w-full min-h-[calc(100vh-90px)] lg:mt-2 px-4 pt-2 pb-4 mx-auto print:shadow-none bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
                <div className="flex w-full items-end justify-between print:hidden border-b border-gray-300 pb-1">
                  <div className="flex items-center gap-x-1.5">
                      <h3 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl lg:text-3xl">
                        Generated Resume
                      </h3>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() =>
                      functionOpenResume(application.resume?.resume as string)
                    }
                    variant="default"
                    className="rounded-sm font-normal text-base bg-primary hover:bg-primary hover:opacity-90"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Uploaded
                  </Button>
                </div>
                <div id="divToPrint" className="lg:col-span-3 lg:mt-3 lg:pb-2">
                  <DocumentDetails document={application} />
                </div>
              </div>

              <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
                <div className="flex flex-col w-full h-full">
                  <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                    <div className="flex justify-between gap-y-6 flex-col">
                      <div className="lg:block rounded-none py-4 px-4 lg:pb-3 lg:space-y-4 shadow-sm bg-slate-200 border border-slate-200 lg:pt-2.5">
                        <div>
                          <h2 className="text-[18px] mb-2 flex items-center text-start text-gray-700 font-semibold">
                            Overall Resume Rating
                          </h2>
                          <p className="text-xs text-gray-700">
                            Overall rating is part of resume not rated, will be
                            upto a maximum of 20% of the total score.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-sm -mt-1 flex items-center text-gray-600">
                            <span className="mr-1">Overall:</span>
                            something
                          </p>
                          <p className="text-xs text-gray-700 mt-1.5">
                            <span className="font-semibold">N/B:</span> The
                            profile resume can only represent upto a maximum of
                            60% of total score.
                          </p>
                          <p className="font-medium text-sm flex mt-1 items-center text-gray-600">
                            <span className="mr-1">Profile:</span>
                            something
                          </p>
                        </div>
                      </div>

                      <div className="flex mt-4 lg:mt-0 flex-col h-full justify-center">
                        <div className="lg:block py-4 rounded-none px-4 lg:pb-3 lg:space-y-4 shadow-sm bg-slate-200 border border-slate-200 lg:pt-2.5">
                          <h2 className="text-[18px] text-start text-gray-700 font-semibold">
                            Further Actions
                          </h2>
                          <div className="flex w-full mb-2 justify-between flex-col gap-y-5">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => printDivCandidate()}
                              className="rounded-sm bg-slate-800 hover:bg-slate-800 hover:opacity-90 font-normal"
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Print
                            </Button>
                          </div>
                          <div>
                            <p className="text-xs text-gray-700 w-full">
                              This resume is generated from candidate&apos;s
                              profile details.
                            </p>
                            <p className="text-xs mt-1 text-gray-700 w-full">
                              <span className="font-medium">Optional:</span>{" "}
                              Send this candidate a message concerning their
                              generated resume.
                            </p>
                          </div>
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

export default DocumentsRender;
