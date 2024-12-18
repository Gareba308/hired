"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Printer, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
import PdfResume from "./PdfResume";

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
              <div className="w-full min-h-[calc(100vh-90px)] lg:mt-2 pt-2 pb-4 mx-auto print:shadow-none bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
                <div className="flex w-full items-end px-4 justify-between print:hidden pb-1">
                  <div className="flex items-center gap-x-1.5">
                    <h3 className="font-bold text-gray-600 tracking-tight text-2xl lg:text-3xl">
                      <span className="hidden md:flex">Generated Resume</span>
                      <span className="md:hidden">Resume</span>
                    </h3>
                  </div>
                  <PDFDownloadLink
                    document={<PdfResume document={application} />}
                    fileName="clean-resume.pdf"
                    className="bg-primary text-primary-foreground hover:bg-primary py-1.5 px-2 rounded-sm"
                  >
                    {/*@ts-ignore*/}
                    {({ loading }: { loading: boolean }): React.ReactNode =>
                      loading ? (
                        <span className="text-base flex flex-row items-center">
                          <Loader2 className="h-4 w-4 mr-1.5 shrink-0 animate-spin" />
                          <span>Loading...</span>
                        </span>
                      ) : (
                        <span className="text-base">Download PDF</span>
                      )
                    }
                  </PDFDownloadLink>
                </div>
                <div>
                  <div className="bg-gray-100  px-4 border-b border-t border-gray-200 py-2 sm:py-3 text-gray-700">
                    <p className="text-xs">
                      <span>Note: </span>Below is a preliminary draft of your
                      resume. For a polished and high-quality version, please
                      use the download button above.
                    </p>
                  </div>

                  <div
                    id="divToPrint"
                    className="lg:col-span-3 px-4 lg:mt-1.5 lg:pb-2"
                  >
                    <DocumentDetails document={application} />
                  </div>
                </div>
              </div>

              <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
                <div className="flex flex-col w-full h-full">
                  <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                    <div className="flex justify-between gap-y-6 flex-col">
                      <div className="lg:block rounded-none py-4 px-4 lg:pb-4 lg:space-y-4 shadow-sm bg-slate-200 border border-slate-200 lg:pt-3">
                        <div>
                          <h2 className="text-[18px] mb-1 flex items-center text-start text-gray-700 font-semibold">
                            Resume Evaluation
                          </h2>
                          <p className="text-xs text-gray-700">
                            Based on the details you provide regarding your
                            experience, qualifications, and skills, our system
                            will calculate your job compatibility score.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-700 mt-1.5">
                            <span className="font-semibold">Note:</span> If you
                            upload your own resume, it will be optionally
                            available to employers for review.
                          </p>
                        </div>
                      </div>

                      <div className="flex mt-4 lg:mt-0 flex-col h-full justify-center">
                        <div className="lg:block py-4 rounded-none px-4 lg:pb-4 lg:space-y-4 shadow-sm bg-slate-200 border border-slate-200 lg:pt-3">
                          <h2 className="text-[18px] text-start text-gray-700 font-semibold">
                            Further Actions
                          </h2>
                          <div className="flex w-full mb-1 justify-between flex-col gap-y-5">
                            <Button
                              variant="default"
                              size="default"
                              onClick={() => printDivCandidate()}
                              className="rounded-sm bg-slate-800 hover:bg-slate-800 hover:opacity-90 font-normal"
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Print
                            </Button>
                          </div>
                          <div>
                            <p className="text-xs text-gray-700 w-full">
                              This resume is generated from your profile and
                              portfolio details.
                            </p>
                            <p className="text-xs mt-1 text-gray-700 w-full">
                              <span className="font-medium">Optional:</span>{" "}
                              Ensure you have an upto date resume any time
                              before sending your job application..
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
